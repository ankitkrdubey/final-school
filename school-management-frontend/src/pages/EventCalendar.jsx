import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Filter, Download, X, Clock, MapPin, Tag, Users, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Helpers ────────────────────────────────────────────────────────────────
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const CATEGORIES = ['All','Academic','Sports','Co-Curricular','Social','Administrative','Examination'];
const CATEGORY_COLORS = {
  Academic: '#4880FF', Sports: '#10b981', 'Co-Curricular': '#8B5CF6',
  Social: '#F59E0B', Administrative: '#EF4444', Examination: '#EC4899', General: '#f59e0b'
};

const getColor = (cat) => CATEGORY_COLORS[cat] || '#4880FF';

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

const seedEvents = () => [
  { id: 1, title: 'Annual Sports Day', date: '2026-05-25', time: '09:00 AM', location: 'Main Stadium', category: 'Sports', attendees: 'All Students' },
  { id: 2, title: 'Staff Meeting', date: '2026-05-15', time: '10:00 AM', location: 'Board Room', category: 'Administrative', attendees: 'All Staff' },
  { id: 3, title: 'PTM Q1', date: '2026-05-06', time: '10:00 AM', location: 'Classrooms', category: 'General', attendees: 'Parents & Teachers' },
  { id: 4, title: 'Science Symposium', date: '2026-06-05', time: '11:00 AM', location: 'Grand Auditorium', category: 'Academic', attendees: 'Researchers' },
  { id: 5, title: 'Debate Finals', date: '2026-06-22', time: '11:00 AM', location: 'Debate Hall', category: 'Co-Curricular', attendees: 'Debate Team' },
];

const loadEvents = () => {
  try {
    const stored = localStorage.getItem('calendar_events');
    if (stored) return JSON.parse(stored);
    const seeded = seedEvents();
    localStorage.setItem('calendar_events', JSON.stringify(seeded));
    return seeded;
  } catch { return seedEvents(); }
};

