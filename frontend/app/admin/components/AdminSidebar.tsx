"use client";

import { useRouter } from "next/navigation";

interface AdminSidebarProps {
  pathname: string;
}

export default function AdminSidebar({ pathname }: AdminSidebarProps) {
  const router = useRouter();

  return (
    <aside className="snd-sidebar">
      <div className="snd-logo-wrap" onClick={() => router.push('/admin/dashboard')} style={{ cursor: 'pointer' }}>
        <div className="snd-logo-mark">A</div>
        <span className="snd-logo-text">Admin.LX</span>
      </div>

      <div className="snd-sb-section">
        <div className="snd-sb-label">Management</div>
        <div 
          className={`snd-nav-item ${pathname === '/admin/dashboard' ? 'snd-active' : ''}`}
          onClick={() => router.push('/admin/dashboard')}
        >
          <span className="snd-nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
          </span>
          Dashboard Overview
        </div>
        <div 
          className={`snd-nav-item ${pathname === '/admin/users' ? 'snd-active' : ''}`}
          onClick={() => router.push('/admin/users')}
        >
          <span className="snd-nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </span>
          Users Management
        </div>
      </div>

      <div className="snd-sb-footer">
        <div className="snd-user-card">
           <div className="snd-user-av">A</div>
           <div className="snd-user-info">
             <div className="snd-user-name">Colearnix Admin</div>
             <div className="snd-user-role">System Administrator</div>
           </div>
           <div className="snd-user-dot"></div>
        </div>
      </div>
    </aside>
  );
}
