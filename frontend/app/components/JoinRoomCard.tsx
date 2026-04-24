"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function JoinRoomCard() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId.trim()) {
      toast.error("Please enter a valid room ID");
      return;
    }
    
    // Redirect to the room
    router.push(`/room/${roomId.trim().toUpperCase()}`);
  };

  return (
    <div className="snr-card snj-card snd-anim">
      <div className="snr-rainbow snj-rainbow" />
      <div className="snr-body">
        <div className="snr-top">
          <div>
            <div className="snr-title">Join Classroom</div>
            <p className="snr-sub">Already have a code? Enter it below to join the session.</p>
          </div>
          <div className="snr-icon snj-icon">🚪</div>
        </div>

        <form onSubmit={handleJoin} className="snj-form">
          <div className="snj-input-wrap">
            <input 
              type="text" 
              placeholder="ENTER ROOM CODE (e.g. ABCD-1234)" 
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="snj-input"
            />
            <svg className="snj-input-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
            </svg>
          </div>

          <button type="submit" className="snr-gen-btn snj-join-btn">
            Join Classroom
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14m-7-7l7 7-7 7"/>
            </svg>
          </button>
        </form>
      </div>

      <style jsx>{`
        .snj-card {
          border-color: rgba(56, 189, 248, 0.2);
        }
        .snj-rainbow {
          background: linear-gradient(90deg, var(--accent2), var(--accent4), var(--accent), var(--accent2));
        }
        .snj-icon {
          background: rgba(56, 189, 248, 0.09);
          border-color: rgba(56, 189, 248, 0.18);
        }
        .snj-form {
          margin-top: 10px;
        }
        .snj-input-wrap {
          position: relative;
          margin-bottom: 20px;
        }
        .snj-input {
          width: 100%;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px 16px 16px 44px;
          color: var(--text);
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 1px;
          transition: all 0.2s;
          outline: none;
        }
        .snj-input:focus {
          border-color: var(--accent2);
          background: var(--surface3);
          box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.08);
        }
        .snj-input::placeholder {
          color: var(--muted);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
          opacity: 0.6;
        }
        .snj-input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--muted);
          transition: color 0.2s;
        }
        .snj-input:focus + .snj-input-icon {
          color: var(--accent2);
        }
        .snj-join-btn {
          background: var(--accent2);
          color: #0a0c10;
        }
        .snj-join-btn:hover:not(:disabled) {
          box-shadow: 0 12px 32px rgba(56, 189, 248, 0.3);
        }
      `}</style>
    </div>
  );
}
