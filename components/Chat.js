"use client";
import { useEffect, useState } from "react";
import { db } from "@/firebase";
import {
  ref,
  push,
  onValue,
  query,
  orderByChild,
  startAt,
} from "firebase/database";
import EmojiPicker from "emoji-picker-react";

export default function Chat() {
  const params = new URLSearchParams(window.location.search);
  const user = params.get("user"); // "urshad" or "urfan"

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  // Fetch messages from last 7 days
  useEffect(() => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const messagesRef = query(
      ref(db, "messages"),
      orderByChild("timestamp"),
      startAt(oneWeekAgo)
    );

    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val() || {};
      const arr = Object.entries(data).map(([id, msg]) => ({ id, ...msg }));
      setMessages(arr.sort((a, b) => a.timestamp - b.timestamp));
    });
  }, []);

  // Send message
  const sendMessage = async () => {
    if (!text.trim()) return;
    push(ref(db, "messages"), {
      sender: user,
      text,
      likes: 0,
      timestamp: Date.now(),
      type: "text",
    });
    setText("");
  };

  // Send voice
  const toggleRecord = async () => {
    if (recording) {
      mediaRecorder.stop();
      setRecording(false);
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          push(ref(db, "messages"), {
            sender: user,
            audio: reader.result,
            likes: 0,
            timestamp: Date.now(),
            type: "voice",
          });
        };
        reader.readAsDataURL(blob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    }
  };

  // Like message
  const likeMessage = (id, likes) => {
    import("firebase/database").then(({ ref, update }) => {
      update(ref(db, `messages/${id}`), { likes: likes + 1 });
    });
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-lg shadow p-4 flex flex-col">
      <div className="flex-1 overflow-y-auto mb-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 mb-2 rounded ${
              msg.sender === user ? "bg-blue-100 text-right" : "bg-gray-100"
            }`}
          >
            {msg.type === "text" && <p>{msg.text}</p>}
            {msg.type === "voice" && (
              <audio controls src={msg.audio} className="w-full" />
            )}
            <button
              onClick={() => likeMessage(msg.id, msg.likes)}
              className="text-sm text-blue-500 mt-1"
            >
              👍 {msg.likes}
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => setShowEmoji(!showEmoji)}>😊</button>
        {showEmoji && (
          <EmojiPicker
            onEmojiClick={(e) => setText(text + e.emoji)}
            height={300}
          />
        )}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border p-2 rounded"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-3 py-1 rounded">
          Send
        </button>
        <button
          onClick={toggleRecord}
          className={`px-3 py-1 rounded ${
            recording ? "bg-red-500 text-white" : "bg-gray-300"
          }`}
        >
          🎤
        </button>
      </div>
    </div>
  );
}
