import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Gem, Zap, Wallet, Plus, Edit, Trash2, CheckCircle, ArrowRight, Bed, Users, Info, X, SlidersHorizontal } from 'lucide-react';
import { 
  RoomAppearanceModal, getRoomAppearance, applyRoomAppearanceStyles 
} from '../components/RoomAppearanceModal';

const RoomCategories = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Premium Elite', price: '12,500', capacity: 2, amenities: ['AC', 'Attached Bath', 'Personal Desk', 'High-Speed Wi-Fi', 'Daily Cleaning'], color: '#8b5cf6', icon: <Gem size={24} />, totalUnits: 12 },
    { id: 2, name: 'Standard Comfort', price: '8,000', capacity: 4, amenities: ['Fan', 'Shared Bath', 'Storage Locker', 'Weekly Cleaning'], color: '#3b82f6', icon: <Zap size={24} />, totalUnits: 45 },
    { id: 3, name: 'Economy Value', price: '5,000', capacity: 6, amenities: ['Fan', 'Communal Bath', 'Locker'], color: '#10b981', icon: <Wallet size={24} />, totalUnits: 28 }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', price: '', capacity: '', amenities: '' });
  const [toast, setToast] = useState(null);

  // Appearance Overrides State
  const [appearance, setAppearance] = useState(getRoomAppearance);
  const [showAppearanceModal, setShowAppearanceModal] = useState(false);
  const [systemDark, setSystemDark] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const syncAppearance = () => {
      setAppearance(getRoomAppearance());
      setSystemDark(localStorage.getItem('theme') === 'dark');
    };
    window.addEventListener('storage', syncAppearance);
    
    // Track data-theme shifts dynamically
    const observer = new MutationObserver(() => {
      setSystemDark(document.documentElement.getAttribute('data-theme') === 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    
    return () => {
      window.removeEventListener('storage', syncAppearance);
      observer.disconnect();
    };
  }, []);

  const { isDark, palette, spacing } = applyRoomAppearanceStyles(appearance, systemDark);

  const handleDeleteCategory = (id) => {
    const category = categories.find(c => c.id === id);
    setCategories(categories.filter(c => c.id !== id));
    setToast(`${category.name} category has been removed.`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateCategory = (e) => {
    e.preventDefault();
    setCategories(categories.map(c => c.id === editingCategory.id ? {
      ...c,
      name: newCategory.name,
      price: newCategory.price,
      capacity: parseInt(newCategory.capacity),
      amenities: newCategory.amenities.split(',').map(s => s.trim())
    } : c));
    setEditingCategory(null);
    setToast(`${newCategory.name} has been updated.`);
    setNewCategory({ name: '', price: '', capacity: '', amenities: '' });
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    const cat = {
      id: categories.length + 1,
      name: newCategory.name,
      price: newCategory.price,
      capacity: parseInt(newCategory.capacity),
      amenities: newCategory.amenities.split(',').map(s => s.trim()),
      color: '#4f46e5',
      icon: <ShieldCheck size={24} />,
      totalUnits: 0
    };
    setCategories([...categories, cat]);
    setShowAddModal(false);
    setToast(`${newCategory.name} has been launched.`);
    setNewCategory({ name: '', price: '', capacity: '', amenities: '' });
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setNewCategory({
      name: cat.name,
      price: cat.price,
      capacity: cat.capacity,
      amenities: cat.amenities.join(', ')
    });
  };

  return (
    <div style={{ 
      padding: spacing.padding, 
      backgroundColor: palette.bgBody, 
      minHeight: '100vh', 
      color: palette.textMain, 
      position: 'relative',
      transition: 'all 0.3s ease'
    }}>
      
      {/* Background Decor */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        right: 0, 
        width: '800px', 
        height: '800px', 
        background: `radial-gradient(circle, ${palette.primaryLight} 0%, transparent 70%)`, 
        pointerEvents: 'none' 
      }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.gap, position: 'relative', zIndex: 2, flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: spacing.fontSizeTitle, fontWeight: 950, color: palette.textMain, letterSpacing: '-1.5px', marginBottom: '8px', transition: 'font-size 0.3s' }}>Room Categories</h1>
          <p style={{ color: palette.textMuted, fontSize: spacing.fontSizeSub, fontWeight: 500, transition: 'font-size 0.3s' }}>Define and manage institutional accommodation standards and pricing.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            onClick={() => setShowAppearanceModal(true)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 24px', 
              backgroundColor: palette.bgCard, color: palette.textMain, borderRadius: '18px', 
              border: `1px solid ${palette.borderColor}`, fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
              boxShadow: palette.shadow, transition: 'all 0.3s',
              backdropFilter: palette.backdrop
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.backgroundColor = palette.bgBody; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.backgroundColor = palette.bgCard; }}
          >
            <SlidersHorizontal size={18} color={palette.primary} /> Customize Style
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 32px', 
              backgroundColor: palette.primary, color: 'white', borderRadius: '18px', 
              border: 'none', fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
              boxShadow: `0 10px 25px ${palette.primaryLight}`, transition: '0.3s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.filter = 'brightness(1)'; }}
          >
            <Plus size={20} /> Create New Category
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${spacing.gridMin}, 1fr))`, gap: spacing.gap, position: 'relative', zIndex: 2 }}>
        {categories.map((cat, i) => (
          <motion.div 
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{ 
              backgroundColor: palette.bgCard, 
              borderRadius: spacing.borderRadius, 
              padding: spacing.cardPadding, 
              boxShadow: palette.shadow, 
              border: `1px solid ${palette.borderColor}`,
              backdropFilter: palette.backdrop,
              position: 'relative', 
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
          >
             {/* Background Decoration */}
             <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', backgroundColor: `${cat.color}08`, borderRadius: '50%' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                 <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: `${cat.color}15`, color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {cat.icon}
                 </div>
                 <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 900, color: palette.textMuted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Monthly Fee</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 950, color: palette.textMain }}>₹{cat.price}</div>
                 </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                 <h3 style={{ fontSize: '1.5rem', fontWeight: 950, color: palette.textMain, marginBottom: '8px' }}>{cat.name}</h3>
                 <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 700, color: palette.textMuted }}>
                       <Users size={16} /> {cat.capacity} Persons / Unit
                    </div>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: palette.borderColor }} />
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: cat.color }}>
                       {cat.totalUnits} Active Units
                    </div>
                 </div>
              </div>

              <div style={{ backgroundColor: palette.bgBody, borderRadius: '24px', padding: '24px', marginBottom: '32px', border: `1px solid ${palette.borderColor}` }}>
                 <div style={{ fontSize: '0.85rem', fontWeight: 900, color: palette.textMuted, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Info size={14} /> INCLUDED AMENITIES
                 </div>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {cat.amenities.map((amenity, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700, color: palette.textMuted }}>
                         <CheckCircle size={14} color={cat.color} /> {amenity}
                      </div>
                    ))}
                 </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                 <button 
                   onClick={() => openEditModal(cat)}
                   style={{ 
                     flex: 1, padding: '16px', borderRadius: '16px', 
                     border: `1px solid ${palette.borderColor}`, 
                     backgroundColor: palette.bgCard, color: palette.textMain, 
                     fontWeight: 800, cursor: 'pointer', display: 'flex', 
                     alignItems: 'center', justifyContent: 'center', gap: '10px', 
                     transition: '0.2s',
                     backdropFilter: palette.backdrop
                   }}
                   onMouseOver={(e) => e.currentTarget.style.backgroundColor = palette.bgBody}
                   onMouseOut={(e) => e.currentTarget.style.backgroundColor = palette.bgCard}
                 >
                    <Edit size={18} /> Edit Plan
                 </button>
                 <button 
                   onClick={() => handleDeleteCategory(cat.id)}
                   style={{ width: '56px', height: '56px', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.2)', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s' }}
                   onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)'}
                   onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                 >
                    <Trash2 size={20} />
                 </button>
              </div>
          </motion.div>
        ))}
      </div>

      {/* Category Modal (Add/Edit) */}
      <AnimatePresence>
        {(showAddModal || editingCategory) && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => { setShowAddModal(false); setEditingCategory(null); }}
               style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)' }}
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               style={{ 
                 position: 'relative', width: '100%', maxWidth: '500px', 
                 backgroundColor: palette.bgCard, 
                 borderRadius: '32px', padding: '48px', 
                 boxShadow: palette.shadow,
                 border: `1px solid ${palette.borderColor}`,
                 backdropFilter: palette.backdrop,
                 color: palette.textMain
               }}
             >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 950, color: palette.textMain, margin: 0 }}>{editingCategory ? 'Edit Plan' : 'New Standard'}</h2>
                  <button 
                    onClick={() => { setShowAddModal(false); setEditingCategory(null); }}
                    style={{ background: palette.bgBody, border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: palette.textMain }}
                  >
                    <X size={16} />
                  </button>
                </div>
                
                <form onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                   <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: palette.textMuted, marginBottom: '10px' }}>Category Name</label>
                      <input 
                        required type="text" placeholder="e.g. Deluxe Suite"
                        value={newCategory.name} onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                        style={{ width: '100%', padding: '16px 20px', borderRadius: '14px', border: `1px solid ${palette.borderColor}`, backgroundColor: palette.bgBody, color: palette.textMain, outline: 'none', fontWeight: 600 }}
                      />
                   </div>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: palette.textMuted, marginBottom: '10px' }}>Monthly Fee</label>
                        <input 
                          required type="text" placeholder="10,000"
                          value={newCategory.price} onChange={(e) => setNewCategory({...newCategory, price: e.target.value})}
                          style={{ width: '100%', padding: '16px 20px', borderRadius: '14px', border: `1px solid ${palette.borderColor}`, backgroundColor: palette.bgBody, color: palette.textMain, outline: 'none', fontWeight: 700 }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: palette.textMuted, marginBottom: '10px' }}>Capacity</label>
                        <input 
                          required type="number" placeholder="2"
                          value={newCategory.capacity} onChange={(e) => setNewCategory({...newCategory, capacity: e.target.value})}
                          style={{ width: '100%', padding: '16px 20px', borderRadius: '14px', border: `1px solid ${palette.borderColor}`, backgroundColor: palette.bgBody, color: palette.textMain, outline: 'none', fontWeight: 700 }}
                        />
                      </div>
                   </div>
                   <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: palette.textMuted, marginBottom: '10px' }}>Amenities (Comma Separated)</label>
                      <textarea 
                        required placeholder="AC, Wi-Fi, Personal Desk"
                        value={newCategory.amenities} onChange={(e) => setNewCategory({...newCategory, amenities: e.target.value})}
                        style={{ width: '100%', padding: '16px 20px', borderRadius: '14px', border: `1px solid ${palette.borderColor}`, backgroundColor: palette.bgBody, color: palette.textMain, outline: 'none', fontWeight: 600, minHeight: '100px' }}
                      />
                   </div>
                   <button type="submit" style={{ padding: '18px', backgroundColor: palette.primary, color: 'white', borderRadius: '16px', border: 'none', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', marginTop: '12px', boxShadow: `0 4px 12px ${palette.primaryLight}` }}>
                      {editingCategory ? 'Update Plan' : 'Launch Category'}
                   </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ 
              position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)', 
              backgroundColor: palette.textMain, color: palette.bgCard, padding: '16px 32px', borderRadius: '100px',
              display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              zIndex: 2000, fontWeight: 700, fontSize: '0.9rem'
            }}
          >
            <CheckCircle size={18} color="#10b981" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <RoomAppearanceModal 
        isOpen={showAppearanceModal} 
        onClose={() => setShowAppearanceModal(false)} 
        onChange={(updated) => setAppearance(updated)} 
      />
    </div>
  );
};

export default RoomCategories;
