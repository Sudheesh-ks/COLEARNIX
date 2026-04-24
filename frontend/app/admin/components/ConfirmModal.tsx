"use client";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  type?: 'danger' | 'info';
}

import "./ConfirmModal.css";

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText,
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
  type = 'info'
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay">
      <div className="snr-card snd-anim" style={{ 
        maxWidth: '400px', 
        width: '100%', 
        backgroundColor: 'rgba(23, 23, 23, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
      }}>
        <div className="snr-body" style={{ padding: '32px' }}>
          <h2 style={{ 
            fontFamily: 'Syne', 
            fontSize: '22px', 
            fontWeight: '800', 
            marginBottom: '12px',
            color: type === 'danger' ? '#f87171' : 'var(--text)'
          }}>
            {title}
          </h2>
          <p style={{ 
            color: 'var(--muted)', 
            fontSize: '15px', 
            lineHeight: '1.6', 
            marginBottom: '32px' 
          }}>
            {message}
          </p>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="snr-link-copy" 
              style={{ flex: 1, padding: '12px', fontSize: '14px' }}
              onClick={onCancel}
              disabled={isLoading}
            >
              {cancelText}
            </button>
            <button 
              className="snr-gen-btn" 
              style={{ 
                flex: 1, 
                padding: '12px', 
                fontSize: '14px',
                backgroundColor: type === 'danger' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(110, 231, 183, 0.1)',
                color: type === 'danger' ? '#f87171' : 'var(--accent)',
                border: `1px solid ${type === 'danger' ? '#f87171' : 'var(--accent)'}`
              }}
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="snr-spinner" style={{ width: '16px', height: '16px', borderTopColor: 'currentColor' }} />
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
