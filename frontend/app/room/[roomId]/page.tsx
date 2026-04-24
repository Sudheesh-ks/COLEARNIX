"use client"

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSocket } from "../../services/socket";
import { roomService } from "../../services/roomService";
import { userService } from "../../services/userService";
import Loader from "../../components/Loader/Loader";
import Whiteboard from "../../components/Whiteboard/Whiteboard";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import toast from "react-hot-toast";

import "./room.css";

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
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false);
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

      {isWhiteboardOpen && (
        <div className="whiteboard-overlay transition-all">
          <div className="whiteboard-main">
            <Whiteboard roomId={roomId} socket={socket} />
          </div>
          <div className="whiteboard-sidebar">
            <div className="mini-video-card local">
               <video
                 autoPlay
                 muted
                 playsInline
                 ref={(video) => { if (video) video.srcObject = localStream; }}
               />
               <div className="mini-label">{userName}</div>
            </div>
            {Object.entries(remoteStreams).map(([id, stream]) => (
              <div key={id} className="mini-video-card">
                 <video
                   autoPlay
                   playsInline
                   ref={(video) => { if (video) video.srcObject = stream; }}
                 />
                 <div className="mini-label">{remoteUsernames[id] || "Student"}</div>
              </div>
            ))}
          </div>
          <button className="close-whiteboard" onClick={() => setIsWhiteboardOpen(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
      )}

      {isCodeEditorOpen && (
        <div className="whiteboard-overlay transition-all">
          <div className="whiteboard-main">
            <CodeEditor roomId={roomId} socket={socket} />
          </div>
          <div className="whiteboard-sidebar">
            <div className="mini-video-card local">
               <video
                 autoPlay
                 muted
                 playsInline
                 ref={(video) => { if (video) video.srcObject = localStream; }}
               />
               <div className="mini-label">{userName}</div>
            </div>
            {Object.entries(remoteStreams).map(([id, stream]) => (
              <div key={id} className="mini-video-card">
                 <video
                   autoPlay
                   playsInline
                   ref={(video) => { if (video) video.srcObject = stream; }}
                 />
                 <div className="mini-label">{remoteUsernames[id] || "Student"}</div>
              </div>
            ))}
          </div>
          <button className="close-whiteboard" onClick={() => setIsCodeEditorOpen(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
      )}

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

          <button 
            className={`control-btn ${isWhiteboardOpen ? "active" : ""}`} 
            onClick={() => {
              setIsWhiteboardOpen(!isWhiteboardOpen);
              setIsCodeEditorOpen(false);
            }}
            title={isWhiteboardOpen ? "Close Whiteboard" : "Open Whiteboard"}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>

          <button 
            className={`control-btn ${isCodeEditorOpen ? "active" : ""}`} 
            onClick={() => {
              setIsCodeEditorOpen(!isCodeEditorOpen);
              setIsWhiteboardOpen(false);
            }}
            title={isCodeEditorOpen ? "Close Code Editor" : "Open Code Editor"}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </button>

          <div className="control-divider" />

          <button className="control-btn hangup" onClick={() => router.push("/home")}>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.09-.34.14-.52.14s-.36-.05-.52-.14l-7.9-4.44c-.32-.17-.53-.5-.53-.88v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.09.34-.14.52-.14s.36.05.52.14l7.9 4.44c.32.17.53.5.53.88v9z"/></svg>
          </button>
        </div>
      </div>

    </div>
  );
}

