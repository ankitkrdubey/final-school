import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// ─── Hook ────────────────────────────────────────────────────────────────────
export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success', title = null) => {
    setToast({ message, type, title, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  return { toast, showToast, hideToast };
};

// ─── Renderer ─────────────────────────────────────────────────────────────────
const CONFIGS = {
  success: {
    icon: <CheckCircle2 size={20} />,
    bg: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(5,150,105,0.1) 100%)',
    border: 'rgba(16,185,129,0.3)',
    iconColor: '#10B981',
    titleColor: '#059669',
  },
  error: {
    icon: <XCircle size={20} />,
    bg: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(220,38,38,0.1) 100%)',
    border: 'rgba(239,68,68,0.3)',
    iconColor: '#EF4444',
    titleColor: '#DC2626',
  },
  warning: {
    icon: <AlertTriangle size={20} />,
    bg: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(217,119,6,0.1) 100%)',
    border: 'rgba(245,158,11,0.3)',
    iconColor: '#F59E0B',
    titleColor: '#D97706',
  },
  info: {
    icon: <Info size={20} />,
    bg: 'linear-gradient(135deg, rgba(72,128,255,0.15) 0%, rgba(59,130,246,0.1) 100%)',
    border: 'rgba(72,128,255,0.3)',
    iconColor: '#4880FF',
    titleColor: '#3B82F6',
  },
};

export const ToastRenderer = ({ toast, onClose }) => {
  const cfg = CONFIGS[toast?.type] || CONFIGS.success;

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 99999,
            minWidth: '320px',
            maxWidth: '420px',
            background: cfg.bg,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${cfg.border}`,
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }}
        >
          <div style={{ color: cfg.iconColor, marginTop: '2px', flexShrink: 0 }}>
            {cfg.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {toast.title && (
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: cfg.titleColor, marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {toast.title}
              </div>
            )}
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main, #1e293b)', lineHeight: 1.4 }}>
              {toast.message}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted, #94a3b8)', padding: '2px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px' }}
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
