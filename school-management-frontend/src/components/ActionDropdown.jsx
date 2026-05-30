import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * ActionDropdown — a reusable MoreVertical kebab-menu dropdown.
 *
 * Props:
 *   items: Array<{ label: string, icon?: ReactElement, onClick: () => void, danger?: boolean, divider?: boolean }>
 *   align?: 'right' | 'left'   (default: 'right')
 *   triggerStyle?: object       (extra inline styles for the trigger button)
 */
const ActionDropdown = ({ items = [], align = 'right', triggerStyle = {} }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className="btn-icon"
        title="More Options"
        style={{
          backgroundColor: open ? 'var(--primary-light)' : 'var(--bg-body)',
          color: open ? 'var(--primary)' : 'var(--text-muted)',
          transition: 'all 0.15s',
          ...triggerStyle
        }}
      >
        <MoreVertical size={18} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -6 }}
            transition={{ duration: 0.12 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              [align === 'right' ? 'right' : 'left']: 0,
              zIndex: 9999,
              minWidth: '180px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              padding: '6px',
              overflow: 'hidden'
            }}
          >
            {items.map((item, i) =>
              item.divider ? (
                <div key={`divider-${i}`} style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '4px 8px' }} />
              ) : (
                <button
                  key={i}
                  onClick={() => { item.onClick?.(); setOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: item.danger ? 'var(--danger)' : 'var(--text-main)',
                    transition: 'background 0.12s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = item.danger
                      ? 'rgba(239,68,68,0.08)'
                      : 'var(--bg-body)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {item.icon && (
                    <span style={{ color: item.danger ? 'var(--danger)' : 'var(--primary)', display: 'flex' }}>
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </button>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActionDropdown;