// ─── Component ───────────────────────────────────────────────────────────────
const EventCalendar = () => {
  const now = new Date();
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(4); // 0-indexed → May
  const [view, setView] = useState('Month');
  const [filterCat, setFilterCat] = useState('All');
  const [showFilter, setShowFilter] = useState(false);
  const [events, setEvents] = useState(loadEvents);
  const [selectedDay, setSelectedDay] = useState(null);

  // New Event modal
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', time: '09:00 AM', location: '', category: 'Academic', attendees: '' });

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
  };

  // Events for a specific day
  const eventsForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    return events.filter(e => e.date === dateStr && (filterCat === 'All' || e.category === filterCat));
  };

  const handleSaveEvent = () => {
    if (!form.title.trim() || !form.date) {
      showToast('Title and Date are required.', 'error'); return;
    }
    setSaving(true);
    setTimeout(() => {
      const newEv = { ...form, id: Date.now() };
      const updated = [...events, newEv];
      setEvents(updated);
      localStorage.setItem('calendar_events', JSON.stringify(updated));
      setSaving(false);
      setSaved(true);
      showToast(`"${form.title}" added to calendar!`);
      setTimeout(() => {
        setSaved(false);
        setShowModal(false);
        setForm({ title: '', date: '', time: '09:00 AM', location: '', category: 'Academic', attendees: '' });
      }, 1200);
    }, 1000);
  };

  const handleExportPDF = () => {
    const filtered = events.filter(e => filterCat === 'All' || e.category === filterCat);
    const rows = filtered.map(e =>
      `<tr><td style="padding:8px;border:1px solid #ddd">${e.title}</td><td style="padding:8px;border:1px solid #ddd">${e.date}</td><td style="padding:8px;border:1px solid #ddd">${e.time}</td><td style="padding:8px;border:1px solid #ddd">${e.category}</td><td style="padding:8px;border:1px solid #ddd">${e.location || '-'}</td></tr>`
    ).join('');
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Event Calendar – ${MONTHS[month]} ${year}</title>
      <style>body{font-family:Arial,sans-serif;padding:40px}table{width:100%;border-collapse:collapse}th{background:#4880FF;color:white;padding:10px;text-align:left}@media print{button{display:none}}</style></head>
      <body>
        <h2 style="color:#4880FF">EduPro — Event Calendar</h2>
        <h3>${MONTHS[month]} ${year}${filterCat !== 'All' ? ' · '+filterCat : ''}</h3>
        <table><thead><tr><th>Title</th><th>Date</th><th>Time</th><th>Category</th><th>Location</th></tr></thead>
        <tbody>${rows}</tbody></table>
        <button onclick="window.print()" style="margin-top:24px;padding:10px 28px;background:#4880FF;color:white;border:none;border-radius:8px;cursor:pointer;font-size:1rem">🖨 Print / Save as PDF</button>
      </body></html>`);
    win.document.close();
    showToast('PDF preview opened in new tab!');
  };

  // Week view: current week days
  const getWeekDays = () => {
    const today = selectedDay ? new Date(year, month, selectedDay) : new Date(year, month, 1);
    const dow = today.getDay();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - dow + i);
      return d;
    });
  };

  const HOURS = Array.from({ length: 10 }, (_, i) => `${String(i + 8).padStart(2,'0')}:00`);

  return (
    <div style={{ padding: '20px', height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
            style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, padding: '14px 24px', borderRadius: '14px',
              background: toast.type === 'error' ? '#ef4444' : 'var(--primary)', color: 'white', fontWeight: 800, fontSize: '0.9rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} /> {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '6px' }}>Institutional Event Calendar</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Monthly view of all campus activities, administrative deadlines, and student events.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn" onClick={handleExportPDF}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', fontWeight: 700 }}>
            <Download size={18} /> Export PDF
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', fontWeight: 800 }}>
            <Plus size={20} /> New Event
          </button>
        </div>
      </div>

      {/* Calendar Card */}
      <div className="card" style={{ flex: 1, padding: 0, display: 'flex', flexDirection: 'column', border: '1px solid var(--border-color)', overflow: 'hidden', minHeight: 0 }}>

        {/* Calendar toolbar */}
        <div style={{ padding: '16px 28px', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 950, margin: 0 }}>{MONTHS[month]} {year}</h2>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={prevMonth} className="btn-icon" style={{ width: '36px', height: '36px', backgroundColor: 'var(--bg-body)' }}>
                <ChevronLeft size={18} />
              </button>
              <button onClick={nextMonth} className="btn-icon" style={{ width: '36px', height: '36px', backgroundColor: 'var(--bg-body)' }}>
                <ChevronRight size={18} />
              </button>
            </div>
            <button onClick={() => { setMonth(now.getMonth()); setYear(now.getFullYear()); }}
              style={{ fontSize: '0.75rem', fontWeight: 900, padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'none', cursor: 'pointer', color: 'var(--primary)' }}>
              Today
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* View switcher */}
            <div style={{ display: 'flex', backgroundColor: 'var(--bg-body)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              {['Month', 'Week', 'Day'].map(v => (
                <button key={v} onClick={() => setView(v)}
                  style={{ padding: '7px 18px', borderRadius: '7px', border: 'none',
                    backgroundColor: view === v ? 'var(--primary)' : 'transparent',
                    color: view === v ? 'white' : 'var(--text-muted)',
                    fontWeight: 800, cursor: 'pointer', fontSize: '0.82rem', transition: '0.2s' }}>
                  {v}
                </button>
              ))}
            </div>
            {/* Filter */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowFilter(f => !f)} className="btn-icon"
                style={{ width: '40px', height: '40px', backgroundColor: showFilter ? 'var(--primary)' : 'var(--bg-body)', color: showFilter ? 'white' : 'inherit' }}>
                <Filter size={18} />
              </button>
              <AnimatePresence>
                {showFilter && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    style={{ position: 'absolute', right: 0, top: '48px', zIndex: 100, backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px', boxShadow: 'var(--shadow-lg)', minWidth: '200px' }}>
                    <p style={{ margin: '0 0 12px', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Filter by Category</p>
                    {CATEGORIES.map(cat => (
                      <button key={cat} onClick={() => { setFilterCat(cat); setShowFilter(false); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '9px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 700, fontSize: '0.88rem', transition: '0.15s',
                          backgroundColor: filterCat === cat ? 'var(--primary-light)' : 'transparent',
                          color: filterCat === cat ? 'var(--primary)' : 'var(--text-main)' }}>
                        {cat !== 'All' && <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: getColor(cat), flexShrink: 0 }} />}
                        {cat}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Active filter badge */}
        {filterCat !== 'All' && (
          <div style={{ padding: '8px 28px', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)' }}>
            <Tag size={14} /> Showing: {filterCat}
            <button onClick={() => setFilterCat('All')} style={{ marginLeft: '4px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* ── MONTH VIEW ───────────────────────────────────────── */}
        {view === 'Month' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', backgroundColor: 'var(--border-color)', gap: '1px' }}>
              {DAYS_SHORT.map(d => (
                <div key={d} style={{ backgroundColor: 'var(--bg-card)', padding: '12px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{d}</div>
              ))}
            </div>
            {/* Grid */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: 'minmax(110px, 1fr)', backgroundColor: 'var(--border-color)', gap: '1px' }}>
              {/* Blank leading cells */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`bl-${i}`} style={{ backgroundColor: 'var(--bg-body)', opacity: 0.4 }} />
              ))}
              {/* Day cells */}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const dayEvents = eventsForDay(day);
                const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
                const isSelected = day === selectedDay;
                return (
                  <div key={day} onClick={() => setSelectedDay(day === selectedDay ? null : day)}
                    style={{ backgroundColor: 'var(--bg-card)', padding: '10px 12px', cursor: 'pointer', transition: '0.15s', position: 'relative',
                      outline: isSelected ? '2px solid var(--primary)' : 'none', outlineOffset: '-2px' }}>
                    <span style={{ display: 'inline-flex', width: '28px', height: '28px', borderRadius: '50%', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.88rem', fontWeight: 900,
                      backgroundColor: isToday ? 'var(--primary)' : 'transparent',
                      color: isToday ? 'white' : 'var(--text-main)' }}>{day}</span>
                    <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {dayEvents.slice(0, 2).map(ev => (
                        <motion.div key={ev.id} whileHover={{ scale: 1.02 }}
                          style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800,
                            backgroundColor: `${getColor(ev.category)}18`, color: getColor(ev.category),
                            borderLeft: `3px solid ${getColor(ev.category)}`, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                          {ev.title}
                        </motion.div>
                      ))}
                      {dayEvents.length > 2 && (
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', paddingLeft: '4px' }}>+{dayEvents.length - 2} more</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── WEEK VIEW ────────────────────────────────────────── */}
        {view === 'Week' && (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {(() => {
              const weekDays = getWeekDays();
              return (
                <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', backgroundColor: 'var(--border-color)', gap: '1px' }}>
                  {/* Header row */}
                  <div style={{ backgroundColor: 'var(--bg-body)' }} />
                  {weekDays.map((d, i) => {
                    const isToday = d.toDateString() === new Date().toDateString();
                    return (
                      <div key={i} style={{ backgroundColor: 'var(--bg-card)', padding: '12px', textAlign: 'center', fontWeight: 900 }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{DAYS_SHORT[d.getDay()]}</div>
                        <div style={{ display: 'inline-flex', width: '32px', height: '32px', borderRadius: '50%', alignItems: 'center', justifyContent: 'center', margin: '4px auto 0',
                          backgroundColor: isToday ? 'var(--primary)' : 'transparent', color: isToday ? 'white' : 'var(--text-main)', fontSize: '1rem' }}>{d.getDate()}</div>
                      </div>
                    );
                  })}
                  {/* Time slots */}
                  {HOURS.map(hour => (
                    <React.Fragment key={hour}>
                      <div style={{ backgroundColor: 'var(--bg-body)', padding: '8px 6px', textAlign: 'right', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>{hour}</div>
                      {weekDays.map((d, di) => {
                        const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
                        const slotEvents = events.filter(e => e.date === dateStr && e.time?.startsWith(hour.replace(':00','')) && (filterCat === 'All' || e.category === filterCat));
                        return (
                          <div key={di} style={{ backgroundColor: 'var(--bg-card)', minHeight: '60px', padding: '4px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            {slotEvents.map(ev => (
                              <div key={ev.id} style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800,
                                backgroundColor: `${getColor(ev.category)}20`, color: getColor(ev.category),
                                borderLeft: `3px solid ${getColor(ev.category)}` }}>{ev.title}</div>
                            ))}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* ── DAY VIEW ─────────────────────────────────────────── */}
        {view === 'Day' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
            {(() => {
              const focusDay = selectedDay || now.getDate();
              const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(focusDay).padStart(2,'0')}`;
              const dayEventsAll = events.filter(e => e.date === dateStr && (filterCat === 'All' || e.category === filterCat));
              return (
                <div>
                  <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--primary)' }}>{focusDay}</span>
                    <div>
                      <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>{MONTHS[month]} {year}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>{dayEventsAll.length} event{dayEventsAll.length !== 1 ? 's' : ''} scheduled</div>
                    </div>
                  </div>
                  {HOURS.map(hour => {
                    const slotEvents = dayEventsAll.filter(e => e.time?.startsWith(hour.replace(':00','')));
                    return (
                      <div key={hour} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', borderBottom: '1px solid var(--border-color)' }}>
                        <div style={{ padding: '16px 12px', textAlign: 'right', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', backgroundColor: 'var(--bg-body)' }}>{hour}</div>
                        <div style={{ padding: '8px 16px', minHeight: '64px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {slotEvents.map(ev => (
                            <motion.div key={ev.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                              style={{ padding: '10px 16px', borderRadius: '10px', backgroundColor: `${getColor(ev.category)}15`,
                                color: getColor(ev.category), borderLeft: `4px solid ${getColor(ev.category)}`, fontWeight: 800 }}>
                              <div style={{ fontSize: '0.9rem' }}>{ev.title}</div>
                              {ev.location && <div style={{ fontSize: '0.75rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}><MapPin size={11} />{ev.location}</div>}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* ── NEW EVENT MODAL ──────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => !saving && setShowModal(false)}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 30 }}
              onClick={e => e.stopPropagation()}
              style={{ backgroundColor: 'var(--bg-card)', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '560px', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 950 }}>Add New Event</h2>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Schedule a campus event on the institutional calendar</p>
                </div>
                <button onClick={() => setShowModal(false)} className="btn-icon" style={{ backgroundColor: 'var(--bg-body)' }}><X size={20} /></button>
              </div>

              {saved ? (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  style={{ textAlign: 'center', padding: '32px 0' }}>
                  <CheckCircle2 size={56} color="var(--success)" style={{ marginBottom: '16px' }} />
                  <p style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--success)' }}>Event Added!</p>
                </motion.div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {[
                    { label: 'Event Title', key: 'title', type: 'text', placeholder: 'e.g. Annual Sports Day' },
                    { label: 'Date', key: 'date', type: 'date', placeholder: '' },
                    { label: 'Time', key: 'time', type: 'text', placeholder: 'e.g. 09:00 AM' },
                    { label: 'Location', key: 'location', type: 'text', placeholder: 'e.g. Main Stadium' },
                    { label: 'Attendees', key: 'attendees', type: 'text', placeholder: 'e.g. All Students' },
                  ].map(({ label, key, type, placeholder }) => (
                    <div key={key}>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>{label}</label>
                      <input type={type} value={form[key]} placeholder={placeholder}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        style={{ width: '100%', padding: '13px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', outline: 'none', fontWeight: 600 }} />
                    </div>
                  ))}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Category</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      style={{ width: '100%', padding: '13px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', outline: 'none', fontWeight: 600 }}>
                      {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button onClick={() => setShowModal(false)} className="btn"
                      style={{ flex: 1, padding: '14px', fontWeight: 800, border: '1px solid var(--border-color)', backgroundColor: 'transparent' }}>
                      Cancel
                    </button>
                    <button onClick={handleSaveEvent} disabled={saving} className="btn btn-primary"
                      style={{ flex: 1, padding: '14px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      {saving ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : <><CalendarIcon size={18} /> Add to Calendar</>}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventCalendar;
