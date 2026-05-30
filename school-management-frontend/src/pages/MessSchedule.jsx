import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, Utensils, Coffee, Pizza, Soup,
  Apple, Download, Edit2, Plus, ShieldCheck, Flame,
  CheckCircle, X, Zap, BarChart2, Sun, Moon
} from 'lucide-react';
import { useToast, ToastRenderer } from '../hooks/useToast';

// ─── Hook: reads dark-mode from localStorage + syncs with Topbar toggle ──────
const useDarkMode = () => {
  const [isDark, setIsDark] = React.useState(
    () => localStorage.getItem('theme') === 'dark' || document.documentElement.getAttribute('data-theme') === 'dark'
  );
  React.useEffect(() => {
    const sync = () => setIsDark(localStorage.getItem('theme') === 'dark' || document.documentElement.getAttribute('data-theme') === 'dark');
    window.addEventListener('storage', sync);
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => {
      window.removeEventListener('storage', sync);
      observer.disconnect();
    };
  }, []);
  return isDark;
};

// meal accent colours
const MEAL_COLORS = {
  'Breakfast':     { color: '#06b6d4', bg: 'rgba(6,182,212,0.12)',  border: 'rgba(6,182,212,0.25)' },
  'Lunch':         { color: '#6366f1', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.25)' },
  'Evening Snack': { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' },
  'Dinner':        { color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)' },
};

const MEAL_TIMES = {
  'Breakfast':     '07:30 – 09:30',
  'Lunch':         '12:30 – 14:30',
  'Evening Snack': '16:30 – 17:30',
  'Dinner':        '19:30 – 21:30',
};

const getMealIcon = (meal, size = 26) => {
  if (meal === 'Breakfast')     return <Coffee size={size} />;
  if (meal === 'Lunch')         return <Pizza size={size} />;
  if (meal === 'Evening Snack') return <Apple size={size} />;
  return <Soup size={size} />;
};

// ─── Component ────────────────────────────────────────────────────────────────
const MessSchedule = () => {
  const isDark = useDarkMode();

  const T = {
    bg:         'var(--bg-body)',
    bgCard:     'var(--bg-card)',
    bgRaised:   isDark ? 'rgba(0,0,0,0.15)'           : '#f1f5f9',
    border:     'var(--border-color)',
    borderSub:  'var(--border-color)',
    textMain:   isDark ? '#f1f5f9'                    : 'var(--text-main)',
    textSub:    isDark ? '#94a3b8'                    : '#64748b',
    textMuted:  isDark ? '#475569'                    : '#94a3b8',
    primary:    isDark ? '#6366f1'                    : 'var(--primary)',
    primaryGlow:isDark ? 'rgba(99,102,241,0.25)'      : 'rgba(69,179,224,0.15)',
    success:    '#10b981',
    warning:    '#f59e0b',
    danger:     '#ef4444',
    cyan:       '#06b6d4',
    pink:       '#ec4899',
    cardBg:     (color) => isDark ? `linear-gradient(135deg, var(--bg-card) 60%, ${color}08)` : `linear-gradient(135deg, #ffffff 60%, ${color}05)`,
    // inputs
    inputBg:    isDark ? 'rgba(255,255,255,0.04)'     : 'var(--bg-body)',
    inputBorder:isDark ? 'rgba(255,255,255,0.08)'     : 'var(--border-color)',
    hoverBg:    isDark ? 'rgba(255,255,255,0.07)'     : 'var(--primary-light)',
    // buttons
    ghostBg:    isDark ? 'rgba(99,102,241,0.09)'      : 'rgba(69,179,224,0.05)',
    ghostBgHov: isDark ? 'rgba(99,102,241,0.2)'       : 'rgba(69,179,224,0.14)',
    actionBg:   isDark ? 'rgba(255,255,255,0.03)'     : '#f8fafc',
    actionBgHov:isDark ? 'rgba(255,255,255,0.08)'     : '#f1f5f9',
    // overlay
    overlayBg:  isDark ? 'rgba(0,0,0,0.88)'           : 'rgba(15,23,42,0.6)',
    // shadow
    shadow:     isDark ? '0 4px 24px rgba(0,0,0,0.5)':'0 4px 20px rgba(0,0,0,0.08)',
    activeShadow:(color) => isDark ? `0 0 40px ${color}18, 0 4px 24px rgba(0,0,0,0.4)` : `0 4px 20px ${color}18`,
  };

  const glassCard = (extra = {}) => ({
    backgroundColor: T.bgCard,
    border: `1px solid ${T.border}`,
    borderRadius: '28px',
    backdropFilter: 'blur(20px)',
    transition: 'background-color 0.4s, border-color 0.4s',
    ...extra,
  });

  const inputStyle = {
    width: '100%',
    padding: '14px 18px',
    borderRadius: '14px',
    border: `1px solid ${T.inputBorder}`,
    backgroundColor: T.inputBg,
    color: T.textMain,
    fontSize: '0.95rem',
    fontWeight: 600,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'Inter, system-ui, sans-serif',
    transition: 'all 0.3s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 800,
    color: T.textSub,
    marginBottom: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    window.dispatchEvent(new Event('storage'));
  };

  const days  = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const meals = ['Breakfast','Lunch','Evening Snack','Dinner'];
  const { toast, showToast, hideToast } = useToast();

  const [schedule, setSchedule] = useState({
    Monday:    { Breakfast:{items:'Pancakes, Syrup, Fruit',cal:'400'}, Lunch:{items:'Chicken Curry, Rice, Salad',cal:'750'}, 'Evening Snack':{items:'Tea & Biscuits',cal:'200'}, Dinner:{items:'Veg Stir Fry, Tofu',cal:'600'} },
    Tuesday:   { Breakfast:{items:'Eggs, Toast, Juice',cal:'450'}, Lunch:{items:'Beef Tacos, Beans',cal:'800'}, 'Evening Snack':{items:'Yogurt, Granola',cal:'250'}, Dinner:{items:'Pasta Marinara, Bread',cal:'700'} },
    Wednesday: { Breakfast:{items:'Oatmeal, Berries',cal:'350'}, Lunch:{items:'Turkey Sandwich, Soup',cal:'650'}, 'Evening Snack':{items:'Apple & Peanut Butter',cal:'220'}, Dinner:{items:'Grilled Salmon, Asparagus',cal:'680'} },
    Thursday:  { Breakfast:{items:'French Toast, Berries',cal:'500'}, Lunch:{items:'Veggie Burger, Fries',cal:'850'}, 'Evening Snack':{items:'Smoothie',cal:'280'}, Dinner:{items:'Roast Chicken, Potatoes',cal:'720'} },
    Friday:    { Breakfast:{items:'Cereal, Banana',cal:'300'}, Lunch:{items:'Fish & Chips',cal:'900'}, 'Evening Snack':{items:'Muffin',cal:'320'}, Dinner:{items:'Pizza Night!',cal:'850'} },
    Saturday:  { Breakfast:{items:'Waffles, Bacon',cal:'600'}, Lunch:{items:'Club Sandwich',cal:'700'}, 'Evening Snack':{items:'Mixed Nuts',cal:'180'}, Dinner:{items:'Steak & Salad',cal:'800'} },
    Sunday:    { Breakfast:{items:'Special Omelet',cal:'550'}, Lunch:{items:'Roast Lamb, Peas',cal:'950'}, 'Evening Snack':{items:'Cake Slice',cal:'350'}, Dinner:{items:'Light Soup & Toast',cal:'400'} },
  });

  const [activeDay,        setActiveDay]        = useState('Monday');
  const [isExporting,      setIsExporting]      = useState(false);
  const [showEditModal,    setShowEditModal]    = useState(false);
  const [editingMeal,      setEditingMeal]      = useState(null);
  const [tempEditData,     setTempEditData]     = useState({ items:'', cal:'' });
  const [showAddCycleModal,setShowAddCycleModal]= useState(false);
  const [showNutrientModal,setShowNutrientModal]= useState(false);
  const [nutritionalTargets, setNutritionalTargets] = useState({
    dailyCalorieCap:'2500', proteinTarget:'80g', fiberTarget:'30g', sugarLimit:'50g'
  });

  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => { setIsExporting(false); showToast('Weekly Nutritional Roadmap exported as PDF!','success','Export Complete'); }, 2000);
  };

  const handleUpdateMeal = (e) => {
    e.preventDefault();
    setSchedule({ ...schedule, [activeDay]: { ...schedule[activeDay], [editingMeal]: tempEditData } });
    setShowEditModal(false);
    showToast(`${editingMeal} for ${activeDay} updated successfully!`, 'success', 'Menu Updated');
  };

  const openEditModal = (meal) => {
    setEditingMeal(meal);
    setTempEditData(schedule[activeDay][meal]);
    setShowEditModal(true);
  };

  const handleUpdateNutrients = (e) => {
    e.preventDefault();
    showToast('Institutional nutritional targets updated.','success','Targets Updated');
    setShowNutrientModal(false);
  };

  const handleAddCycle = (e) => {
    e.preventDefault();
    showToast('New institutional meal cycle deployed!','success','Cycle Created');
    setShowAddCycleModal(false);
  };

  const totalCal = Object.values(schedule[activeDay]).reduce((a,c) => a + parseInt(c.cal), 0);
  const dayIndex = days.indexOf(activeDay);

  return (
    <>
    <div style={{ padding: '40px 44px', backgroundColor: T.bg, minHeight: '100vh', color: T.textMain, fontFamily: 'Inter, system-ui, sans-serif', transition: 'background-color 0.4s, color 0.4s' }}>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
        style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'44px', flexWrap:'wrap', gap:'20px' }}
      >
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'10px' }}>
            <div style={{ width:'48px', height:'48px', borderRadius:'16px', background:`linear-gradient(135deg, ${T.primary}, #818cf8)`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 8px 24px ${T.primaryGlow}` }}>
              <Calendar size={22} color="white" />
            </div>
            <h1 style={{ fontSize:'2.4rem', fontWeight:950, color:T.textMain, letterSpacing:'-1.5px', margin:0 }}>
              Weekly Mess Schedule
            </h1>
          </div>
          <p style={{ color:T.textSub, fontSize:'1rem', fontWeight:500, margin:0 }}>
            Comprehensive nutritional planning and meal cycle management.
          </p>
        </div>

        <div style={{ display:'flex', gap:'14px' }}>
          <button
            onClick={handleExportPDF} disabled={isExporting}
            style={{ padding:'14px 22px', borderRadius:'16px', border:`1px solid ${T.border}`, backgroundColor:'rgba(99,102,241,0.08)', color: isExporting ? T.textMuted : T.textMain, fontWeight:800, fontSize:'0.9rem', cursor: isExporting?'not-allowed':'pointer', display:'flex', alignItems:'center', gap:'8px', transition:'all 0.2s', height:'48px' }}
            onMouseEnter={e => { if(!isExporting){ e.currentTarget.style.backgroundColor='rgba(99,102,241,0.18)'; e.currentTarget.style.borderColor=T.primary; }}}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor='rgba(99,102,241,0.08)'; e.currentTarget.style.borderColor=T.border; }}
          >
            <Download size={17} /> {isExporting ? 'Compiling…' : 'Export PDF'}
          </button>
          <button
            onClick={() => setShowAddCycleModal(true)}
            style={{ padding:'14px 26px', borderRadius:'16px', border:'none', background:`linear-gradient(135deg, ${T.primary}, #818cf8)`, color:'white', fontWeight:800, fontSize:'0.9rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'8px', boxShadow:`0 8px 24px ${T.primaryGlow}`, transition:'all 0.2s', height:'48px' }}
            onMouseEnter={e => { e.currentTarget.style.filter='brightness(1.15)'; e.currentTarget.style.transform='translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.filter='brightness(1)'; e.currentTarget.style.transform='translateY(0)'; }}
          >
            <Plus size={17} /> Add Cycle
          </button>
        </div>
      </motion.div>

      {/* ── Day Tabs ─────────────────────────────────────────────────────────── */}
      <div style={{ display:'flex', gap:'10px', marginBottom:'40px', overflowX:'auto', paddingBottom:'6px' }}>
        {days.map((day, i) => {
          const active = activeDay === day;
          const isToday = i === new Date().getDay() - 1; // Mon=0
          return (
            <motion.button
              key={day}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveDay(day)}
              style={{
                padding:'13px 26px', borderRadius:'18px',
                border: active ? 'none' : `1px solid ${T.borderSub}`,
                background: active ? `linear-gradient(135deg, ${T.primary}, #818cf8)` : 'rgba(255,255,255,0.03)',
                color: active ? 'white' : isToday ? T.primary : T.textSub,
                fontWeight:800, fontSize:'0.9rem', cursor:'pointer',
                boxShadow: active ? `0 8px 24px ${T.primaryGlow}` : 'none',
                transition:'all 0.25s', minWidth:'130px', flexShrink:0,
                position:'relative', outline:'none'
              }}
            >
              {day}
              {isToday && !active && (
                <span style={{ position:'absolute', top:'6px', right:'8px', width:'6px', height:'6px', borderRadius:'50%', backgroundColor:T.primary, boxShadow:`0 0 6px ${T.primary}` }} />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* ── Meal Cards Grid ──────────────────────────────────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'24px', marginBottom:'36px' }}>
        {meals.map((meal, i) => {
          const mc = MEAL_COLORS[meal];
          const data = schedule[activeDay][meal];
          return (
            <motion.div
              key={meal}
              initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.1 }}
              style={{
                ...glassCard({ padding:'28px', position:'relative', overflow:'hidden' }),
                borderLeft:`4px solid ${mc.color}`,
                boxShadow: T.activeShadow(mc.color)
              }}
            >
              {/* background radial glow */}
              <div style={{ position:'absolute', top:'-40px', left:'40px', width:'140px', height:'140px', borderRadius:'50%', backgroundColor:mc.color, opacity:0.05, filter:'blur(40px)', pointerEvents:'none' }} />

              {/* Card header */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'22px', position:'relative', zIndex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
                  <div style={{ width:'52px', height:'52px', borderRadius:'16px', backgroundColor:mc.bg, color:mc.color, display:'flex', alignItems:'center', justifyContent:'center', border:`1px solid ${mc.border}` }}>
                    {getMealIcon(meal)}
                  </div>
                  <div>
                    <h3 style={{ fontSize:'1.25rem', fontWeight:900, color:T.textMain, margin:0 }}>{meal}</h3>
                    <div style={{ display:'flex', alignItems:'center', gap:'5px', color:T.textSub, fontSize:'0.8rem', fontWeight:700, marginTop:'4px' }}>
                      <Clock size={12} /> {MEAL_TIMES[meal]}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => openEditModal(meal)}
                  style={{ width:'38px', height:'38px', borderRadius:'12px', border:`1px solid ${T.borderSub}`, backgroundColor:T.actionBg, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 0.2s', flexShrink:0 }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor=mc.bg; e.currentTarget.style.borderColor=mc.border; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor=T.actionBg; e.currentTarget.style.borderColor=T.borderSub; }}
                >
                  <Edit2 size={16} color={mc.color} />
                </button>
              </div>

              {/* Items box */}
              <div style={{ padding:'16px 20px', backgroundColor:T.actionBg, borderRadius:'16px', marginBottom:'20px', border:`1px solid ${T.borderSub}`, position:'relative', zIndex:1 }}>
                <div style={{ fontSize:'0.65rem', fontWeight:900, color:T.textSub, textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:'6px' }}>Scheduled Items</div>
                <div style={{ fontSize:'1rem', fontWeight:700, color:T.textMain, lineHeight:1.5 }}>{data.items}</div>
              </div>

              {/* Footer */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', position:'relative', zIndex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'7px' }}>
                  <ShieldCheck size={15} color={T.success} />
                  <span style={{ fontSize:'0.8rem', fontWeight:700, color:T.textSub }}>Nutritionally Balanced</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'5px', padding:'6px 14px', borderRadius:'10px', backgroundColor:mc.bg, color:mc.color, fontSize:'0.875rem', fontWeight:900, border:`1px solid ${mc.border}` }}>
                  <Flame size={13} /> {data.cal} kcal
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Daily Calorie Summary Banner ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.45 }}
        style={{ padding:'28px 36px', borderRadius:'28px', position:'relative', overflow:'hidden', background: isDark ? 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 50%, #064e3b 100%)' : 'linear-gradient(135deg, #eef2ff 0%, #f0fdf4 100%)', border:`1px solid ${isDark ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.15)'}` }}
      >
        {/* decorative glows */}
        <div style={{ position:'absolute', top:'-50px', right:'-50px', width:'180px', height:'180px', borderRadius:'50%', background:'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-40px', left:'80px', width:'130px', height:'130px', borderRadius:'50%', background:'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)', pointerEvents:'none' }} />

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'24px', position:'relative', zIndex:1 }}>
          {/* Left: stats */}
          <div style={{ display:'flex', alignItems:'center', gap:'40px', flexWrap:'wrap' }}>
            <div>
              <div style={{ fontSize:'0.7rem', fontWeight:800, color:T.textSub, textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:'6px' }}>Total Daily Calories</div>
              <div style={{ display:'flex', alignItems:'baseline', gap:'8px' }}>
                <span style={{ fontSize:'2.4rem', fontWeight:950, color:T.textMain, letterSpacing:'-1px' }}>{totalCal}</span>
                <span style={{ fontSize:'1rem', fontWeight:700, color:T.textSub }}>kcal</span>
              </div>
            </div>
            <div style={{ height:'48px', width:'1px', backgroundColor:T.borderSub }} />
            <div>
              <div style={{ fontSize:'0.7rem', fontWeight:800, color:T.textSub, textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:'6px' }}>Meal Balance</div>
              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                <Zap size={18} color={isDark ? '#a5b4fc' : T.primary} />
                <span style={{ fontSize:'1.1rem', fontWeight:800, color:isDark ? '#a5b4fc' : T.primary }}>Optimized for Energy</span>
              </div>
            </div>
            <div style={{ height:'48px', width:'1px', backgroundColor:T.borderSub }} />
            <div>
              <div style={{ fontSize:'0.7rem', fontWeight:800, color:T.textSub, textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:'6px' }}>Compliance</div>
              <div style={{ display:'flex', alignItems:'center', gap:'7px' }}>
                <CheckCircle size={17} color={T.success} />
                <span style={{ fontSize:'1.1rem', fontWeight:800, color:T.success }}>High — 98%</span>
              </div>
            </div>
          </div>

          {/* Right: action buttons */}
          <div style={{ display:'flex', gap:'12px', flexShrink:0 }}>
            <button
              onClick={() => setShowNutrientModal(true)}
              style={{ padding:'13px 22px', borderRadius:'14px', border:`1px solid ${T.border}`, backgroundColor:T.ghostBg, color:T.textMain, fontWeight:800, fontSize:'0.875rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'7px', transition:'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor=T.ghostBgHov}
              onMouseLeave={e => e.currentTarget.style.backgroundColor=T.ghostBg}
            >
              <BarChart2 size={16} /> Manage Nutrients
            </button>
            <button
              onClick={() => window.print()}
              style={{ padding:'13px 22px', borderRadius:'14px', border:'none', backgroundColor:isDark ? 'white' : T.primary, color:isDark ? '#0f172a' : 'white', fontWeight:900, fontSize:'0.875rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'7px', transition:'all 0.2s', boxShadow:isDark ? 'none' : `0 8px 24px ${T.primaryGlow}` }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; }}
            >
              <Utensils size={16} /> Print Cycle
            </button>
          </div>
        </div>
      </motion.div>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* Edit Meal Modal */}
      <AnimatePresence>
        {showEditModal && editingMeal && (
          <div style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={() => setShowEditModal(false)}
              style={{ position:'absolute', inset:0, backgroundColor:T.overlayBg, backdropFilter:'blur(18px)' }} />
            <motion.div
              initial={{ scale:0.9, opacity:0, y:20 }} animate={{ scale:1, opacity:1, y:0 }} exit={{ scale:0.9, opacity:0 }}
              style={{ position:'relative', width:'100%', maxWidth:'480px', ...glassCard({ padding:'44px' }), boxShadow:`0 40px 100px rgba(0,0,0,${isDark?0.75:0.15}), 0 0 80px ${T.primaryGlow}` }}
            >
              <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'30px' }}>
                <div style={{ width:'50px', height:'50px', borderRadius:'15px', backgroundColor: MEAL_COLORS[editingMeal]?.bg, color: MEAL_COLORS[editingMeal]?.color, display:'flex', alignItems:'center', justifyContent:'center', border:`1px solid ${MEAL_COLORS[editingMeal]?.border}` }}>
                  {getMealIcon(editingMeal, 24)}
                </div>
                <div>
                  <h2 style={{ fontSize:'1.4rem', fontWeight:950, color:T.textMain, margin:0 }}>Edit {editingMeal}</h2>
                  <p style={{ color:T.textSub, fontSize:'0.8rem', margin:'4px 0 0', fontWeight:600 }}>{activeDay} · {MEAL_TIMES[editingMeal]}</p>
                </div>
              </div>
              <form onSubmit={handleUpdateMeal} style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
                <div>
                  <label style={labelStyle}>Menu Items</label>
                  <textarea
                    required value={tempEditData.items}
                    onChange={e => setTempEditData({ ...tempEditData, items: e.target.value })}
                    rows={3}
                    style={{ ...inputStyle, resize:'none' }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Calories (kcal)</label>
                  <input
                    required type="number" value={tempEditData.cal}
                    onChange={e => setTempEditData({ ...tempEditData, cal: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginTop:'8px' }}>
                  <button type="button" onClick={() => setShowEditModal(false)}
                    style={{ padding:'14px', borderRadius:'14px', border:`1px solid ${T.borderSub}`, backgroundColor:T.actionBg, color:T.textSub, fontWeight:800, cursor:'pointer', fontSize:'0.9rem' }}>
                    Cancel
                  </button>
                  <button type="submit"
                    style={{ padding:'14px', borderRadius:'14px', border:'none', background:`linear-gradient(135deg, ${T.primary}, #818cf8)`, color:'white', fontWeight:900, cursor:'pointer', fontSize:'0.9rem', boxShadow:`0 8px 24px ${T.primaryGlow}` }}>
                    Update Schedule
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Cycle Modal */}
      <AnimatePresence>
        {showAddCycleModal && (
          <div style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={() => setShowAddCycleModal(false)}
              style={{ position:'absolute', inset:0, backgroundColor:T.overlayBg, backdropFilter:'blur(18px)' }} />
            <motion.div
              initial={{ scale:0.9, opacity:0, y:20 }} animate={{ scale:1, opacity:1, y:0 }} exit={{ scale:0.9, opacity:0 }}
              style={{ position:'relative', width:'100%', maxWidth:'500px', ...glassCard({ padding:'48px' }), boxShadow:`0 40px 100px rgba(0,0,0,${isDark?0.75:0.15}), 0 0 80px ${T.primaryGlow}` }}
            >
              <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'32px' }}>
                <div style={{ width:'48px', height:'48px', borderRadius:'15px', background:`linear-gradient(135deg, ${T.primary}, #818cf8)`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 8px 24px ${T.primaryGlow}` }}>
                  <Plus size={22} color="white" />
                </div>
                <div>
                  <h2 style={{ fontSize:'1.4rem', fontWeight:950, color:T.textMain, margin:0 }}>New Institutional Cycle</h2>
                  <p style={{ color:T.textSub, fontSize:'0.8rem', margin:'4px 0 0', fontWeight:600 }}>Deploy a new meal rotation cycle</p>
                </div>
              </div>
              <form onSubmit={handleAddCycle} style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
                <div>
                  <label style={labelStyle}>Cycle Name</label>
                  <input required type="text" placeholder="e.g. Standard Academic Cycle A" style={inputStyle} />
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
                  <div>
                    <label style={labelStyle}>Effective From</label>
                    <input required type="date" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Effective To</label>
                    <input required type="date" style={inputStyle} />
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginTop:'8px' }}>
                  <button type="button" onClick={() => setShowAddCycleModal(false)}
                    style={{ padding:'14px', borderRadius:'14px', border:`1px solid ${T.borderSub}`, backgroundColor:T.actionBg, color:T.textSub, fontWeight:800, cursor:'pointer', fontSize:'0.9rem' }}>
                    Cancel
                  </button>
                  <button type="submit"
                    style={{ padding:'14px', borderRadius:'14px', border:'none', background:`linear-gradient(135deg, ${T.primary}, #818cf8)`, color:'white', fontWeight:900, cursor:'pointer', fontSize:'0.9rem', boxShadow:`0 8px 24px ${T.primaryGlow}` }}>
                    Deploy Cycle
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Nutritional Governance Modal */}
      <AnimatePresence>
        {showNutrientModal && (
          <div style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={() => setShowNutrientModal(false)}
              style={{ position:'absolute', inset:0, backgroundColor:T.overlayBg, backdropFilter:'blur(18px)' }} />
            <motion.div
              initial={{ scale:0.9, opacity:0, y:20 }} animate={{ scale:1, opacity:1, y:0 }} exit={{ scale:0.9, opacity:0 }}
              style={{ position:'relative', width:'100%', maxWidth:'500px', ...glassCard({ padding:'48px' }), boxShadow:`0 40px 100px rgba(0,0,0,${isDark?0.75:0.15}), 0 0 80px ${T.primaryGlow}` }}
            >
              <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'10px' }}>
                <div style={{ width:'48px', height:'48px', borderRadius:'15px', backgroundColor:`${T.success}18`, color:T.success, display:'flex', alignItems:'center', justifyContent:'center', border:`1px solid ${T.success}30` }}>
                  <BarChart2 size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize:'1.4rem', fontWeight:950, color:T.textMain, margin:0 }}>Nutritional Governance</h2>
                  <p style={{ color:T.textSub, fontSize:'0.8rem', margin:'4px 0 0', fontWeight:600 }}>Set global dining benchmarks</p>
                </div>
              </div>
              <p style={{ color:T.textSub, fontSize:'0.875rem', marginBottom:'30px', fontWeight:500, lineHeight:1.6 }}>
                Configure institutional nutritional targets that govern the entire dining roadmap.
              </p>
              <form onSubmit={handleUpdateNutrients} style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
                  <div>
                    <label style={labelStyle}>Daily Calorie Cap</label>
                    <input required type="number" value={nutritionalTargets.dailyCalorieCap}
                      onChange={e => setNutritionalTargets({ ...nutritionalTargets, dailyCalorieCap: e.target.value })}
                      style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Protein Target</label>
                    <input required type="text" value={nutritionalTargets.proteinTarget}
                      onChange={e => setNutritionalTargets({ ...nutritionalTargets, proteinTarget: e.target.value })}
                      style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Fiber Target</label>
                    <input required type="text" value={nutritionalTargets.fiberTarget}
                      onChange={e => setNutritionalTargets({ ...nutritionalTargets, fiberTarget: e.target.value })}
                      style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Sugar Limit</label>
                    <input required type="text" value={nutritionalTargets.sugarLimit}
                      onChange={e => setNutritionalTargets({ ...nutritionalTargets, sugarLimit: e.target.value })}
                      style={inputStyle} />
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginTop:'8px' }}>
                  <button type="button" onClick={() => setShowNutrientModal(false)}
                    style={{ padding:'14px', borderRadius:'14px', border:`1px solid ${T.borderSub}`, backgroundColor:T.actionBg, color:T.textSub, fontWeight:800, cursor:'pointer', fontSize:'0.9rem' }}>
                    Cancel
                  </button>
                  <button type="submit"
                    style={{ padding:'14px', borderRadius:'14px', border:'none', background:`linear-gradient(135deg, ${T.success}, #059669)`, color:'white', fontWeight:900, cursor:'pointer', fontSize:'0.9rem', boxShadow:`0 8px 24px rgba(16,185,129,0.3)` }}>
                    Calibrate Benchmarks
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
    <ToastRenderer toast={toast} onClose={hideToast} />
    </>
  );
};

export default MessSchedule;
