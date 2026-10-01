"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { roomService } from "../services/roomService";

import "./JoinRoomCard.css";

export function JoinRoomCard() {
  const [roomId, setRoomId] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const router = useRouter();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedRoomId = roomId.trim().toUpperCase();
    if (!normalizedRoomId) {
      toast.error("Please enter a valid room ID");
      return;
    }

    setIsJoining(true);
    try {
      await roomService.joinRoom(normalizedRoomId);
      router.push(`/room/${normalizedRoomId}`);
    } catch (error: unknown) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(message || "Unable to join this room");
      setIsJoining(false);
    }
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
              disabled={isJoining}
            />
            <svg className="snj-input-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
            </svg>
          </div>

          <button type="submit" className="snr-gen-btn snj-join-btn" disabled={isJoining}>
            {isJoining ? "Joining..." : "Join Classroom"}
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14m-7-7l7 7-7 7"/>
            </svg>
          </button>
        </form>
      </div>

    </div>
  );
}
