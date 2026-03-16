"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../services/authService";
import '../home/home.css'
import { ProfileSettings } from "../components/ProfileSettings";

const NAV_MAIN = [
  {
    id: "home", label: "Home",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    route: "/home"
  },
  {
    id: "activity", label: "Activity",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    route: "/activity"
  },
];
const NAV_SETTINGS = [
  {
    id: "profile", label: "Profile Settings",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    route: "/profile"
  },
];

export default function ProfilePage() {
  const router = useRouter();

  useEffect(() => {
    const verifySession = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        try {
          const { data } = await authService.refresh();
          if (data && data.token) {
            localStorage.setItem("accessToken", data.token);
          } else {
            router.replace("/login");
          }
        } catch {
          router.replace("/login");
        }
      }
    };
    verifySession();
  }, [router]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem("accessToken");
      router.replace("/login");
    }
  };

  const handleNavClick = (route: string) => {
    router.push(route);
  };

  return (
    <div className="snd-root">

      {/* ── SIDEBAR ── */}
      <aside className="snd-sidebar">
        <div className="snd-logo-wrap" onClick={() => router.push("/home")} style={{cursor: "pointer"}}>
          <div className="snd-logo-mark">C</div>
          <span className="snd-logo-text">Colearnix</span>
        </div>

        <div className="snd-sb-section">
          <div className="snd-sb-label">Menu</div>
          {NAV_MAIN.map(item => (
            <div
              key={item.id}
              className={`snd-nav-item ${item.id === "home" ? "" : ""}`} // logic for active
              onClick={() => handleNavClick(item.route)}
            >
              <span className="snd-nav-icon">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>

        <div className="snd-sb-section">
          <div className="snd-sb-label">Settings</div>
          {NAV_SETTINGS.map(item => (
            <div
              key={item.id}
              className={`snd-nav-item ${item.id === "profile" ? "snd-active" : ""}`}
              onClick={() => handleNavClick(item.route)}
            >
              <span className="snd-nav-icon">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>

        <div className="snd-sb-footer">
          <div className="snd-user-card">
            <div className="snd-user-av">AK</div>
            <div className="snd-user-info">
              <div className="snd-user-name">Alex Kumar</div>
              <div className="snd-user-role">@alex_kumar</div>
            </div>
            <div className="snd-user-dot" />
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="snd-main">

        {/* TOPBAR */}
        <header className="snd-topbar">
          <div className="snd-breadcrumb">
            Colearnix
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg>
            <span>Profile Settings</span>
          </div>

          <div className="snd-topbar-right">
            {/* Notification */}
            <div className="snd-icon-btn">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              <div className="snd-notif-dot" />
            </div>

            {/* Logout */}
            <div className="snd-logout-btn" title="Sign out" onClick={handleLogout} style={{ cursor: "pointer" }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </div>

            {/* Avatar */}
            <div className="snd-topbar-av">AK</div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="snd-content">
          <ProfileSettings />
        </div>

      </main>
    </div>
  );
}
