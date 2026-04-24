"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../services/authService";
import '../home/home.css'
import { ProfileSettings } from "../components/ProfileSettings";

import { authUtils } from "../utils/auth";
import { handleApiError } from "../utils/errorHandling";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";

export default function ProfilePage() {
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
      <Sidebar activeNav="profile" />

      {/* ── MAIN ── */}
      <main className="snd-main">

        {/* TOPBAR */}
        <Topbar breadcrumb="Profile Settings" onLogout={handleLogout} />

        {/* CONTENT */}
        <div className="snd-content">
          <ProfileSettings />
        </div>

      </main>
    </div>
  );
}
