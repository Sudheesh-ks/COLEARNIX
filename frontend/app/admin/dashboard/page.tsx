"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { adminService } from "../../services/adminService";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";
import "../../home/home.css";

export default function AdminDashboard() {
  const router = useRouter();
  const pathname = usePathname();
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
      <AdminSidebar pathname={pathname} />

      <main className="snd-main">
        <AdminTopbar 
          breadcrumb="Overview Dashboard" 
          onLogout={handleLogout} 
        />

        <div className="snd-content" style={{ display: 'block' }}>
          <div className="snd-anim" style={{ marginBottom: '32px' }}>
             <h1 style={{ fontFamily: 'Syne', fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>Welcome back, Admin</h1>
             <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Here's what's happening with your platform today.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            {[
              { label: 'Platform Users', value: '2,482', grow: '+12.5%', color: 'var(--accent)' },
              { label: 'Live Sessions', value: '148', grow: '+4.2%', color: 'var(--accent2)' },
              { label: 'Room Utilization', value: '86%', grow: '+2.1%', color: 'var(--accent4)' },
            ].map((stat, i) => (
              <div key={i} className="snr-card snd-anim" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="snr-rainbow"></div>
                <div className="snr-body" style={{ padding: '24px' }}>
                   <div style={{ color: 'var(--muted)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>{stat.label}</div>
                   <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                     <div style={{ fontFamily: 'Syne', fontSize: '32px', fontWeight: '800' }}>{stat.value}</div>
                     <div style={{ color: stat.color, fontSize: '13px', fontWeight: '700' }}>{stat.grow}</div>
                   </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="snr-card snd-anim" style={{ animationDelay: '0.3s', maxWidth: 'none' }}>
             <div className="snr-body" style={{ display: 'flex', alignItems: 'center', gap: '32px', padding: '40px' }}>
               <div className="snr-icon" style={{ width: '80px', height: '80px', fontSize: '32px' }}>📊</div>
               <div>
                 <h2 style={{ fontFamily: 'Syne', fontSize: '22px', fontWeight: '800', marginBottom: '10px' }}>Real-time Analytics Ready</h2>
                 <p style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: '1.6', maxWidth: '600px' }}>
                   The new management console is now fully synchronized with the production database. 
                   You can monitor user behavior, manage account statuses, and track platform growth in real-time.
                 </p>
                 <button className="snr-gen-btn" style={{ width: 'fit-content', padding: '12px 24px', marginTop: '20px' }}>
                    View Detailed Reports
                 </button>
               </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
