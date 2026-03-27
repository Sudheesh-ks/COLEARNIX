"use client"

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSocket } from "../../services/socket";
import { roomService } from "../../services/roomService";
import { userService } from "../../services/userService";
import Loader from "../../components/Loader/Loader";
import toast from "react-hot-toast";

export default function VideoRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<{ [key: string]: MediaStream }>({});
  const [remoteUsernames, setRemoteUsernames] = useState<{ [key: string]: string }>({});
  const [remoteMicStatus, setRemoteMicStatus] = useState<{ [key: string]: boolean }>({});
  const [remoteCameraStatus, setRemoteCameraStatus] = useState<{ [key: string]: boolean }>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("You");
  const [roomData, setRoomData] = useState<any>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({});
  const socket = getSocket();
  const router = useRouter();

  const iceServers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  useEffect(() => {
    const init = async () => {
      try {
        // 1. Get user profile
        const profileResp = await userService.getProfile();
        const currentUserId = profileResp.data.data._id;
        const currentName = profileResp.data.data.name || "Student";
        setUserId(currentUserId);
        setUserName(currentName);

        // 2. Join room in backend (check pax)
        const joinResp = await roomService.joinRoom(roomId);
        if (!joinResp.data.success) {
          toast.error(joinResp.data.message || "Failed to join room");
          router.push("/home");
          return;
        }
        setRoomData(joinResp.data.data);

        // 3. Get local media
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);

        // 4. Connect socket
        const initialState = { mic: isMicOn, camera: isCameraOn };
        socket.connect();
        socket.emit("join-room", roomId, currentUserId, currentName, initialState);

        socket.on("user-joined", (data: { userId: string, name: string, state: any }) => {
          console.log("User joined:", data.userId, data.name, data.state);
          setRemoteUsernames(prev => ({ ...prev, [data.userId]: data.name }));
          if (data.state) {
            setRemoteMicStatus(prev => ({ ...prev, [data.userId]: !!data.state.mic }));
            setRemoteCameraStatus(prev => ({ ...prev, [data.userId]: !!data.state.camera }));
          }
          createOffer(data.userId, stream, currentUserId, currentName, initialState);
        });

        socket.on("offer", async (data: any) => {
          if (data.to === currentUserId) {
            setRemoteUsernames(prev => ({ ...prev, [data.from]: data.name }));
            if (data.state) {
              setRemoteMicStatus(prev => ({ ...prev, [data.from]: !!data.state.mic }));
              setRemoteCameraStatus(prev => ({ ...prev, [data.from]: !!data.state.camera }));
            }
            await handleOffer(data.from, data.offer, stream, currentUserId, currentName, initialState);
          }
        });

        socket.on("answer", async (data: any) => {
          if (data.to === currentUserId) {
            setRemoteUsernames(prev => ({ ...prev, [data.from]: data.name }));
            if (data.state) {
              setRemoteMicStatus(prev => ({ ...prev, [data.from]: !!data.state.mic }));
              setRemoteCameraStatus(prev => ({ ...prev, [data.from]: !!data.state.camera }));
            }
            await handleAnswer(data.from, data.answer);
          }
        });

        socket.on("ice-candidate", async (data: any) => {
          if (data.to === currentUserId) {
             await peerConnections.current[data.from]?.addIceCandidate(new RTCIceCandidate(data.candidate));
          }
        });

        socket.on("toggle-media", (data: { userId: string, type: 'mic' | 'camera', enabled: boolean }) => {
          console.log("Media toggled:", data.userId, data.type, data.enabled);
          if (data.type === 'mic') {
            setRemoteMicStatus(prev => ({ ...prev, [data.userId]: data.enabled }));
          } else {
            setRemoteCameraStatus(prev => ({ ...prev, [data.userId]: data.enabled }));
          }
        });

        socket.on("user-left", (leftUserId: string) => {
          console.log("User left:", leftUserId);
          if (peerConnections.current[leftUserId]) {
            peerConnections.current[leftUserId].close();
            delete peerConnections.current[leftUserId];
          }
          setRemoteStreams(prev => {
            const next = { ...prev };
            delete next[leftUserId];
            return next;
          });
          setRemoteUsernames(prev => {
            const next = { ...prev };
            delete next[leftUserId];
            return next;
          });
        });

      } catch (error: any) {
        console.error("Room init error:", error);
        toast.error("Failed to join video room: " + (error.response?.data?.message || "Check your camera permissions"));
        router.push("/home");
      }
    };

    init();

    return () => {
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("toggle-media");
      socket.off("user-left");
      socket.disconnect();
      localStream?.getTracks().forEach(track => track.stop());
      Object.values(peerConnections.current).forEach(pc => pc.close());
      roomService.leaveRoom(roomId).catch(console.error);
    };
  }, [roomId]);

  const createPeerConnection = (otherUserId: string, stream: MediaStream, currentUserId: string) => {
    if (peerConnections.current[otherUserId]) {
      console.log(`Closing existing peer connection for ${otherUserId}`);
      peerConnections.current[otherUserId].close();
    }
    const pc = new RTCPeerConnection(iceServers);
    peerConnections.current[otherUserId] = pc;

    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { roomId, candidate: event.candidate, to: otherUserId, from: currentUserId });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStreams(prev => ({ ...prev, [otherUserId]: event.streams[0] }));
    };

    return pc;
  };

  const createOffer = async (otherUserId: string, stream: MediaStream, currentUserId: string, name: string, state: any) => {
    try {
      const pc = createPeerConnection(otherUserId, stream, currentUserId);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      console.log(`Sending offer to ${otherUserId}`);
      socket.emit("offer", { roomId, offer, to: otherUserId, from: currentUserId, name, state });
    } catch (err) {
      console.error("Error creating offer:", err);
    }
  };

  const handleOffer = async (otherUserId: string, offer: any, stream: MediaStream, currentUserId: string, name: string, state: any) => {
    try {
      const pc = createPeerConnection(otherUserId, stream, currentUserId);
      if (pc.signalingState !== "stable") {
        console.warn("PC not in stable state before offer, closing old connection");
        pc.close();
        return; // Or handle re-creation
      }
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      console.log(`Sending answer to ${otherUserId}`);
      socket.emit("answer", { roomId, answer, to: otherUserId, from: currentUserId, name, state });
    } catch (err) {
      console.error("Error handling offer:", err);
    }
  };

  const handleAnswer = async (otherUserId: string, answer: any) => {
    try {
      const pc = peerConnections.current[otherUserId];
      if (pc && pc.signalingState === "have-local-offer") {
        console.log(`Handling answer from ${otherUserId}`);
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      } else {
        console.warn(`Ignoring answer from ${otherUserId} - signaling state is ${pc?.signalingState}`);
      }
    } catch (err) {
      console.error("Error handling answer:", err);
    }
  };

  const toggleMic = () => {
    if (localStream && userId) {
      const newState = !isMicOn;
      localStream.getAudioTracks().forEach(track => {
        track.enabled = newState;
      });
      setIsMicOn(newState);
      socket.emit('toggle-media', { roomId, userId, type: 'mic', enabled: newState });
    }
  };

  const toggleCamera = () => {
    if (localStream && userId) {
      const newState = !isCameraOn;
      localStream.getVideoTracks().forEach(track => {
        track.enabled = newState;
      });
      setIsCameraOn(newState);
      socket.emit('toggle-media', { roomId, userId, type: 'camera', enabled: newState });
    }
  };

  if (!userId || !roomData) {
    return <Loader />;
  }

  return (
    <div className="room-container">
      <div className="room-header">
        <div className="room-info">
          <div className="room-brand">COLEARNIX</div>
          <div className="room-badge">LIVE</div>
        </div>
        
        <div className="room-actions">
          <div className="participant-count">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m12-10a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>{Object.keys(remoteStreams).length + 1} / {roomData.pax} Participants</span>
          </div>
        </div>
      </div>

      <div className={`video-grid pax-${roomData.pax}`}>
        <div className="video-card local">
          <video
            autoPlay
            muted
            playsInline
            ref={(video) => { if (video) video.srcObject = localStream; }}
            className={`video-el ${!isCameraOn ? "camera-off" : ""}`}
          />
          <div className="video-overlay">
            <span className="user-name">{userName} {!isMicOn && " (Muted)"}</span>
            <div className="status-icons">
               {!isMicOn && <div className="status-dot red" title="Muted" />}
               <div className="status-dot green" />
            </div>
          </div>
          {!isCameraOn && (
            <div className="camera-off-msg">
              <div className="avatar-large">{userName.charAt(0).toUpperCase()}</div>
              <p>{userName} is off</p>
            </div>
          )}
        </div>

        {Object.entries(remoteStreams)
          .sort(([idA], [idB]) => idA.localeCompare(idB))
          .map(([id, stream]) => (
          <div key={id} className="video-card">
            <video
              autoPlay
              playsInline
              ref={(video) => { if (video) video.srcObject = stream; }}
              className={`video-el ${remoteCameraStatus[id] === false ? "camera-off" : ""}`}
            />
            <div className="video-overlay">
              <span className="user-name">{remoteUsernames[id] || "Student"} {remoteMicStatus[id] === false && " (Muted)"}</span>
              <div className="status-icons">
                 {remoteMicStatus[id] === false && <div className="status-dot red" title="Muted" />}
                 <div className="status-dot green" />
              </div>
            </div>
            {remoteCameraStatus[id] === false && (
              <div className="camera-off-msg">
                <div className="avatar-large">{(remoteUsernames[id] || "S").charAt(0).toUpperCase()}</div>
                <p>{remoteUsernames[id] || "Student"} is off</p>
              </div>
            )}
          </div>
        ))}

        {/* Placeholder for empty slots */}
        {[...Array(Math.max(0, roomData.pax - (Object.keys(remoteStreams).length + 1)))].map((_, i) => (
          <div key={`empty-${i}`} className="video-card empty">
            <div className="empty-content">
              <div className="empty-icon">👤</div>
              <p>Waiting for student...</p>
            </div>
          </div>
        ))}
      </div>

      <div className="control-bar-wrapper">
        <div className="control-bar">
          <button 
            className={`control-btn ${!isMicOn ? "off" : ""}`} 
            onClick={toggleMic}
            title={isMicOn ? "Mute Mic" : "Unmute Mic"}
          >
            {isMicOn ? (
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v1a7 7 0 01-14 0v-1M12 18.5V23"/></svg>
            ) : (
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v1a7 7 0 01-14 0v-1M12 18.5V23"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            )}
          </button>

          <button 
            className={`control-btn ${!isCameraOn ? "off" : ""}`} 
            onClick={toggleCamera}
            title={isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
          >
            {isCameraOn ? (
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
            ) : (
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            )}
          </button>

          <div className="control-divider" />

          <button className="control-btn hangup" onClick={() => router.push("/home")}>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.09-.34.14-.52.14s-.36-.05-.52-.14l-7.9-4.44c-.32-.17-.53-.5-.53-.88v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.09.34-.14.52-.14s.36.05.52.14l7.9 4.44c.32.17.53.5.53.88v9z"/></svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        .room-container {
          height: 100vh;
          height: 100dvh;
          display: flex;
          flex-direction: column;
          background: var(--bg);
          color: var(--text);
          padding: 1rem 2rem;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
        }
        .room-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .room-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .room-brand {
          font-weight: 800;
          letter-spacing: 2px;
          font-size: 1.1rem;
          background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .room-badge {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          font-size: 0.6rem;
          font-weight: 800;
          padding: 0.15rem 0.4rem;
          border-radius: 0.25rem;
          border: 1px solid rgba(239, 68, 68, 0.2);
          letter-spacing: 1px;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.6; }
          100% { opacity: 1; }
        }
        .room-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
        }
        .room-id {
          color: var(--accent);
          font-family: monospace;
        }
        .room-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .participant-count {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--muted);
          font-weight: 500;
        }
        .video-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          width: 100%;
          max-width: 1800px;
          margin: 0 auto;
          flex: 1;
          overflow: hidden;
          padding: 1rem;
          justify-content: center;
          align-content: center;
        }
        
        .video-grid::-webkit-scrollbar { width: 6px; }
        .video-grid::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }

        .video-card {
          position: relative;
          background: var(--surface);
          border-radius: 1rem;
          overflow: hidden;
          border: 1px solid var(--border);
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          aspect-ratio: 16/9;
          
          /* Dynamic sizing based on participant count (1-6) to ensure no scroll */
          flex: 0 1 auto;
          width: calc((100% - 4rem) / 3);
          max-height: calc((100% - 2rem) / 2);
          min-width: 280px;
        }

        .pax-1 .video-card { width: min(90%, 1200px); max-height: 80vh; }
        .pax-2 .video-card { width: calc((100% - 2rem) / 2); max-height: 80vh; }
        .pax-3 .video-card, .pax-4 .video-card { width: calc((100% - 2rem) / 2); max-height: calc((100% - 2rem) / 2); }
        .pax-5 .video-card, .pax-6 .video-card { width: calc((100% - 3rem) / 3); max-height: calc((100% - 2rem) / 2); }

        /* Adjustments for specific counts to keep cards large */
        /* Adjustments for specific counts to keep cards large but sane */
        .video-grid.pax-1 .video-card { flex-basis: 800px; max-height: calc(100vh - 12rem); }
        .video-grid.pax-2 .video-card { flex-basis: 480px; }
        
        .video-card:hover {
          border-color: var(--accent);
          box-shadow: 0 0 20px var(--glow);
        }
        .video-el {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .video-overlay {
          position: absolute;
          inset: 0;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%);
          pointer-events: none;
        }
        .user-name {
          font-weight: 600;
          font-size: 0.95rem;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .status-dot.green { background: var(--accent); box-shadow: 0 0 8px var(--accent); }
        .status-dot.red { background: #ef4444; box-shadow: 0 0 8px #ef4444; }
        
        .camera-off-msg {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #111;
          gap: 1rem;
        }
        .avatar-large {
          width: 80px;
          height: 80px;
          background: var(--surface2);
          border: 2px solid var(--border);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 800;
          color: var(--accent);
        }
        .video-el.camera-off { opacity: 0; }

        .video-card.empty {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--surface2);
          border-style: dashed;
          border-width: 2px;
        }
        .empty-content {
          text-align: center;
          color: var(--muted);
        }
        .empty-icon {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          opacity: 0.3;
        }

        .control-bar-wrapper {
          position: fixed;
          bottom: 2rem;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          pointer-events: none;
          z-index: 100;
        }
        .control-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(15, 15, 15, 0.8);
          backdrop-filter: blur(20px);
          padding: 0.75rem 1.5rem;
          border-radius: 2rem;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          pointer-events: auto;
        }
        .control-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: var(--surface2);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .control-btn:hover {
          background: var(--surface3);
          transform: translateY(-2px);
        }
        .control-btn.off {
          background: #ef4444;
          color: white;
        }
        .control-btn.hangup {
          background: #ef4444;
          transform: rotate(135deg);
        }
        .control-btn.hangup:hover {
          background: #dc2626;
          transform: rotate(135deg) scale(1.1);
        }
        .control-divider {
          width: 1px;
          height: 24px;
          background: rgba(255,255,255,0.1);
          margin: 0 0.5rem;
        }
        
        @media (max-width: 768px) {
          .room-container { padding: 0.5rem; }
          .video-grid { padding: 0.5rem; gap: 0.5rem; }
          .video-card {
            width: calc((100% - 0.5rem) / 2) !important;
            max-height: calc((100% - 1rem) / 3) !important;
            min-width: 0;
          }
          .pax-1 .video-card { width: 100% !important; max-height: 70vh !important; }
          
          .control-bar-wrapper { bottom: 1rem; }
          .control-bar { padding: 0.5rem 0.75rem; gap: 0.5rem; }
          .avatar-large { width: 50px; height: 50px; font-size: 1.2rem; }
        }
      `}</style>
    </div>
  );
}

