"use client"

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import './home.css';


/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const classrooms = [
  { id: 1, emoji: "📐", bg: "linear-gradient(135deg,rgba(110,231,183,0.12),rgba(56,189,248,0.08))", name: "Advanced Calculus", subject: "Mathematics · Year 3", badge: "live", students: 12, duration: "1h 32m", avatars: ["A","B","C","D"], avColors: ["linear-gradient(135deg,#f472b6,#a78bfa)","linear-gradient(135deg,#38bdf8,#6ee7b7)","linear-gradient(135deg,#fb923c,#f472b6)","linear-gradient(135deg,#a78bfa,#38bdf8)"] },
  { id: 2, emoji: "⚛️", bg: "linear-gradient(135deg,rgba(56,189,248,0.12),rgba(167,139,250,0.08))", name: "React Deep Dive", subject: "Web Dev · All Levels", badge: "scheduled", students: 8, duration: "Tomorrow 3PM", avatars: ["K","M","P"], avColors: ["linear-gradient(135deg,#38bdf8,#6ee7b7)","linear-gradient(135deg,#a78bfa,#38bdf8)","linear-gradient(135deg,#f472b6,#a78bfa)"] },
  { id: 3, emoji: "🧬", bg: "linear-gradient(135deg,rgba(244,114,182,0.1),rgba(167,139,250,0.07))", name: "Molecular Biology", subject: "Biology · Year 2", badge: "ended", students: 15, duration: "Yesterday", avatars: ["S","T","U","V"], avColors: ["linear-gradient(135deg,#f472b6,#a78bfa)","linear-gradient(135deg,#fb923c,#f472b6)","linear-gradient(135deg,#38bdf8,#6ee7b7)","linear-gradient(135deg,#a78bfa,#38bdf8)"] },
  { id: 4, emoji: "📊", bg: "linear-gradient(135deg,rgba(167,139,250,0.1),rgba(56,189,248,0.07))", name: "Data Structures", subject: "CS · Year 1", badge: "scheduled", students: 6, duration: "Fri 5PM", avatars: ["R","Q"], avColors: ["linear-gradient(135deg,#a78bfa,#38bdf8)","linear-gradient(135deg,#6ee7b7,#38bdf8)"] },
  { id: 5, emoji: "🌍", bg: "linear-gradient(135deg,rgba(110,231,183,0.08),rgba(244,114,182,0.06))", name: "World History", subject: "Humanities · Year 2", badge: "ended", students: 9, duration: "3 days ago", avatars: ["E","F","G"], avColors: ["linear-gradient(135deg,#6ee7b7,#38bdf8)","linear-gradient(135deg,#fb923c,#f472b6)","linear-gradient(135deg,#a78bfa,#38bdf8)"] },
  { id: 6, emoji: "🎵", bg: "linear-gradient(135deg,rgba(251,146,60,0.1),rgba(244,114,182,0.07))", name: "Music Theory", subject: "Arts · All Levels", badge: "live", students: 4, duration: "42m", avatars: ["N","O"], avColors: ["linear-gradient(135deg,#fb923c,#f472b6)","linear-gradient(135deg,#f472b6,#a78bfa)"] },
];

const followers = [
  { name: "Aria Chen", meta: "12 classrooms · Math nerd", av: "AC", color: "linear-gradient(135deg,#f472b6,#a78bfa)", following: false },
  { name: "Ben Harlow", meta: "8 classrooms · CS major", av: "BH", color: "linear-gradient(135deg,#38bdf8,#6ee7b7)", following: true },
  { name: "Camille Ross", meta: "5 classrooms · Biology", av: "CR", color: "linear-gradient(135deg,#fb923c,#f472b6)", following: false },
  { name: "Dev Patel", meta: "20 classrooms · Full-stack", av: "DP", color: "linear-gradient(135deg,#a78bfa,#38bdf8)", following: true },
];

const following = [
  { name: "Eliza Park", meta: "15 classrooms · Physics", av: "EP", color: "linear-gradient(135deg,#6ee7b7,#38bdf8)", following: true },
  { name: "Finn Okoro", meta: "7 classrooms · History", av: "FO", color: "linear-gradient(135deg,#a78bfa,#f472b6)", following: true },
  { name: "Grace Kim", meta: "11 classrooms · Chemistry", av: "GK", color: "linear-gradient(135deg,#fb923c,#6ee7b7)", following: true },
  { name: "Hiro Tanaka", meta: "9 classrooms · ML/AI", av: "HT", color: "linear-gradient(135deg,#38bdf8,#a78bfa)", following: true },
];

