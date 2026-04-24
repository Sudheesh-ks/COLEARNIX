"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../services/authService";
import './home.css'
import { CreateRoomCard } from "../components/CreateRoomCard";
import { JoinRoomCard } from "../components/JoinRoomCard";

import { authUtils } from "../utils/auth";
import { handleApiError } from "../utils/errorHandling";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";

export default function HomePage() {
  const [activeNav, setActiveNav] = useState("home");
  const router = useRouter();

  useEffect(() => {
    const verifySession = async () => {
      const accessToken = authUtils.getToken();
      if (!accessToken) {
        try {
          const { data } = await authService.refresh();
          if (data && data.token) {
            authUtils.setToken(data.token);
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
      console.error(handleApiError(error));
    } finally {
      authUtils.clearSession();
      router.replace("/login");
    }
  };


  return (
    <div className="snd-root">

      {/* ── SIDEBAR ── */}
      <Sidebar activeNav={activeNav} />

      {/* ── MAIN ── */}
      <main className="snd-main">

        {/* TOPBAR */}
        <Topbar breadcrumb="Home" onLogout={handleLogout} />

        {/* CONTENT */}
        <div className="snd-content">
          <div className="sn-cards-grid">
            <CreateRoomCard />
            <JoinRoomCard />
          </div>
        </div>

      </main>
    </div>
  );
}