"use client";

import { useRouter } from "next/navigation";

const NAV_MAIN = [
  {
    id: "home",
    label: "Home",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    route: "/home",
  },
];

const NAV_SETTINGS = [
  {
    id: "profile",
    label: "Profile Settings",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    route: "/profile",
  },
];

interface SidebarProps {
  activeNav: string;
}

export function Sidebar({ activeNav }: SidebarProps) {
  const router = useRouter();

  const handleNavClick = (route: string) => {
    router.push(route);
  };

  return (
    <aside className="snd-sidebar">
      <div 
        className="snd-logo-wrap" 
        onClick={() => router.push("/home")} 
        style={{ cursor: "pointer" }}
      >
        <div className="snd-logo-mark">C</div>
        <span className="snd-logo-text">Colearnix</span>
      </div>

      <div className="snd-sb-section">
        <div className="snd-sb-label">Menu</div>
        {NAV_MAIN.map((item) => (
          <div
            key={item.id}
            className={`snd-nav-item ${activeNav === item.id ? "snd-active" : ""}`}
            onClick={() => handleNavClick(item.route)}
          >
            <span className="snd-nav-icon">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>

      <div className="snd-sb-section">
        <div className="snd-sb-label">Settings</div>
        {NAV_SETTINGS.map((item) => (
          <div
            key={item.id}
            className={`snd-nav-item ${activeNav === item.id ? "snd-active" : ""}`}
            onClick={() => handleNavClick(item.route)}
          >
            <span className="snd-nav-icon">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>
    </aside>
  );
}