const activity = [
  { icon: "🚀", bg: "rgba(110,231,183,0.1)", text: <><strong>Aria Chen</strong> joined your <strong>Advanced Calculus</strong> classroom</>, time: "2 min ago" },
  { icon: "❤️", bg: "rgba(244,114,182,0.1)", text: <><strong>Ben Harlow</strong> started following you</>, time: "14 min ago" },
  { icon: "💬", bg: "rgba(56,189,248,0.1)", text: <>New message in <strong>React Deep Dive</strong> from Camille</>, time: "1h ago" },
  { icon: "📋", bg: "rgba(167,139,250,0.1)", text: <><strong>Data Structures</strong> session scheduled for Friday</>, time: "3h ago" },
  { icon: "🏆", bg: "rgba(251,146,60,0.1)", text: <>You earned the <strong>Top Educator</strong> badge!</>, time: "Yesterday" },
];

const quickActions = [
  { icon: "🎥", label: "Go Live Now", sub: "Start instant session", accent: "var(--accent)", bg: "rgba(110,231,183,0.1)", border: "rgba(110,231,183,0.2)" },
  { icon: "📅", label: "Schedule Class", sub: "Plan ahead", accent: "var(--accent2)", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.2)" },
  { icon: "📂", label: "Upload Resources", sub: "Share materials", accent: "var(--accent4)", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.2)" },
];

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg> },
  { id: "classrooms", label: "My Classrooms", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>, badge: "6" },
  { id: "followers", label: "Followers", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>, badge: "4" },
  { id: "following", label: "Following", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/><line x1="12" y1="14" x2="12" y2="14"/></svg> },
  { id: "activity", label: "Activity", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
];

