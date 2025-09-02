"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ref, push, onValue, off, set, update } from "firebase/database";
import { db } from "../../firebase.js";

export default function ChatPage() {
  const router = useRouter();

  const [user, setUser] = useState("");

  useEffect(() => {
    // Prefer navigation state, then session storage
    let fromState = null;
    try {
      fromState = window.history.state?.user || null;
    } catch {}

    const stored = sessionStorage.getItem("pc_user");
    const resolved = (fromState || stored || "").toLowerCase();

    if (resolved === "shinas" || resolved === "aparna") {
      setUser(resolved);
      // keep session fresh
      sessionStorage.setItem("pc_user", resolved);
      return;
    }

    router.replace("/auth");
  }, [router]);

  const isAuthed = user === "shinas" || user === "aparna";

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recorder, setRecorder] = useState(null);
  const [recordingStream, setRecordingStream] = useState(null);
  const chunksRef = useRef([]);
  const [pendingBlob, setPendingBlob] = useState(null);
  const [pendingMime, setPendingMime] = useState("audio/webm");
  const timerRef = useRef(null);
  const autoStopRef = useRef(null);

  const messagesEndRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load messages from Firebase (guard when not authed)
  useEffect(() => {
    if (!isAuthed) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const messagesRef = ref(db, "messages");
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        
        // Filter: show last week OR any liked message
        const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        const recentOrLiked = messageList.filter(msg => {
          const isRecent = typeof msg.timestamp === 'number' && msg.timestamp > oneWeekAgo;
          const hasLikes = Array.isArray(msg.likes) && msg.likes.length > 0;
          return isRecent || hasLikes;
        });
        
        // Sort by timestamp (oldest first)
        recentOrLiked.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        
        setMessages(recentOrLiked);
      } else {
        setMessages([]);
      }
      setIsLoading(false);
    });

    return () => off(messagesRef, "value", unsubscribe);
  }, [isAuthed]);

  // Send text message
  const sendMessage = async () => {
    if (!isAuthed) return;
    if (newMessage.trim()) {
      const messageData = {
        text: newMessage,
        sender: user,
        timestamp: Date.now(),
        type: "text",
        likes: []
      };

      try {
        await push(ref(db, "messages"), messageData);
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  // Begin recording with overlay
  const openRecorder = async () => {
    if (!isAuthed || isRecording) return;
    try {
      const constraints = { audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      let mimeType = "audio/webm;codecs=opus";
      if (!window.MediaRecorder || !MediaRecorder.isTypeSupported || !MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = MediaRecorder?.isTypeSupported?.("audio/webm") ? "audio/webm" : "";
      }

      const rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType || "audio/webm" });
        setPendingBlob(blob);
        setPendingMime(mimeType || "audio/webm");
      };

      setRecordingStream(stream);
      setRecorder(rec);
      setRecordingSeconds(0);
      setPendingBlob(null);
      setPendingMime(mimeType || "audio/webm");

      rec.start(250);
      setIsRecording(true);
    } catch (err) {
      console.error("Cannot start recording:", err);
    }
  };

  const clearTimers = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (autoStopRef.current) {
      clearTimeout(autoStopRef.current);
      autoStopRef.current = null;
    }
  };

  // Drive timer and auto-stop off isRecording state for reliable updates
  useEffect(() => {
    if (!isRecording) {
      clearTimers();
      return;
    }
    // start timer
    timerRef.current = setInterval(() => {
      setRecordingSeconds((s) => s + 1);
    }, 1000);
    // auto stop at 30s
    autoStopRef.current = setTimeout(() => {
      stopRecorder(true);
    }, 30000);

    return () => {
      clearTimers();
    };
  }, [isRecording]);

  const stopRecorder = (autoSend = false) => {
    try {
      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      }
    } catch {}
    try {
      recordingStream?.getTracks().forEach(t => t.stop());
    } catch {}
    setIsRecording(false);

    if (autoSend) {
      // Wait a task for onstop to set pendingBlob, then send
      setTimeout(() => {
        if (pendingBlob) {
          sendVoiceBlob(pendingBlob, pendingMime);
          setPendingBlob(null);
        } else {
          const blob = new Blob(chunksRef.current, { type: pendingMime || "audio/webm" });
          if (blob.size > 0) {
            sendVoiceBlob(blob, pendingMime || "audio/webm");
          }
        }
      }, 50);
    }
  };

  const cancelRecording = () => {
    try {
      if (recorder && recorder.state !== "inactive") recorder.stop();
    } catch {}
    try {
      recordingStream?.getTracks().forEach(t => t.stop());
    } catch {}
    setIsRecording(false);
    chunksRef.current = [];
    setPendingBlob(null);
  };

  const sendVoiceBlob = async (blob, mime) => {
    if (!isAuthed || !blob) return;
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Audio = reader.result;
        const messageData = {
          audio: base64Audio,
          mimeType: mime || "audio/webm",
          sender: user,
          timestamp: Date.now(),
          type: "voice",
          likes: []
        };
        await push(ref(db, "messages"), messageData);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Error sending voice message:", error);
    }
  };

  // Toggle like on message (fix: update only likes field)
  const toggleLike = async (messageId, currentLikes) => {
    if (!isAuthed) return;
    try {
      const messageRef = ref(db, `messages/${messageId}`);
      const safeLikes = Array.isArray(currentLikes) ? currentLikes : [];
      const newLikes = safeLikes.includes(user)
        ? safeLikes.filter(likeUser => likeUser !== user)
        : [...safeLikes, user];
      await update(messageRef, { likes: newLikes });
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  // Handle emoji selection
  const handleEmojiClick = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Exit function
  const handleExit = () => {
    sessionStorage.removeItem("pc_user");
    try {
      window.history.replaceState({}, "", "/auth");
    } catch {}
    router.replace("/auth");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
      try { recorder?.stop?.(); } catch {}
      try { recordingStream?.getTracks?.().forEach(t => t.stop()); } catch {}
    };
  }, [recorder, recordingStream]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-green-600 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-green-600 font-bold text-lg">
              {isAuthed ? user == "shinas" ? "A" : "S" : "?"}
              
            </span>
          </div>
          <div>
            <div className="font-semibold">{isAuthed && user == "shinas" ? "Aparna" : "Shinas"}</div>
            {/* <div className="text-xs text-green-100">{isAuthed ? "Online" : ""}</div> */}
          </div>
        </div>
        <button
          onClick={handleExit}
          className="text-white hover:text-green-200 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isAuthed ? (
          isLoading ? (
            <div className="space-y-3">
              <div className="w-2/3 h-10 bg-gray-200 rounded-xl animate-pulse" />
              <div className="w-1/2 h-10 bg-gray-200 rounded-xl animate-pulse ml-auto" />
              <div className="w-3/4 h-10 bg-gray-200 rounded-xl animate-pulse" />  
              <div className="w-3/4 h-10 bg-gray-200 rounded-xl animate-pulse ml-auto" />  
              <div className="w-3/4 h-10 bg-gray-200 rounded-xl animate-pulse" />  
              <div className="w-3/4 h-10 bg-gray-200 rounded-xl animate-pulse ml-auto" />  
              <div className="w-3/4 h-10 bg-gray-200 rounded-xl animate-pulse" />  
              <div className="w-3/4 h-10 bg-gray-200 rounded-xl animate-pulse ml-auto" />  
              <div className="w-3/4 h-10 bg-gray-200 rounded-xl animate-pulse" />  
              <div className="w-3/4 h-10 bg-gray-200 rounded-xl animate-pulse ml-auto" />  
              <div className="w-3/4 h-10 bg-gray-200 rounded-xl animate-pulse" />  
              <div className="w-3/4 h-10 bg-gray-200 rounded-xl animate-pulse ml-auto" />  
              <div className="w-3/4 h-10 bg-gray-200 rounded-xl animate-pulse" />  
              <div className="w-3/4 h-10 bg-gray-200 rounded-xl animate-pulse ml-auto" />  
              <div className="w-3/4 h-10 bg-gray-200 rounded-xl animate-pulse" />  
              <div className="w-3/4 h-10 bg-gray-200 rounded-xl animate-pulse ml-auto" />  
              <div className="w-3/4 h-10 bg-gray-200 rounded-xl animate-pulse" />  
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === user ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === user
                      ? "bg-green-500 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  {message.type === "text" ? (
                    <div>{message.text}</div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>🎤</span>
                      <audio controls className="w-36 h-9">
                        <source src={message.audio} type={message.mimeType || "audio/webm"} />
                      </audio>
                    </div>
                  )}
                  
                  {/* Message footer with timestamp and like */}
                  <div className={`flex items-center justify-between mt-2 text-xs ${
                    message.sender === user ? "text-green-100" : "text-gray-500"
                  }`}>
                    <span>
                      {new Date(message.timestamp).toLocaleString([], { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </span>
                    <button
                      onClick={() => toggleLike(message.id, message.likes || [])}
                      className={`ml-2 flex items-center space-x-1 ${
                        (message.likes || []).includes(user) 
                          ? "text-blue-600" 
                          : "text-gray-400 hover:text-blue-500"
                      }`}
                      title={(message.likes || []).includes(user) ? "Liked" : "Like"}
                    >
                      <span>👍</span>
                      <span>{message.likes?.length || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">Redirecting…</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer Input */}
      <div className="bg-white border-t px-4 py-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-2xl hover:text-green-600 transition-colors"
            disabled={!isAuthed || isRecording}
          >
            😊
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 text-black focus:ring-green-500"
              disabled={!isAuthed || isRecording}
            />
          </div>
          
          <button
            onClick={openRecorder}
            className={`text-2xl p-2 rounded-full transition-colors ${
              isRecording 
                ? "bg-red-500 text-white" 
                : "hover:bg-green-100 text-green-600"
            }`}
            title="Tap to record voice message"
            disabled={!isAuthed}
          >
            🎤
          </button>
          
          <button
            onClick={sendMessage}
            disabled={!isAuthed || !newMessage.trim() || isRecording}
            className="text-2xl p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ➤
          </button>
        </div>
      </div>

      {/* Recording overlay */}
      {isRecording && (
        <div className="fixed inset-x-0 bottom-0 z-50 bg-white border-t shadow-lg p-4">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <div className="text-gray-700 font-medium">Recording… {String(Math.floor(recordingSeconds / 60)).padStart(2,'0')}:{String(recordingSeconds % 60).padStart(2,'0')}</div>
              <div className="text-xs text-gray-400">(max 30s)</div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => { cancelRecording(); }}
                className="px-4 py-2 rounded-full border text-gray-700 hover:bg-gray-50"
              >
                Delete
              </button>
              <button
                onClick={() => { stopRecorder(false); setTimeout(() => { if (pendingBlob) { sendVoiceBlob(pendingBlob, pendingMime); setPendingBlob(null); } else { const blob = new Blob(chunksRef.current, { type: pendingMime || 'audio/webm' }); if (blob.size>0) sendVoiceBlob(blob, pendingMime || 'audio/webm'); } }, 50); }}
                className="px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && isAuthed && !isRecording && (
        <div className="absolute bottom-20 left-4 bg-white border rounded-lg p-2 shadow-lg">
          <div className="grid grid-cols-8 gap-1">
            {["😊", "😂", "❤️", "👍", "🎉", "🔥", "😍", "🤔", "😭", "😡", "😴", "🤗", "👋", "🙏", "💪", "✨"].map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleEmojiClick(emoji)}
                className="text-2xl hover:bg-gray-100 rounded p-1"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
