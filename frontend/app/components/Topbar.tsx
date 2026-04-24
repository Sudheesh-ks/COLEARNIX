"use client";

interface TopbarProps {
  breadcrumb: string;
  onLogout: () => void;
}

export function Topbar({ breadcrumb, onLogout }: TopbarProps) {
  return (
    <header className="snd-topbar">
      <div className="snd-breadcrumb">
        Colearnix
        <svg
          width="12"
          height="12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 5l7 7-7 7" />
        </svg>
        <span>{breadcrumb}</span>
      </div>

      <div className="snd-topbar-right">
        {/* Logout */}
        <div
          className="snd-logout-btn"
          title="Sign out"
          onClick={onLogout}
          style={{ cursor: "pointer" }}
        >
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </div>

        {/* Avatar */}
        {/* <div className="snd-topbar-av">AK</div> */}
      </div>
    </header>
  );
}
