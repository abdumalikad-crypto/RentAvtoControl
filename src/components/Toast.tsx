'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toast, hideToast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={24} color="#2A694D" />,
    warning: <AlertTriangle size={24} color="#D4801C" />,
    error: <AlertCircle size={24} color="#C44738" />,
    info: <Info size={24} color="#C4592B" />,
  };

  return (
    <div className="toast-container">
      <div className={`toast-body ${toast.type}`}>
        <div style={{ flexShrink: 0, marginTop: '2px' }}>{icons[toast.type]}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem', color: 'var(--text-primary)' }}>
            {toast.title}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            {toast.message}
          </div>
        </div>
        <button
          onClick={hideToast}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '2px',
          }}
          title="Yopish"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
