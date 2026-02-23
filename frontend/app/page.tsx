"use client"

import { useRef } from "react";
import './landingpage.css'
import { useFancyCursor } from "./useFancyCursor";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const navigate = useRouter()

  useFancyCursor(cursorRef, trailRef, gridRef);

  return (
    <div className="sn-root">
      <div className="sn-cursor" ref={cursorRef} id="sn-cursor" />
      <div className="sn-cursor-trail" ref={trailRef} id="sn-cursor-trail" />
      <div className="sn-noise" />

      {/* NAV */}
      <nav className="sn-nav">
        <a href="#" className="sn-logo">
          <div className="sn-logo-mark">C</div>
          COLEARNIX
        </a>
        <ul className="sn-nav-links">
          <li><a href="#sn-features">Features</a></li>
          <li><a href="#sn-how">How it works</a></li>
          <li><a href="#sn-rooms">Browse Rooms</a></li>
          <li><a href="#">Blog</a></li>
        </ul>
        <div className="sn-nav-cta">
          <button onClick={() => navigate.push('/login')} className="sn-btn-ghost">Sign in</button>
          <button onClick={() => navigate.push('/login')} className="sn-btn-primary">Get started free</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="sn-hero">
        <div className="sn-hero-glow sn-hero-glow-1" />
        <div className="sn-hero-glow sn-hero-glow-2" />
        <div className="sn-hero-glow sn-hero-glow-3" />
        <div className="sn-hero-grid" ref={gridRef} />

        <div className="sn-hero-badge">
          <span className="sn-badge-dot" />
          1000+ students studying right now
        </div>

        <h1>
          Study smarter,
          <span className="sn-line2">together.</span>
        </h1>
        <p className="sn-hero-sub">
          Create a room, invite your friends, and learn with live video calls, a shared code editor, notes, and chat — all in one place.
        </p>

        <div className="sn-hero-actions">
          <button className="sn-btn-hero sn-btn-hero-primary">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M12 4v16m8-8H4" /></svg>
            Create a Room
          </button>
          <button className="sn-btn-hero sn-btn-hero-secondary">
            Browse public rooms
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        {/* Room Preview */}
        <div className="sn-room-preview sn-reveal">
          <div className="sn-room-preview-inner">
            <div className="sn-room-topbar">
              <div className="sn-dot sn-dot-r" />
              <div className="sn-dot sn-dot-y" />
              <div className="sn-dot sn-dot-g" />
              <div className="sn-room-url">Colearnix.app / room / algorithms-study-group</div>
              <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
                <div className="sn-live-badge">● LIVE</div>
              </div>
            </div>
            <div className="sn-room-body">
              {/* Code Editor */}
              <div className="sn-panel sn-code-panel">
                <div className="sn-panel-label"><span className="sn-panel-dot" />Shared Editor</div>
                <div className="sn-code-line"><span className="sn-cm">{/*// Binary Search implementation */}</span></div>
                <div className="sn-code-line"><span className="sn-kw">function</span> <span className="sn-fn">binarySearch</span>(arr, target) {"{"}</div>
                <div className="sn-code-line">{"  "}<span className="sn-kw">let</span> left = <span className="sn-num">0</span>, right = arr.length - <span className="sn-num">1</span>;</div>
                <div className="sn-code-line">{"  "}<span className="sn-kw">while</span> (left &lt;= right) {"{"}</div>
                <div className="sn-code-line">{"    "}<span className="sn-kw">const</span> mid = Math.floor((left + right) / <span className="sn-num">2</span>);</div>
                <div className="sn-code-line">{"    "}<span className="sn-kw">if</span> (arr[mid] === target) <span className="sn-kw">return</span> mid;</div>
                <div className="sn-code-line">{"    "}<span className="sn-kw">else if</span> (arr[mid] &lt; target) left = mid + <span className="sn-num">1</span>;</div>
                <div className="sn-code-line">{"    "}<span className="sn-kw">else</span> right = mid - <span className="sn-num">1</span>;</div>
                <div className="sn-code-line">{"  "}{"}"}</div>
                <div className="sn-code-line">{"  "}<span className="sn-kw">return</span> -<span className="sn-num">1</span>;<span className="sn-cursor-blink" /></div>
                <div className="sn-code-line">{"}"}</div>
              </div>

              {/* Video */}
              <div className="sn-panel">
                <div className="sn-panel-label"><span className="sn-panel-dot" />Video Call · 4 participants</div>
                <div className="sn-video-grid">
                  <div className="sn-video-tile sn-active-speaker">
                    <div className="sn-avatar sn-av1">A</div>
                    <div className="sn-video-name">Alice</div>
                    <div className="sn-mic-indicator">🎙</div>
                  </div>
                  <div className="sn-video-tile">
                    <div className="sn-avatar sn-av2">B</div>
                    <div className="sn-video-name">Ben</div>
                  </div>
                  <div className="sn-video-tile">
                    <div className="sn-avatar sn-av3">C</div>
                    <div className="sn-video-name">Clara</div>
                  </div>
                  <div className="sn-video-tile">
                    <div className="sn-avatar sn-av4">D</div>
                    <div className="sn-video-name">Dev</div>
                  </div>
                </div>
              </div>

              {/* Chat */}
              <div className="sn-panel">
                <div className="sn-panel-label"><span className="sn-panel-dot" />Chat</div>
                <div className="sn-chat-messages">
                  {[
                    { av: "sn-av1", name: "Alice", msg: "should we try O(log n) here?" },
                    { av: "sn-av2", name: "Ben", msg: "yes! binary search fits perfectly 🎯" },
                    { av: "sn-av3", name: "Clara", msg: "I pushed my solution, check it out" },
                    { av: "sn-av4", name: "Dev", msg: "nice one! handles edge cases too 👌" },
                  ].map(({ av, name, msg }) => (
                    <div className="sn-chat-msg" key={name}>
                      <div className={`sn-chat-av ${av}`}>{name[0]}</div>
                      <div className="sn-chat-bubble">
                        <div className="sn-chat-sender">{name}</div>
                        {msg}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="sn-chat-input-bar">
                  Type a message...
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13" /><path d="M22 2L15 22l-4-9-9-4 20-7z" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="sn-stats">
        {[
          { num: "48K+", label: "Students learning", delay: "0s" },
          { num: "3.2K", label: "Active rooms ", delay: "0.1s" },
          { num: "120+", label: "Topics covered", delay: "0.2s" },
        ].map(({ num, label, delay }) => (
          <div className="sn-stat-item sn-reveal" key={label} style={{ transitionDelay: delay }}>
            <div className="sn-stat-num">{num}</div>
            <div className="sn-stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <section className="sn-section" id="sn-features">
        <div className="sn-reveal">
          <div className="sn-section-eyebrow">Everything you need</div>
          <h2 className="sn-section-title">One room,<br />infinite tools.</h2>
          <p className="sn-section-sub">Every tool your study group needs, perfectly integrated so you can focus on learning — not setup.</p>
        </div>
        <div className="sn-features-grid sn-reveal" style={{ transitionDelay: "0.1s" }}>
          {[
            { icon: "📹", title: "HD Video Calls", desc: "Crystal-clear video with screen sharing, virtual backgrounds, and noise cancellation built right in.", accent: "var(--accent)", iconBg: "rgba(110,231,183,0.08)", iconBorder: "rgba(110,231,183,0.2)" },
            { icon: "💻", title: "Collaborative Code Editor", desc: "Real-time multi-cursor code editor with syntax highlighting for 40+ languages and live execution.", accent: "var(--accent2)", iconBg: "rgba(56,189,248,0.08)", iconBorder: "rgba(56,189,248,0.2)" },
            { icon: "📝", title: "Shared Notes", desc: "Rich-text collaborative notes with LaTeX math support, diagrams, and export to PDF or Markdown.", accent: "var(--accent4)", iconBg: "rgba(167,139,250,0.08)", iconBorder: "rgba(167,139,250,0.2)" },
            { icon: "💬", title: "Group Chat", desc: "Persistent threaded chat with code snippets, reactions, file sharing, and message history.", accent: "var(--accent3)", iconBg: "rgba(244,114,182,0.08)", iconBorder: "rgba(244,114,182,0.2)" },
            { icon: "🗂️", title: "Shared Whiteboard", desc: "Infinite canvas whiteboard for diagrams, flowcharts, and visual explanations in real-time.", accent: "var(--accent)", iconBg: "rgba(110,231,183,0.08)", iconBorder: "rgba(110,231,183,0.2)" },
            { icon: "🔒", title: "Private & Public Rooms", desc: "Invite-only private rooms or public rooms that anyone can discover and join. You're in control.", accent: "var(--accent2)", iconBg: "rgba(56,189,248,0.08)", iconBorder: "rgba(56,189,248,0.2)" },
          ].map(({ icon, title, desc, accent, iconBg, iconBorder }) => (
            <div
              className="sn-feature-card"
              key={title}
              style={{ ["--fc-accent" as string]: accent }}
            >
              <div className="sn-feature-icon" style={{ background: iconBg, border: `1px solid ${iconBorder}` }}>{icon}</div>
              <h3 className="sn-feature-title">{title}</h3>
              <p className="sn-feature-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="sn-how-section" id="sn-how">
        <div className="sn-how-inner">
          <div className="sn-reveal sn-how-center">
            <div className="sn-section-eyebrow">How it works</div>
            <h2 className="sn-section-title">Up and running in seconds.</h2>
          </div>
          <div className="sn-steps-grid">
            {[
              { n: "01", title: "Sign up free", desc: "Create your account in under a minute — no credit card required.", delay: "0.0s" },
              { n: "02", title: "Create a room", desc: "Pick a subject, set a name, choose public or private, and your room is live.", delay: "0.1s" },
              { n: "03", title: "Invite friends", desc: "Share a link and your study group joins instantly — no downloads needed.", delay: "0.2s" },
              { n: "04", title: "Start learning", desc: "Collaborate with video, code, notes, and chat all seamlessly in sync.", delay: "0.3s" },
            ].map(({ n, title, desc, delay }) => (
              <div className="sn-step sn-reveal" key={n} style={{ transitionDelay: delay }}>
                <div className="sn-step-num">{n}</div>
                <h3 className="sn-step-title">{title}</h3>
                <p className="sn-step-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROOMS */}
      <section className="sn-rooms-section" id="sn-rooms">
        <div className="sn-reveal">
          <div className="sn-section-eyebrow">Live right now</div>
          <h2 className="sn-section-title">Jump into a room.</h2>
          <p className="sn-section-sub">Hundreds of open study rooms across every subject. Find your people.</p>
        </div>
        <div className="sn-rooms-grid">
          {/* Room 1 */}
          <div className="sn-room-card sn-reveal" style={{ ["--rc-accent" as string]: "rgba(110,231,183,0.06)" }}>
            <div className="sn-room-header">
              <div className="sn-room-icon" style={{ background: "rgba(110,231,183,0.1)" }}>📐</div>
              <div>
                <div className="sn-room-name">Calculus Warriors</div>
                <div className="sn-room-subject">Mathematics · Year 2</div>
              </div>
              <div className="sn-room-tag sn-tag-live">● Live</div>
            </div>
            <div className="sn-room-meta">
              <span>👥 5 / 8 members</span>
              <span>⏱ 1h 24m</span>
              <span>🌍 Public</span>
            </div>
            <div className="sn-room-avatars">
              <div className="sn-mini-av sn-av1">A</div>
              <div className="sn-mini-av sn-av2">B</div>
              <div className="sn-mini-av sn-av3">C</div>
              <div className="sn-mini-av sn-av4">D</div>
              <div className="sn-mini-av" style={{ background: "var(--surface2)", borderColor: "var(--border)", color: "var(--muted)", fontSize: 10 }}>+1</div>
            </div>
            <button className="sn-room-join">Join Room →</button>
          </div>

          {/* Room 2 */}
          <div className="sn-room-card sn-reveal" style={{ ["--rc-accent" as string]: "rgba(56,189,248,0.06)", transitionDelay: "0.1s" }}>
            <div className="sn-room-header">
              <div className="sn-room-icon" style={{ background: "rgba(56,189,248,0.1)" }}>⚛️</div>
              <div>
                <div className="sn-room-name">React Deep Dive</div>
                <div className="sn-room-subject">Web Dev · All Levels</div>
              </div>
              <div className="sn-room-tag sn-tag-open">Open</div>
            </div>
            <div className="sn-room-meta">
              <span>👥 2 / 10 members</span>
              <span>⏱ 32m</span>
              <span>🌍 Public</span>
            </div>
            <div className="sn-room-avatars">
              <div className="sn-mini-av sn-av2">K</div>
              <div className="sn-mini-av sn-av4">M</div>
            </div>
            <button className="sn-room-join">Join Room →</button>
          </div>

          {/* Room 3 */}
          <div className="sn-room-card sn-reveal" style={{ ["--rc-accent" as string]: "rgba(244,114,182,0.06)", transitionDelay: "0.2s" }}>
            <div className="sn-room-header">
              <div className="sn-room-icon" style={{ background: "rgba(244,114,182,0.1)" }}>🧬</div>
              <div>
                <div className="sn-room-name">Bio Finals Prep</div>
                <div className="sn-room-subject">Biology · Year 3</div>
              </div>
              <div className="sn-room-tag sn-tag-full">Full</div>
            </div>
            <div className="sn-room-meta">
              <span>👥 8 / 8 members</span>
              <span>⏱ 3h 05m</span>
              <span>🔒 Private</span>
            </div>
            <div className="sn-room-avatars">
              <div className="sn-mini-av sn-av1">S</div>
              <div className="sn-mini-av sn-av3">T</div>
              <div className="sn-mini-av sn-av2">U</div>
              <div className="sn-mini-av sn-av4">V</div>
              <div className="sn-mini-av" style={{ background: "var(--surface2)", borderColor: "var(--border)", color: "var(--muted)", fontSize: 10 }}>+4</div>
            </div>
            <button className="sn-room-join" style={{ opacity: 0.5, pointerEvents: "none" }}>Room Full</button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sn-cta-section">
        <h2 className="sn-reveal">
          Ready to study<br />
          <span className="sn-cta-grad">smarter?</span>
        </h2>
        <p className="sn-reveal" style={{ transitionDelay: "0.1s" }}>Join thousands of students who are already learning together. Free forever for individuals.</p>
        <div className="sn-hero-actions sn-reveal" style={{ transitionDelay: "0.2s", marginBottom: 0 }}>
          <button onClick={() => navigate.push('/login')} className="sn-btn-hero sn-btn-hero-primary">
            Create your first room
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14m-7-7l7 7-7 7" /></svg>
          </button>
          <button onClick={() => navigate.push('/login')} className="sn-btn-hero sn-btn-hero-secondary">See all features</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="sn-footer">
        <div className="sn-footer-brand">
          <a href="#" className="sn-logo" style={{ marginBottom: 0 }}>
            <div className="sn-logo-mark" style={{ width: 32, height: 32, fontSize: 14 }}>S</div>
            Colearnix
          </a>
          <p>The co-learning platform built for students who want to make every study session count.</p>
          <div className="sn-social-links" style={{ marginTop: 20 }}>
            {["𝕏", "in", "gh", "yt"].map(s => (
              <a href="#" className="sn-social-link" key={s}>{s}</a>
            ))}
          </div>
        </div>
        <div className="sn-footer-col">
          <h4>Product</h4>
          {["Features", "How it works", "Pricing", "Changelog", "Roadmap"].map(l => <a href="#" key={l}>{l}</a>)}
        </div>
        <div className="sn-footer-col">
          <h4>Learn</h4>
          {["Browse Rooms", "Topics", "Leaderboard", "Blog", "Tutorials"].map(l => <a href="#" key={l}>{l}</a>)}
        </div>
        <div className="sn-footer-col">
          <h4>Company</h4>
          {["About", "Careers", "Privacy", "Terms", "Contact"].map(l => <a href="#" key={l}>{l}</a>)}
        </div>
        <div className="sn-footer-bottom">
          <span>© 2025 Colearnix. All rights reserved.</span>
          <span>Made with ❤️ for students, by students.</span>
        </div>
      </footer>
    </div>
  );
}