"use client"

import { useState } from "react";


const PAX = [
  { n: 2, tag: "duo"   },
  { n: 3, tag: "trio"  },
  { n: 4, tag: "group" },
  { n: 5, tag: "squad" },
  { n: 6, tag: "squad" },
];

function genCode() {
  const s = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${s()}-${s()}-${s()}`;
}

export function CreateRoomCard() {
  const [pax, setPax]           = useState<number | null>(null);
  const [loading, setLoading]   = useState(false);
  const [code, setCode]         = useState("");
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const link  = code ? `studynest.app/join/${code.toLowerCase()}` : "";
  const parts = code.split("-");

  const handleGenerate = () => {
    if (!pax) return;
    setLoading(true);
    setTimeout(() => { setCode(genCode()); setLoading(false); }, 1100);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };
  const copyLink = () => {
    navigator.clipboard.writeText(`https://${link}`).catch(() => {});
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };
  const reset = () => { setCode(""); setPax(null); };

  return (
    <div className="snr-card snd-anim">
      <div className="snr-rainbow" />
      <div className="snr-body">

        {/* ── IDLE ── */}
        {!code && (
          <>
            <div className="snr-top">
              <div>
                <div className="snr-title">New Study Room</div>
                <p className="snr-sub">Pick your group size and get a unique room link instantly.</p>
              </div>
              <div className="snr-icon">📚</div>
            </div>

            <div className="snr-pax-label">How many people?</div>
            <div className="snr-pax-row">
              {PAX.map(({ n, tag }) => (
                <div
                  key={n}
                  className={`snr-pax-btn ${pax === n ? "snr-active" : ""}`}
                  onClick={() => setPax(n)}
                >
                  <span className="snr-pax-num">{n}</span>
                  <span className="snr-pax-tag">{tag}</span>
                </div>
              ))}
            </div>

            <button
              className="snr-gen-btn"
              disabled={!pax || loading}
              onClick={handleGenerate}
            >
              {loading ? (
                <><div className="snr-spinner" /> Generating…</>
              ) : (
                <>
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                  </svg>
                  Create Room Link
                </>
              )}
            </button>
          </>
        )}

        {/* ── RESULT ── */}
        {code && (
          <div className="snr-result">
            <div className="snr-eyebrow">
              <span className="snr-pulse" /> Room is live
            </div>

            <div className="snr-code-box">
              <div className="snr-code-text">
                {parts.map((seg, i) => (
                  <span key={i}>
                    {seg}
                    {i < parts.length - 1 && <span className="snr-code-dash"> – </span>}
                  </span>
                ))}
              </div>
              <button className={`snr-copy-btn ${codeCopied ? "snr-copied" : ""}`} onClick={copyCode}>
                {codeCopied ? (
                  <><svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg> Copied!</>
                ) : (
                  <><svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy</>
                )}
              </button>
            </div>

            <div className="snr-link-row">
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="var(--muted)" strokeWidth="2" style={{ flexShrink: 0 }}>
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
              </svg>
              <div className="snr-link-url">{link}</div>
              <button className="snr-link-copy" onClick={copyLink}>{linkCopied ? "✓" : "Copy"}</button>
            </div>

            <button className="snr-enter-btn">
              Enter Room
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14m-7-7l7 7-7 7"/></svg>
            </button>
            <button className="snr-reset-btn" onClick={reset}>← Create a new room</button>
          </div>
        )}
      </div>
    </div>
  );
}