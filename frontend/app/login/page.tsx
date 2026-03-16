"use client";

import { useEffect } from "react";
import "./login.css";
import { useRouter } from "next/navigation";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;

export default function LoginPage() {
  const router = useRouter();
  
    useEffect(() => {
      const accessToken = localStorage.getItem("userAccessToken");
      if(accessToken) {
          router.replace("/home");
      }
    }, [router]);

  return (
    <div className="login-root">
      <div className="login-glow login-glow-1" />
      <div className="login-glow login-glow-2" />

      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-mark">C</div>
          Colearnix
        </div>

        <h1 className="login-title">Welcome Learner !</h1>
        <p className="login-sub">
          Sign in with Google to continue your study rooms
        </p>

        <button className="google-btn" onClick={() => {
          window.location.href = `${backendUrl}/api/auth/google`;
        }}>
          <svg className="google-icon" viewBox="0 0 533.5 544.3">
            <path fill="#4285f4" d="M533.5 278.4c0-18.5-1.5-37-4.7-54.9H272v103.9h146.9c-6.3 34.1-25.1 63-53.4 82.2v68.2h86.4c50.6-46.6 81.6-115.4 81.6-199.4z"/>
            <path fill="#34a853" d="M272 544.3c72.6 0 133.6-24 178.2-65.2l-86.4-68.2c-24 16.1-54.7 25.4-91.8 25.4-70.7 0-130.7-47.7-152.1-111.5H31.3v69.9C75.5 482.3 167.3 544.3 272 544.3z"/>
            <path fill="#fbbc04" d="M119.9 324.8c-10.1-30.1-10.1-62.7 0-92.8V162.1H31.3c-37.6 75.2-37.6 164.8 0 240l88.6-69.9z"/>
            <path fill="#ea4335" d="M272 107.7c39.5-.6 77.6 14.1 106.9 40.9l79.6-79.6C407.6 24.5 345.1-1 272 0 167.3 0 75.5 62 31.3 162.1l88.6 69.9C141.3 155.4 201.3 107.7 272 107.7z"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}