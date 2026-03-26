"use client";

interface AdminTopbarProps {
  breadcrumb: string;
  onLogout: () => void;
  showSearch?: boolean;
}

export default function AdminTopbar({ breadcrumb, onLogout, showSearch = false }: AdminTopbarProps) {
  return (
    <header className="snd-topbar">
      <div className="snd-breadcrumb">
        Admin Console
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg>
        <span>{breadcrumb}</span>
      </div>
      
      <div className="snd-topbar-right">
         {showSearch && (
           <div className="snd-icon-btn">
             <svg style={{width:'18px'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
           </div>
         )}
         <div className="snd-icon-btn">
           <svg style={{width:'18px'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
           <div className="snd-notif-dot"></div>
         </div>
         <button className="snd-logout-btn" onClick={onLogout} title="Sign Out">
           <svg style={{width:'18px', height:'18px'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
             <polyline points="16 17 21 12 16 7"></polyline>
             <line x1="21" y1="12" x2="9" y2="12"></line>
           </svg>
         </button>
      </div>
    </header>
  );
}
