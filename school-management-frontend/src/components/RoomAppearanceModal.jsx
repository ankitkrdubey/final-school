import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Palette, Layout, Sliders, CheckCircle, Sparkles,
  Sun, Moon, Monitor, Eye, SlidersHorizontal, Settings2, Trash2
} from 'lucide-react';

// Default system configurations
export const defaultAppearance = {
  themeMode: 'sync',        // 'sync', 'dark', 'light', 'midnight'
  cardStyle: 'glassmorphic', // 'flat', 'glassmorphic', 'minimalist'
  occupancyStyle: 'dots',    // 'progressbar', 'dots', 'numeric'
  density: 'normal',         // 'dense', 'normal', 'spacious'
  colors: {
    full: '#ef4444',
    available: '#10b981',
    empty: '#64748b'
  }
};

// Retrieve settings from localStorage
export const getRoomAppearance = () => {
  try {
    const saved = localStorage.getItem('edupro_room_appearance');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with default values to ensure backward compatibility
      return {
        ...defaultAppearance,
        ...parsed,
        colors: { ...defaultAppearance.colors, ...(parsed.colors || {}) }
      };
    }
  } catch (e) {
    console.error('Failed to read room appearance setting:', e);
  }
  return defaultAppearance;
};

// Compute dynamic CSS styles based on active settings
export const applyRoomAppearanceStyles = (appearance, isSystemDark) => {
  const mode = appearance.themeMode;
  const card = appearance.cardStyle;
  const dens = appearance.density;
  
  // Resolve dark mode state
  let isDark = isSystemDark;
  if (mode === 'dark' || mode === 'midnight') isDark = true;
  if (mode === 'light') isDark = false;
  
  // Base Palette Configuration
  let palette = {
    bgBody: isDark ? '#1a202c' : '#f8f9fa',
    bgCard: isDark ? '#2d3748' : '#ffffff',
    textMain: isDark ? '#f7fafc' : '#2d3748',
    textMuted: isDark ? '#a0aec0' : '#718096',
    borderColor: isDark ? '#4a5568' : '#edf2f7',
    primary: '#45b3e0',
    primaryLight: isDark ? 'rgba(69, 179, 224, 0.15)' : 'rgba(69, 179, 224, 0.08)',
    shadow: isDark ? '0 10px 30px rgba(0,0,0,0.3)' : 'var(--shadow-sm)',
    backdrop: 'none'
  };
  
  // Midnight Accent Overrides
  if (mode === 'midnight') {
    palette.bgBody = '#0b0e14';
    palette.bgCard = '#131924';
    palette.textMain = '#f1f5f9';
    palette.textMuted = '#828fa9';
    palette.borderColor = '#2a344a';
    palette.primary = '#8b5cf6'; // Premium Purple Accent
    palette.primaryLight = 'rgba(139, 92, 246, 0.12)';
  }
  
  // Card Design Styles
  if (card === 'glassmorphic') {
    palette.backdrop = 'blur(16px)';
    palette.bgCard = isDark 
      ? (mode === 'midnight' ? 'rgba(19, 25, 36, 0.65)' : 'rgba(45, 55, 72, 0.55)')
      : 'rgba(255, 255, 255, 0.65)';
    palette.borderColor = isDark 
      ? (mode === 'midnight' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.08)')
      : 'rgba(255, 255, 255, 0.4)';
    palette.shadow = '0 20px 40px rgba(0, 0, 0, 0.06)';
  } else if (card === 'minimalist') {
    palette.bgCard = 'transparent';
    palette.borderColor = isDark ? '#4a5568' : '#e2e8f0';
    palette.shadow = 'none';
  }
  
  // Layout Densities
  let spacing = {
    padding: '32px',
    gap: '24px',
    borderRadius: '32px',
    cardPadding: '32px',
    fontSizeTitle: '2.5rem',
    fontSizeSub: '1.1rem',
    gridMin: '350px'
  };
  
  if (dens === 'dense') {
    spacing.padding = '20px';
    spacing.gap = '16px';
    spacing.borderRadius = '20px';
    spacing.cardPadding = '20px';
    spacing.fontSizeTitle = '1.8rem';
    spacing.fontSizeSub = '0.95rem';
    spacing.gridMin = '280px';
  } else if (dens === 'spacious') {
    spacing.padding = '48px';
    spacing.gap = '32px';
    spacing.borderRadius = '40px';
    spacing.cardPadding = '40px';
    spacing.fontSizeTitle = '3rem';
    spacing.fontSizeSub = '1.25rem';
    spacing.gridMin = '400px';
  }
  
  return { isDark, palette, spacing };
};

