"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const runSearch = () => {
    if (searchQuery.trim().toLowerCase().includes("xylem +2 note")) {
      router.push("/results");
      return;
    }
    const q = encodeURIComponent(searchQuery);
    window.open(`https://www.google.com/search?q=${q}`, "_blank");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="google-header">
        <nav className="google-nav">
          <a href="#" className="google-nav-link">Gmail</a>
          <a href="#" className="google-nav-link">Images</a>
          <div className="google-apps" title="Google apps">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M6,8c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM12,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM6,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM6,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM12,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM16,6c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM12,8c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM18,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM18,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM18,8c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2z"></path>
            </svg>
          </div>
          <button className="google-signin">Sign in</button>
        </nav>
      </header>

      {/* Main */}
      <main className="google-main">
        <div className="google-logo-wrap">
          <img src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" alt="Google" className="google-logo" />
        </div>
        <div className="google-search-wrap">
          <form onSubmit={handleSubmit}>
            <div className="google-searchbox">
              <svg className="icon" viewBox="0 0 24 24" width="20" height="20">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
              </svg>
              <input
                type="text"
                className="google-input"
                placeholder="Search Google or type a URL"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <svg className="icon" viewBox="0 0 24 24" width="20" height="20">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"></path>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"></path>
              </svg>
            </div>
            <div className="google-actions">
              <button className="google-btn" type="submit">Google Search</button>
              <button className="google-btn" type="button" onClick={() => window.open("https://www.google.com/doodles", "_blank")}>I'm Feeling Lucky</button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="google-footer">
        <div className="google-footer-inner">
          <div className="google-footer-left">
            <a href="#" className="google-footer-link">About</a>
            <a href="#" className="google-footer-link">Advertising</a>
            <a href="#" className="google-footer-link">Business</a>
            <a href="#" className="google-footer-link">How Search works</a>
          </div>
          <div className="google-footer-right">
            <a href="#" className="google-footer-link">Privacy</a>
            <a href="#" className="google-footer-link">Terms</a>
            <a href="#" className="google-footer-link">Settings</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
