import React from 'react';
import { Shield, Check, X, Users, Settings, Database, Bell, Lock, Crown, Award, Star, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AdminTiers = () => {
  const navigate = useNavigate();
  const [editingTier, setEditingTier] = React.useState(null);
  const [showToast, setShowToast] = React.useState(false);

  const [adminTiers, setAdminTiers] = React.useState(() => {
    try {
      const stored = localStorage.getItem('admin_tiers');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    return [
      {
        id: 'super',
        name: 'Super Administrator',
        iconName: 'Crown',
        color: '#8B5CF6',
        description: 'Unrestricted access to all institutional systems, financial data, and root configurations.',
        users: 2,
        permissions: [
          { label: 'Full System Access', value: true },
          { label: 'Financial Management', value: true },
          { label: 'Role & Permission Editing', value: true },
          { label: 'Database Backup & Restore', value: true },
          { label: 'System Settings Access', value: true },
          { label: 'Cross-Branch Management', value: true }
        ]
      },
      {
        id: 'branch',
        name: 'Branch Manager',
        iconName: 'Award',
        color: '#3B82F6',
        description: 'Complete control over a specific school branch including staff and student management.',
        users: 5,
        permissions: [
          { label: 'Branch Data Access', value: true },
          { label: 'Staff Management', value: true },
          { label: 'Student Enrollment', value: true },
          { label: 'Basic Reporting', value: true },
          { label: 'System Settings Access', value: false },
          { label: 'Global Financials', value: false }
        ]
      },
      {
        id: 'dept',
        name: 'Department Head',
        iconName: 'Star',
        color: '#10B981',
        description: 'Specialized access for managing academic departments, curriculum, and teacher schedules.',
        users: 12,
        permissions: [
          { label: 'Department Access', value: true },
          { label: 'Curriculum Management', value: true },
          { label: 'Teacher Timetables', value: true },
          { label: 'Exam Coordination', value: true },
          { label: 'Financial Access', value: false },
          { label: 'Admin Management', value: false }
        ]
      }
    ];
  });

  const getTierIconElement = (iconName) => {
    switch (iconName) {
      case 'Crown': return <Crown size={32} />;
      case 'Award': return <Award size={32} />;
      case 'Star': return <Star size={32} />;
      default: return <Crown size={32} />;
    }
  };

  const handleTogglePermission = (permLabel) => {
    if (!editingTier) return;
    setEditingTier(prev => ({
      ...prev,
      permissions: prev.permissions.map(perm =>
        perm.label === permLabel ? { ...perm, value: !perm.value } : perm
      )
    }));
  };

  const handleSaveConfiguration = () => {
    if (!editingTier) return;
    const updated = adminTiers.map(tier =>
      tier.id === editingTier.id ? { ...tier, permissions: editingTier.permissions } : tier
    );
    setAdminTiers(updated);
    localStorage.setItem('admin_tiers', JSON.stringify(updated));
    setShowToast(true);
    setEditingTier(null);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '8px' }}>Administrative Hierarchy</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Define institutional tiers, manage granular permissions, and oversee administrative access levels.</p>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{ 
              position: 'fixed', bottom: '40px', right: '40px', zIndex: 1300,
              backgroundColor: 'var(--success)', color: 'white', padding: '16px 24px',
              borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px',
              boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)', fontWeight: 700
            }}
          >
            <ShieldCheck size={20} />
            Administrative hierarchy synchronized successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
        {adminTiers.map((tier, idx) => (
          <motion.div 
            key={tier.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="card"
            style={{ padding: '40px', borderTop: `8px solid ${tier.color}`, position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.05, transform: 'rotate(-15deg)' }}>
              {React.cloneElement(getTierIconElement(tier.iconName), { size: 160 })}
            </div>

            <div style={{ 
              width: '64px', height: '64px', borderRadius: '20px', backgroundColor: `${tier.color}15`, 
              color: tier.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' 
            }}>
              {getTierIconElement(tier.iconName)}
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '12px' }}>{tier.name}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '32px' }}>{tier.description}</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', padding: '12px 20px', backgroundColor: 'var(--bg-body)', borderRadius: '14px' }}>
              <Users size={18} color={tier.color} />
              <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{tier.users} Active Personnel</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
              {tier.permissions.map((perm, pidx) => (
                <div key={pidx} style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: perm.value ? 1 : 0.4 }}>
                  {perm.value ? <Check size={18} color="var(--success)" strokeWidth={3} /> : <X size={18} color="var(--danger)" strokeWidth={3} />}
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{perm.label}</span>
                </div>
              ))}
            </div>

            <button 
              className="btn btn-primary" 
              onClick={() => setEditingTier(tier)}
              style={{ width: '100%', padding: '16px', borderRadius: '16px', backgroundColor: tier.color, border: 'none', fontWeight: 800 }}
            >
              Configure Tier
            </button>
          </motion.div>
        ))}
      </div>

      {/* Hierarchy Info */}
      <div className="card" style={{ marginTop: '40px', padding: '32px', display: 'flex', alignItems: 'center', gap: '32px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Shield size={40} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontWeight: 900, marginBottom: '8px' }}>Security Protocol Alpha</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>The hierarchy is strictly enforced via institutional middleware. Changes to Super Admin credentials require physical multi-factor authentication (YubiKey) and secondary board approval.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05, translateY: -2, boxShadow: '0 12px 20px -8px rgba(139, 92, 246, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          className="btn" 
          onClick={() => navigate('/dashboard/security-logs')}
          style={{ 
            padding: '14px 28px', 
            borderRadius: '14px', 
            fontWeight: 800, 
            background: 'linear-gradient(135deg, var(--primary) 0%, #8B5CF6 100%)', 
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 16px -4px rgba(139, 92, 246, 0.3)',
            transition: 'box-shadow 0.2s ease'
          }}
        >
          <Database size={16} />
          <span>Audit Logs</span>
        </motion.button>
      </div>

      {/* Configuration Drawer */}
      <AnimatePresence>
        {editingTier && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', justifyContent: 'flex-end' }}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingTier(null)}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ width: '500px', height: '100%', backgroundColor: 'var(--bg-card)', padding: '48px', position: 'relative', boxShadow: 'var(--shadow-2xl)', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: `${editingTier.color}15`, color: editingTier.color }}>
                    {getTierIconElement(editingTier.iconName)}
                  </div>
                  <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900 }}>{editingTier.name}</h2>
                </div>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Adjust granular permissions and institutional access rules for this administrative level.</p>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', marginBottom: '40px' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '24px' }}>Access Permissions</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {editingTier.permissions.map((perm, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px' }}>
                      <span style={{ fontWeight: 700 }}>{perm.label}</span>
                      <div 
                        onClick={() => handleTogglePermission(perm.label)}
                        style={{ 
                          width: '44px', height: '24px', borderRadius: '20px', padding: '3px', cursor: 'pointer',
                          backgroundColor: perm.value ? editingTier.color : 'var(--border-color)',
                          transition: '0.3s', position: 'relative'
                        }}
                      >
                        <div style={{ width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', left: perm.value ? '23px' : '3px', transition: '0.3s' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button className="btn" onClick={() => setEditingTier(null)} style={{ flex: 1, padding: '16px', borderRadius: '16px', fontWeight: 800 }}>Cancel</button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleSaveConfiguration}
                  style={{ flex: 1, padding: '16px', borderRadius: '16px', backgroundColor: editingTier.color, border: 'none', fontWeight: 800 }}
                >
                  Save Configuration
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminTiers;