// Shared Appearance Panel React Component
export const RoomAppearanceModal = ({ isOpen, onClose, onChange }) => {
  const [appearance, setAppearance] = useState(getRoomAppearance);
  
  // Re-load appearance if opened
  useEffect(() => {
    if (isOpen) {
      setAppearance(getRoomAppearance());
    }
  }, [isOpen]);

  const updateSetting = (key, value) => {
    const updated = { ...appearance, [key]: value };
    setAppearance(updated);
    localStorage.setItem('edupro_room_appearance', JSON.stringify(updated));
    // Propagate changes via dispatcher and hook callback
    window.dispatchEvent(new Event('storage'));
    if (onChange) onChange(updated);
  };

  const updateColors = (status, hexValue) => {
    const updatedColors = { ...appearance.colors, [status]: hexValue };
    const updated = { ...appearance, colors: updatedColors };
    setAppearance(updated);
    localStorage.setItem('edupro_room_appearance', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    if (onChange) onChange(updated);
  };

  const handleReset = () => {
    setAppearance(defaultAppearance);
    localStorage.setItem('edupro_room_appearance', JSON.stringify(defaultAppearance));
    window.dispatchEvent(new Event('storage'));
    if (onChange) onChange(defaultAppearance);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          {/* Translucent overlay */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)' }}
          />

          {/* Drawer container */}
          <motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            style={{ 
              position: 'relative', width: '100%', maxWidth: '460px', height: '100%', 
              backgroundColor: appearance.themeMode === 'midnight' ? '#131924' : 'var(--bg-card)', 
              color: 'var(--text-main)', 
              boxShadow: '-10px 0 50px rgba(0, 0, 0, 0.15)', zIndex: 10,
              display: 'flex', flexDirection: 'column',
              borderLeft: '1px solid var(--border-color)',
              overflowY: 'auto'
            }}
          >
            {/* Header */}
            <div style={{ padding: '32px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', backgroundColor: 'var(--primary-light)', color: appearance.themeMode === 'midnight' ? '#8b5cf6' : 'var(--primary)', borderRadius: '12px' }}>
                  <Palette size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.2rem', letterSpacing: '-0.5px' }}>Residency Appearance</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Theme and visual overrides</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                style={{ 
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                  width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background-color 0.2s' 
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-body)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X size={18} />
              </button>
            </div>

            {/* Options Body */}
            <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px', flex: 1 }}>
              
              {/* Visual Override Themes */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Theme Override</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    { id: 'sync', name: 'Dashboard Sync', desc: 'Auto track settings', icon: <Monitor size={16} /> },
                    { id: 'light', name: 'Polar Light', desc: 'Crisp light interface', icon: <Sun size={16} color="#e67e22" /> },
                    { id: 'dark', name: 'Elegant Slate', desc: 'Muted dark space', icon: <Moon size={16} color="#45b3e0" /> },
                    { id: 'midnight', name: 'Midnight Cyber', desc: 'Vibrant deep purple', icon: <Sparkles size={16} color="#8b5cf6" /> }
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => updateSetting('themeMode', theme.id)}
                      style={{
                        padding: '16px', borderRadius: '16px', textAlign: 'left',
                        backgroundColor: appearance.themeMode === theme.id ? 'var(--primary-light)' : 'var(--bg-body)',
                        border: `2px solid ${appearance.themeMode === theme.id ? (appearance.themeMode === 'midnight' ? '#8b5cf6' : 'var(--primary)') : 'var(--border-color)'}`,
                        cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '8px',
                        transition: 'all 0.2s ease', color: 'var(--text-main)'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)' }}
                      onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ display: 'flex', alignItems: 'center' }}>{theme.icon}</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{theme.name}</span>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>{theme.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Design Types */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Card Aesthetics</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { id: 'glassmorphic', name: 'Premium Glassmorphic', desc: 'Translucent backdrops, fine blurs and smooth glow highlights' },
                    { id: 'flat', name: 'Modern Flat Accent', desc: 'High-contrast, solid cards and borders for precise readability' },
                    { id: 'minimalist', name: 'Minimalist Borderless', desc: 'Zero shadows, structural divider borders and streamlined spacing' }
                  ].map((style) => (
                    <div
                      key={style.id}
                      onClick={() => updateSetting('cardStyle', style.id)}
                      style={{
                        padding: '16px 20px', borderRadius: '16px', cursor: 'pointer',
                        backgroundColor: 'var(--bg-body)',
                        border: `1.5px solid ${appearance.cardStyle === style.id ? (appearance.themeMode === 'midnight' ? '#8b5cf6' : 'var(--primary)') : 'var(--border-color)'}`,
                        display: 'flex', justifyItems: 'center', gap: '14px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                      onMouseOut={(e) => { if (appearance.cardStyle !== style.id) e.currentTarget.style.borderColor = 'var(--border-color)' }}
                    >
                      <div style={{ marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ 
                          width: '18px', height: '18px', borderRadius: '50%', border: '2px solid var(--text-muted)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          borderColor: appearance.cardStyle === style.id ? (appearance.themeMode === 'midnight' ? '#8b5cf6' : 'var(--primary)') : 'var(--text-muted)'
                        }}>
                          {appearance.cardStyle === style.id && (
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: appearance.themeMode === 'midnight' ? '#8b5cf6' : 'var(--primary)' }} />
                          )}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>{style.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px', lineHeight: '1.4' }}>{style.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Occupancy Indicator Model */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Occupancy Visualizer</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {[
                    { id: 'progressbar', label: 'Progress Bar' },
                    { id: 'dots', label: 'Tactile Beds' },
                    { id: 'numeric', label: 'Numeric Stats' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => updateSetting('occupancyStyle', opt.id)}
                      style={{
                        padding: '12px 6px', borderRadius: '12px', cursor: 'pointer',
                        border: `1.5px solid ${appearance.occupancyStyle === opt.id ? (appearance.themeMode === 'midnight' ? '#8b5cf6' : 'var(--primary)') : 'var(--border-color)'}`,
                        backgroundColor: appearance.occupancyStyle === opt.id ? 'var(--primary-light)' : 'var(--bg-card)',
                        color: appearance.occupancyStyle === opt.id ? (appearance.themeMode === 'midnight' ? '#a78bfa' : 'var(--primary)') : 'var(--text-main)',
                        fontWeight: 800, fontSize: '0.8rem', textAlign: 'center', transition: 'all 0.2s'
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Layout Density */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Layout Spacing & Density</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  {[
                    { id: 'dense', label: 'Dense', desc: 'Compact spacing' },
                    { id: 'normal', label: 'Balanced', desc: 'Standard space' },
                    { id: 'spacious', label: 'Spacious', desc: 'Luxury padding' }
                  ].map((dens) => (
                    <button
                      key={dens.id}
                      onClick={() => updateSetting('density', dens.id)}
                      style={{
                        padding: '14px 10px', borderRadius: '14px', cursor: 'pointer',
                        border: `1.5px solid ${appearance.density === dens.id ? (appearance.themeMode === 'midnight' ? '#8b5cf6' : 'var(--primary)') : 'var(--border-color)'}`,
                        backgroundColor: appearance.density === dens.id ? 'var(--primary-light)' : 'var(--bg-body)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                        transition: 'all 0.2s ease', color: 'var(--text-main)'
                      }}
                    >
                      <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>{dens.label}</span>
                      <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 500 }}>{dens.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Status Colors */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Status Color Codes</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  {[
                    { key: 'full', label: 'Full / Occupied Unit', default: '#ef4444' },
                    { key: 'available', label: 'Beds Available', default: '#10b981' },
                    { key: 'empty', label: 'Fully Vacant Unit', default: '#64748b' }
                  ].map((status) => (
                    <div key={status.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>{status.label}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Interactive circle color selector previews */}
                        {['#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#8b5cf6', '#64748b'].map(color => (
                          <div 
                            key={color} 
                            onClick={() => updateColors(status.key, color)}
                            style={{ 
                              width: '16px', height: '16px', borderRadius: '50%', backgroundColor: color, 
                              cursor: 'pointer', border: appearance.colors[status.key] === color ? '2px solid var(--text-main)' : 'none',
                              boxShadow: appearance.colors[status.key] === color ? '0 0 4px rgba(0,0,0,0.3)' : 'none',
                              transform: appearance.colors[status.key] === color ? 'scale(1.2)' : 'scale(1)',
                              transition: 'transform 0.2s'
                            }} 
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '12px', backgroundColor: 'var(--bg-body)' }}>
              <button 
                onClick={handleReset}
                style={{ 
                  flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)', 
                  backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 800, fontSize: '0.85rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' 
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--border-color)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
              >
                <Trash2 size={16} /> Reset Default
              </button>
              <button 
                onClick={onClose}
                style={{ 
                  flex: 1, padding: '14px', borderRadius: '14px', border: 'none', 
                  backgroundColor: appearance.themeMode === 'midnight' ? '#8b5cf6' : 'var(--primary)', color: 'white', fontWeight: 800, fontSize: '0.85rem',
                  cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}
                onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.filter = 'brightness(1)'}
              >
                Apply Layout
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
