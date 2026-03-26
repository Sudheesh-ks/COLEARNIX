"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { adminService } from "../../services/adminService";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";
import ConfirmModal from "../components/ConfirmModal";
import "../../home/home.css";

interface User {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  image?: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    userId: string;
    userName: string;
    isBlocked: boolean;
  } | null>(null);

  useEffect(() => {
    const verifyAdmin = async () => {
      const accessToken = localStorage.getItem("adminAccessToken");
      if (!accessToken) {
        try {
          const { data } = await adminService.refresh();
          if (data && data.token) {
            localStorage.setItem("adminAccessToken", data.token);
            fetchUsers();
          } else {
            router.replace("/admin/login");
          }
        } catch {
          router.replace("/admin/login");
        }
      } else {
        fetchUsers();
      }
    };
    verifyAdmin();
  }, [router, page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await adminService.getUsers(page, limit);
      if (data.success) {
        setUsers(data.data.users);
        setTotal(data.data.total);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerToggleBlock = (user: User) => {
    setModalConfig({
      userId: user._id,
      userName: user.name,
      isBlocked: user.isBlocked
    });
    setModalOpen(true);
  };

  const handleConfirmToggle = async () => {
    if (!modalConfig) return;
    
    const { userId } = modalConfig;
    try {
      setActionLoading(userId);
      setModalOpen(false);
      const { data } = await adminService.toggleBlockUser(userId);
      if (data.success) {
        setUsers(users.map(u => u._id === userId ? { ...u, isBlocked: data.data.isBlocked } : u));
      }
    } catch (error) {
      console.error('Failed to toggle block status:', error);
    } finally {
      setActionLoading(null);
      setModalConfig(null);
    }
  };

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

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="snd-root">
      {/* ── SIDEBAR ── */}
      <AdminSidebar pathname={pathname} />

      {/* ── MAIN ── */}
      <main className="snd-main">
        <AdminTopbar 
          breadcrumb="User Management" 
          onLogout={handleLogout} 
          showSearch={true}
        />

        <div className="snd-content" style={{ display: 'block' }}>
          <div className="snd-anim" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
             <div>
               <h1 style={{ fontFamily: 'Syne', fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>Platform Users</h1>
               <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Manage and monitor all registered accounts on the platform.</p>
             </div>
             <div className="snr-eyebrow">
               <div className="snr-pulse"></div>
               {total} Members Active
             </div>
          </div>

          <div className="snr-card snd-anim" style={{ maxWidth: 'none', borderBottom: 'none' }}>
            <div style={{ padding: '0', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--muted)' }}>
                    <th style={{ padding: '20px 24px' }}>Member Profile</th>
                    <th style={{ padding: '20px 24px' }}>Email Address</th>
                    <th style={{ padding: '20px 24px' }}>Current Status</th>
                    <th style={{ padding: '20px 24px', textAlign: 'right' }}>Management</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: '14px' }}>
                  {loading ? (
                    <tr>
                      <td colSpan={4} style={{ padding: '80px', textAlign: 'center' }}>
                        <div className="snr-spinner" style={{ margin: '0 auto', width: '40px', height: '40px', borderTopColor: 'var(--accent)' }} />
                        <div style={{ marginTop: '16px', color: 'var(--muted)', fontSize: '13px' }}>Synchronizing user data...</div>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ padding: '80px', textAlign: 'center', color: 'var(--muted)' }}>
                        <svg style={{ width: '48px', height: '48px', marginBottom: '16px', opacity: 0.2 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        <div style={{ fontSize: '15px' }}>No users found in the system.</div>
                      </td>
                    </tr>
                  ) : (
                    users.map((user, idx) => (
                      <tr key={user._id} className="snd-anim" style={{ borderBottom: '1px solid var(--border)', animationDelay: `${idx * 0.05}s` }}>
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div className="snd-user-av" style={{ width: '40px', height: '40px', fontSize: '16px', border: '1px solid var(--border)' }}>
                              {user.image ? <img src={user.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user.name[0]}
                            </div>
                            <div>
                               <div style={{ fontWeight: '700', fontSize: '15px' }}>{user.name}</div>
                               <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>ID: {user._id.slice(-8).toUpperCase()}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '16px 24px', color: 'var(--muted)', fontFamily: 'monospace' }}>{user.email}</td>
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ 
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700',
                            backgroundColor: user.isBlocked ? 'rgba(239, 68, 68, 0.08)' : 'rgba(110, 231, 183, 0.08)',
                            color: user.isBlocked ? '#f87171' : 'var(--accent)',
                            border: `1px solid ${user.isBlocked ? 'rgba(239, 68, 68, 0.15)' : 'rgba(110, 231, 183, 0.15)'}`
                          }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: user.isBlocked ? '#f87171' : 'var(--accent)' }}></div>
                            {user.isBlocked ? 'Account Suspended' : 'Verified Member'}
                          </div>
                        </td>
                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                          <button 
                            className="snr-gen-btn"
                            style={{ 
                              display: 'inline-flex', width: 'auto', minWidth: '100px',
                              padding: '8px 16px', fontSize: '13px', borderRadius: '10px',
                              backgroundColor: user.isBlocked ? 'rgba(110, 231, 183, 0.1)' : 'rgba(239, 68, 68, 0.05)',
                              color: user.isBlocked ? 'var(--accent)' : '#f87171',
                              border: `1px solid ${user.isBlocked ? 'var(--accent)' : '#f87171'}`,
                            }}
                            onClick={() => triggerToggleBlock(user)}
                            disabled={actionLoading === user._id}
                          >
                            {actionLoading === user._id ? (
                               <div className="snr-spinner" style={{ width: '14px', height: '14px', borderTopColor: 'currentColor' }} />
                            ) : (
                               user.isBlocked ? 'Restore Access' : 'Suspend User'
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ── PAGINATION ── */}
            {totalPages > 1 && (
              <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                <div style={{ color: 'var(--muted)', fontSize: '13px' }}>
                   Displaying <span style={{ color: 'var(--text)', fontWeight: '600' }}>{users.length}</span> of {total} users
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="snr-link-copy" 
                    style={{ padding: '8px 20px', fontSize: '13px' }}
                    disabled={page === 1 || loading}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </button>
                  <button 
                    className="snr-link-copy" 
                    style={{ padding: '8px 20px', fontSize: '13px', backgroundColor: 'var(--surface2)', color: 'var(--text)' }}
                    disabled={page === totalPages || loading}
                    onClick={() => setPage(page + 1)}
                  >
                    Next Page
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <ConfirmModal 
        isOpen={modalOpen}
        title={modalConfig?.isBlocked ? "Restore User Access?" : "Suspend User?"}
        message={modalConfig?.isBlocked 
          ? `Are you sure you want to restore access for ${modalConfig.userName}? They will be able to log in and interact with the platform again.`
          : `Are you sure you want to suspend ${modalConfig?.userName}? This will immediately revoke their access to the platform.`
        }
        confirmText={modalConfig?.isBlocked ? "Restore Access" : "Suspend User"}
        type={modalConfig?.isBlocked ? 'info' : 'danger'}
        onConfirm={handleConfirmToggle}
        onCancel={() => {
          setModalOpen(false);
          setModalConfig(null);
        }}
        isLoading={actionLoading === modalConfig?.userId}
      />
    </div>
  );
}