const settingsItems = [
  { id: "profile", label: "Profile Settings", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { id: "notifications", label: "Notifications", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg> },
];

/* ─────────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────────── */
function BadgePill({ type }: { type: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    live: { cls: "snd-badge-live", label: "● Live" },
    scheduled: { cls: "snd-badge-scheduled", label: "Scheduled" },
    ended: { cls: "snd-badge-ended", label: "Ended" },
  };
  const { cls, label } = map[type] ?? map.ended;
  return <div className={`snd-cc-badge ${cls}`}>{label}</div>;
}

function ClassroomCard({ room }: { room: typeof classrooms[0] }) {
  return (
    <div className="snd-classroom-card">
      <div className="snd-cc-banner" style={{ background: room.bg }}>
        <div className="snd-cc-banner-inner">{room.emoji}</div>
      </div>
      <div className="snd-cc-meta">
        <div className="snd-cc-name">{room.name}</div>
        <BadgePill type={room.badge} />
      </div>
      <div className="snd-cc-subject">{room.subject}</div>
      <div className="snd-cc-stats">
        <span>👥 {room.students} students</span>
        <span>⏱ {room.duration}</span>
      </div>
      <div className="snd-cc-footer">
        <div className="snd-cc-avatars">
          {room.avatars.map((a, i) => (
            <div key={i} className="snd-cc-av" style={{ background: room.avColors[i] }}>{a}</div>
          ))}
        </div>
        <button className={`snd-cc-btn ${room.badge === "live" ? "snd-cc-btn-primary" : ""}`}>
          {room.badge === "live" ? "Join →" : room.badge === "scheduled" ? "View" : "Review"}
        </button>
      </div>
    </div>
  );
}

function PersonRow({ person, onToggle }: { person: typeof followers[0]; onToggle: () => void }) {
  return (
    <div className="snd-person">
      <div className="snd-person-av" style={{ background: person.color }}>{person.av}</div>
      <div className="snd-person-info">
        <div className="snd-person-name">{person.name}</div>
        <div className="snd-person-meta">{person.meta}</div>
      </div>
      <button
        className={`snd-person-btn ${person.following ? "snd-btn-following" : "snd-btn-follow"}`}
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
      >
        {person.following ? "Following" : "Follow"}
      </button>
    </div>
  );
}

function CreateModal({ onClose }: { onClose: () => void }) {
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  return (
    <div className="snd-modal-overlay" onClick={onClose}>
      <div className="snd-modal" onClick={e => e.stopPropagation()}>
        <div className="snd-modal-head">
          <div className="snd-modal-title">Create Classroom</div>
          <button className="snd-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="snd-field">
          <label>Classroom Name</label>
          <input type="text" placeholder="e.g. Advanced Calculus Study Group" />
        </div>
        <div className="snd-field">
          <label>Subject</label>
          <select>
            <option>Mathematics</option>
            <option>Computer Science</option>
            <option>Physics</option>
            <option>Biology</option>
            <option>Chemistry</option>
            <option>History</option>
            <option>Literature</option>
            <option>Other</option>
          </select>
        </div>
        <div className="snd-field">
          <label>Description</label>
          <textarea rows={3} placeholder="What will you cover in this classroom?" />
        </div>
        <div className="snd-field">
          <label>Visibility</label>
          <div className="snd-toggle-row">
            <div className={`snd-toggle-opt ${visibility === "public" ? "snd-tog-active" : ""}`} onClick={() => setVisibility("public")}>🌍 Public</div>
            <div className={`snd-toggle-opt ${visibility === "private" ? "snd-tog-active" : ""}`} onClick={() => setVisibility("private")}>🔒 Private</div>
          </div>
        </div>
        <div className="snd-modal-footer">
          <button className="snd-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="snd-btn-create" onClick={onClose}>Create Classroom →</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function HomePage() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [followerList, setFollowerList] = useState(followers);
  const [followingList, setFollowingList] = useState(following);

  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if(!accessToken) {
        router.replace("/login");
    }
  }, [router]);

  const toggleFollowerFollow = (i: number) => {
    setFollowerList(f => f.map((p, idx) => idx === i ? { ...p, following: !p.following } : p));
  };
  const toggleFollowingFollow = (i: number) => {
    setFollowingList(f => f.map((p, idx) => idx === i ? { ...p, following: !p.following } : p));
  };

  const pageTitle: Record<string, string> = {
    dashboard: "Dashboard", classrooms: "My Classrooms",
    followers: "Followers", following: "Following",
    activity: "Activity", profile: "Profile Settings", notifications: "Notifications",
  };

  return (
    <div className="snd-root">

      {/* ── SIDEBAR ── */}
      <aside className="snd-sidebar">
        <a href="#" className="snd-sidebar-logo">
          <div className="snd-logo-mark">C</div>
          <span className="snd-logo-text">Colearnix</span>
        </a>

        <div className="snd-sidebar-section">
          <div className="snd-sidebar-label">Main</div>
          {navItems.map(item => (
            <div
              key={item.id}
              className={`snd-nav-item ${activeNav === item.id ? "snd-active" : ""}`}
              onClick={() => setActiveNav(item.id)}
            >
              <span className="snd-nav-icon">{item.icon}</span>
              {item.label}
              {item.badge && <span className="snd-nav-badge">{item.badge}</span>}
            </div>
          ))}
        </div>

        <div className="snd-sidebar-section">
          <div className="snd-sidebar-label">Settings</div>
          {settingsItems.map(item => (
            <div
              key={item.id}
              className={`snd-nav-item ${activeNav === item.id ? "snd-active" : ""}`}
              onClick={() => setActiveNav(item.id)}
            >
              <span className="snd-nav-icon">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>

        <div className="snd-sidebar-footer">
          <div className="snd-user-card">
            <div className="snd-user-avatar">AK</div>
            <div className="snd-user-info">
              <div className="snd-user-name">Alex Kumar</div>
              <div className="snd-user-role">Educator · Pro</div>
            </div>
            <div className="snd-user-status" />
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="snd-main">

        {/* TOP BAR */}
        <header className="snd-topbar">
          <div>
            <div className="snd-breadcrumb">
              Colearnix <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg>
              <span>{pageTitle[activeNav]}</span>
            </div>
          </div>

          <div className="snd-search">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input type="text" placeholder="Search classrooms, people…" />
          </div>

          <div className="snd-topbar-actions">
            <div className="snd-icon-btn">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              <div className="snd-notif-dot" />
            </div>
            <div className="snd-icon-btn">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>
            </div>
            <div className="snd-topbar-avatar">AK</div>
          </div>
        </header>

        {/* ── CONTENT ── */}
        <div className="snd-content">

          {/* WELCOME BANNER */}
          <div className="snd-welcome snd-anim" style={{ animationDelay: "0s" }}>
            <div className="snd-welcome-inner">
              <div className="snd-welcome-text">
                <div className="snd-welcome-eyebrow">
                  <span className="snd-welcome-dot" /> Good morning, Alex 👋
                </div>
                <h2>Ready to teach today?</h2>
                <p>You have 2 live sessions and 3 scheduled classrooms this week. Your students are waiting!</p>
              </div>
              <div className="snd-welcome-stats">
                <div className="snd-ws"><div className="snd-ws-num">248</div><div className="snd-ws-label">Total Students</div></div>
                <div className="snd-ws"><div className="snd-ws-num">6</div><div className="snd-ws-label">Classrooms</div></div>
                <div className="snd-ws"><div className="snd-ws-num">4.9★</div><div className="snd-ws-label">Avg Rating</div></div>
              </div>
            </div>
          </div>

          {/* STAT TILES */}
          <div className="snd-grid-3 snd-anim" style={{ animationDelay: "0.07s" }}>
            {[
              { label: "Total Hours Taught", value: "142h", change: "+12% this month", up: true, color: "rgba(110,231,183,0.1)" },
              { label: "Active Students", value: "89", change: "+5 this week", up: true, color: "rgba(56,189,248,0.1)" },
              { label: "New Followers", value: "28", change: "+3 today", up: true, color: "rgba(167,139,250,0.1)" },
            ].map(({ label, value, change, up, color }) => (
              <div className="snd-stat-tile" key={label} style={{ ["--st-color" as string]: color }}>
                <div className="snd-st-label">{label}</div>
                <div className="snd-st-value">{value}</div>
                <div className={`snd-st-change ${up ? "snd-change-up" : "snd-change-down"}`}>
                  {up ? "↑" : "↓"} {change}
                </div>
              </div>
            ))}
          </div>

          {/* QUICK ACTIONS + CREATE */}
          <div className="snd-grid-2 snd-anim" style={{ animationDelay: "0.12s" }}>

            {/* Create New Classroom */}
            <div>
              <div className="snd-section-head">
                <div className="snd-section-title"><span className="snd-section-title-dot" />New Classroom</div>
              </div>
              <div className="snd-create-card" onClick={() => setShowModal(true)}>
                <div className="snd-create-icon">
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 4v16m8-8H4"/></svg>
                </div>
                <div className="snd-create-label">Create New Classroom</div>
                <div className="snd-create-sub">Set up a live or scheduled session<br />for your students in seconds</div>
              </div>

              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                {quickActions.map(qa => (
                  <div
                    className="snd-quick-action"
                    key={qa.label}
                    style={{ ["--qa-accent" as string]: qa.accent }}
                  >
                    <div className="snd-qa-icon" style={{ background: qa.bg, border: `1px solid ${qa.border}` }}>{qa.icon}</div>
                    <div className="snd-qa-text">
                      <h4>{qa.label}</h4>
                      <p>{qa.sub}</p>
                    </div>
                    <svg style={{ color: "var(--muted)", marginLeft: "auto" }} width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div>
              <div className="snd-section-head">
                <div className="snd-section-title"><span className="snd-section-title-dot" />Recent Activity</div>
                <button className="snd-see-all">View all <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg></button>
              </div>
              <div className="snd-panel">
                {activity.map((a, i) => (
                  <div className="snd-activity-item" key={i}>
                    <div className="snd-activity-icon" style={{ background: a.bg }}>{a.icon}</div>
                    <div className="snd-activity-text">
                      <p>{a.text}</p>
                      <div className="snd-activity-time">{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CLASSROOM HISTORY */}
          <div className="snd-anim" style={{ animationDelay: "0.17s" }}>
            <div className="snd-section-head">
              <div className="snd-section-title"><span className="snd-section-title-dot" />Classroom History</div>
              <button className="snd-see-all">See all 6 <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg></button>
            </div>
            <div className="snd-grid-3">
              {classrooms.map(room => <ClassroomCard key={room.id} room={room} />)}
            </div>
          </div>

          {/* FOLLOWERS + FOLLOWING */}
          <div className="snd-grid-2 snd-anim" style={{ animationDelay: "0.22s" }}>
            <div>
              <div className="snd-section-head">
                <div className="snd-section-title"><span className="snd-section-title-dot" />Followers</div>
                <button className="snd-see-all">See all <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg></button>
              </div>
              <div className="snd-people-list">
                {followerList.map((p, i) => (
                  <PersonRow key={p.name} person={p} onToggle={() => toggleFollowerFollow(i)} />
                ))}
              </div>
            </div>

            <div>
              <div className="snd-section-head">
                <div className="snd-section-title"><span className="snd-section-title-dot" />Following</div>
                <button className="snd-see-all">See all <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg></button>
              </div>
              <div className="snd-people-list">
                {followingList.map((p, i) => (
                  <PersonRow key={p.name} person={p} onToggle={() => toggleFollowingFollow(i)} />
                ))}
              </div>
            </div>
          </div>

        </div>{/* /content */}
      </main>

      {/* CREATE MODAL */}
      {showModal && <CreateModal onClose={() => setShowModal(false)} />}
    </div>
  );
}