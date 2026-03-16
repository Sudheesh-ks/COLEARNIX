"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminService } from "../../services/adminService";
import "../../home/home.css";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      const accessToken = localStorage.getItem("adminAccessToken");
      if (!accessToken) {
        try {
          const { data } = await adminService.refresh();
          if (data && data.token) {
            localStorage.setItem("adminAccessToken", data.token);
            setLoading(false);
          } else {
            router.replace("/admin/login");
          }
        } catch {
          router.replace("/admin/login");
        }
      } else {
        setLoading(false);
      }
    };
    verifyAdmin();
  }, [router]);

  const handleLogout = async () => {
    try {
      await adminService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem("adminAccessToken");
      router.replace("/admin/login");
    }
  };

  if (loading) {
    return (
      <div className="snd-root" style={{ display: 'grid', placeItems: 'center' }}>
        <div className="snr-spinner" style={{ width: '40px', height: '40px' }} />
      </div>
    );
  }

  return (
    <div className="snd-root">
      {/* SIDEBAR */}
      <aside className="snd-sidebar">
        <div className="snd-logo-wrap">
          <div className="snd-logo-mark">C</div>
          <span className="snd-logo-text">Colearnix Admin</span>
        </div>

        <div className="snd-sb-section">
          <div className="snd-sb-label">Management</div>
          <div className="snd-nav-item snd-active">
            <span className="snd-nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
            </span>
            Dashboard
          </div>
          <div className="snd-nav-item">
            <span className="snd-nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </span>
            Users
          </div>
        </div>

        <div className="snd-sb-footer">
          <button className="snd-logout-btn" onClick={handleLogout} style={{ width: '100%', justifyContent: 'center' }}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="snd-main">
        <header className="snd-topbar">
          <div className="snd-breadcrumb">
            Admin Console
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg>
            <span>Dashboard Overview</span>
          </div>
        </header>

        <div className="snd-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {[
              { label: 'Total Users', value: '1,284', grow: '+12%' },
              { label: 'Active Rooms', value: '42', grow: '+5%' },
              { label: 'Daily Session', value: '8.4h', grow: '+18%' },
            ].map((stat, i) => (
              <div key={i} className="snr-card snd-anim" style={{ padding: '24px' }}>
                 <div style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '8px' }}>{stat.label}</div>
                 <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                   <div style={{ fontSize: '28px', fontWeight: '800' }}>{stat.value}</div>
                   <div style={{ color: 'var(--accent)', fontSize: '12px', fontWeight: '700' }}>{stat.grow}</div>
                 </div>
              </div>
            ))}
          </div>
          
          <div className="snr-card snd-anim" style={{ marginTop: '24px', padding: '40px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px' }}>Admin Dashboard Loaded</h2>
            <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Welcome back! This is the placeholder for the management console.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
