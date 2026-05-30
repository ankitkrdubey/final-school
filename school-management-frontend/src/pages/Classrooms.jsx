import React, { useState } from 'react';
import { Building, Plus, Users, Layout, MapPin, Search, CheckCircle2, XCircle, X, Save, Clock, Cpu, Tv, Wind, Wifi, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Classrooms = () => {
  const [rooms, setRooms] = useState([
    { 
      id: 1, name: 'Room 101', wing: 'Main Block', capacity: 45, type: 'Lecture Hall', status: 'Available',
      specs: { projector: true, ac: true, smartboard: false, wifi: true, computers: false, safetyKit: false },
      schedule: [
        { period: 'Period 1 (08:30 - 09:30)', subject: 'Mathematics', class: 'Class 10-A', teacher: 'Dr. Michael Chen' },
        { period: 'Period 3 (11:00 - 12:00)', subject: 'English', class: 'Class 10-B', teacher: 'Ms. Emily Bronte' },
        { period: 'Period 4 (01:00 - 02:00)', subject: 'History', class: 'Class 9-A', teacher: 'Dr. Yuval Noah' }
      ]
    },
    { 
      id: 2, name: 'Room 102', wing: 'Main Block', capacity: 40, type: 'Smart Class', status: 'Occupied',
      specs: { projector: true, ac: true, smartboard: true, wifi: true, computers: false, safetyKit: false },
      schedule: [
        { period: 'Period 1 (08:30 - 09:30)', subject: 'Physics', class: 'Class 11-A', teacher: 'Prof. Robert Frost' },
        { period: 'Period 2 (09:45 - 10:45)', subject: 'Computer Science', class: 'Class 12-A', teacher: 'Mr. Alan Turing' },
        { period: 'Period 5 (02:15 - 03:15)', subject: 'Chemistry', class: 'Class 10-B', teacher: 'Dr. Michael Chen' }
      ]
    },
    { 
      id: 3, name: 'Lab 01', wing: 'Science Wing', capacity: 30, type: 'Computer Lab', status: 'Maintenance',
      specs: { projector: true, ac: true, smartboard: false, wifi: true, computers: true, safetyKit: true },
      schedule: [
        { period: 'Period 2 (09:45 - 10:45)', subject: 'Coding Lab', class: 'Class 11-B', teacher: 'Mr. Alan Turing' },
        { period: 'Period 4 (01:00 - 02:00)', subject: 'Database Lab', class: 'Class 12-B', teacher: 'Mr. Alan Turing' }
      ]
    },
    { 
      id: 4, name: 'Room 205', wing: 'East Wing', capacity: 50, type: 'Auditorium (S)', status: 'Available',
      specs: { projector: true, ac: true, smartboard: true, wifi: true, computers: false, safetyKit: true },
      schedule: [
        { period: 'Period 3 (11:00 - 12:00)', subject: 'Guest Seminar', class: 'All Seniors', teacher: 'Prof. Robert Frost' }
      ]
    },
    { 
      id: 5, name: 'Room 301', wing: 'North Wing', capacity: 35, type: 'Discussion Room', status: 'Available',
      specs: { projector: false, ac: false, smartboard: false, wifi: true, computers: false, safetyKit: false },
      schedule: [
        { period: 'Period 4 (01:00 - 02:00)', subject: 'Debate Prep', class: 'Class 8-C', teacher: 'Ms. Emily Bronte' }
      ]
    },
  ]);

  const wingsList = ['Main Block', 'Science Wing', 'East Wing', 'West Wing', 'North Wing', 'South Wing'];
  const typesList = ['Lecture Hall', 'Smart Class', 'Computer Lab', 'Physics Lab', 'Discussion Room', 'Auditorium (S)'];
  const statusList = ['Available', 'Occupied', 'Maintenance'];

  const statusStyles = {
    'Available': { color: '#10b981', bg: '#ecfdf5', icon: <CheckCircle2 size={14} /> },
    'Occupied': { color: '#4f46e5', bg: '#eef2ff', icon: <Users size={14} /> },
    'Maintenance': { color: '#f59e0b', bg: '#fffbeb', icon: <XCircle size={14} /> }
  };

  // Add/Register Facility Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomWing, setNewRoomWing] = useState(wingsList[0]);
  const [newRoomCapacity, setNewRoomCapacity] = useState(40);
  const [newRoomType, setNewRoomType] = useState(typesList[0]);
  const [newRoomStatus, setNewRoomStatus] = useState(statusList[0]);

  // View Schedule Modal States
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedRoomSchedule, setSelectedRoomSchedule] = useState(null);

  // Manage Specs Modal States
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const [selectedRoomSpecs, setSelectedRoomSpecs] = useState(null);
  const [tempSpecs, setTempSpecs] = useState({
    projector: false,
    ac: false,
    smartboard: false,
    wifi: false,
    computers: false,
    safetyKit: false
  });

  // Handlers
  const handleAddRoom = (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    const newRoom = {
      id: Date.now(),
      name: newRoomName,
      wing: newRoomWing,
      capacity: Number(newRoomCapacity) || 30,
      type: newRoomType,
      status: newRoomStatus,
      specs: { projector: false, ac: false, smartboard: false, wifi: true, computers: false, safetyKit: false },
      schedule: []
    };

    setRooms([...rooms, newRoom]);

    // Reset Fields
    setNewRoomName('');
    setNewRoomWing(wingsList[0]);
    setNewRoomCapacity(40);
    setNewRoomType(typesList[0]);
    setNewRoomStatus(statusList[0]);
    setIsAddOpen(false);
  };

  const handleOpenSchedule = (room) => {
    setSelectedRoomSchedule(room);
    setIsScheduleOpen(true);
  };

  const handleOpenSpecs = (room) => {
    setSelectedRoomSpecs(room);
    setTempSpecs({ ...room.specs });
    setIsSpecsOpen(true);
  };

  const handleSaveSpecs = (e) => {
    e.preventDefault();
    if (!selectedRoomSpecs) return;

    setRooms(rooms.map(room => {
      if (room.id === selectedRoomSpecs.id) {
        return {
          ...room,
          specs: { ...tempSpecs }
        };
      }
      return room;
    }));

    setIsSpecsOpen(false);
    setSelectedRoomSpecs(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Classrooms & Infrastructure</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Monitor room availability, technical specifications, and facility status.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary" 
          onClick={() => setIsAddOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px' }}
        >
          <Plus size={20} /> Add Facility
        </motion.button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {rooms.map((room, idx) => (
          <motion.div 
            layout
            key={room.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="card"
            style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            whileHover={{ y: -5, borderColor: 'var(--primary)', boxShadow: 'var(--shadow-lg)' }}
          >
            <div style={{ padding: '24px', backgroundColor: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ padding: '12px', backgroundColor: 'var(--primary-light)', borderRadius: '12px', color: 'var(--primary)' }}>
                  <Building size={24} />
                </div>
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '30px', 
                  fontSize: '0.75rem', fontWeight: 800, 
                  color: statusStyles[room.status]?.color || '#475569', 
                  backgroundColor: statusStyles[room.status]?.bg || '#f1f5f9' 
                }}>
                  {statusStyles[room.status]?.icon}
                  {room.status}
                </div>
              </div>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '6px', color: 'var(--text-main)' }}>{room.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
                <MapPin size={14} /> {room.wing}
              </div>

              {/* Technical Specifications Badges */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {room.specs.wifi && <span title="WiFi 6 Available" style={{ padding: '4px 8px', borderRadius: '6px', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', border: '1px solid var(--border-color)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Wifi size={12} color="#10B981" /> WiFi</span>}
                {room.specs.ac && <span title="Air Conditioned" style={{ padding: '4px 8px', borderRadius: '6px', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', border: '1px solid var(--border-color)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Wind size={12} color="#3B82F6" /> AC</span>}
                {room.specs.projector && <span title="Projector Screen Available" style={{ padding: '4px 8px', borderRadius: '6px', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', border: '1px solid var(--border-color)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Tv size={12} color="#8B5CF6" /> Projector</span>}
                {room.specs.smartboard && <span title="Interactive Smartboard" style={{ padding: '4px 8px', borderRadius: '6px', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', border: '1px solid var(--border-color)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Cpu size={12} color="#EC4899" /> Smartboard</span>}
                {room.specs.computers && <span title="Workstation Desktops Installed" style={{ padding: '4px 8px', borderRadius: '6px', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', border: '1px solid var(--border-color)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Terminal size={12} color="#F59E0B" /> PC</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                 <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>Capacity</p>
                    <p style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>{room.capacity} Pax</p>
                 </div>
                 <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>Facility Type</p>
                    <p style={{ fontSize: '0.85rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>{room.type}</p>
                 </div>
              </div>
            </div>

            <div style={{ padding: '16px 24px', backgroundColor: 'var(--bg-body)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
               <button 
                 onClick={() => handleOpenSchedule(room)}
                 style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem', border: 'none', background: 'none', cursor: 'pointer' }}
               >
                 View Schedule
               </button>
               <button 
                 onClick={() => handleOpenSpecs(room)}
                 style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.85rem', border: 'none', background: 'none', cursor: 'pointer' }}
               >
                 Manage Specs
               </button>
            </div>
          </motion.div>
        ))}

        {/* Register Facility (Dashed Card) */}
        <motion.div 
          onClick={() => setIsAddOpen(true)}
          style={{ 
            border: '2px dashed var(--border-color)', borderRadius: '24px', 
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '40px', cursor: 'pointer', transition: '0.3s', minHeight: '300px'
          }} 
          whileHover={{ scale: 1.02, borderColor: 'var(--primary)' }}
          whileTap={{ scale: 0.98 }}
        >
           <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Plus size={32} />
           </div>
           <p style={{ fontWeight: 900, color: 'var(--text-main)', marginBottom: '4px' }}>Register Facility</p>
           <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Add new classroom or lab</p>
        </motion.div>
      </div>

      {/* REGISTER / ADD FACILITY MODAL */}
      <AnimatePresence>
        {isAddOpen && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', padding: '24px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: '24px', maxWidth: '500px', width: '100%', boxShadow: 'var(--shadow-2xl)', border: '1px solid var(--border-color)', position: 'relative' }}
            >
              <button 
                onClick={() => setIsAddOpen(false)}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '24px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Plus size={24} color="var(--primary)" /> Register Infrastructure Facility
              </h2>

              <form onSubmit={handleAddRoom} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Room / Facility Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Room 103 or Biology Lab" 
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Campus Wing</label>
                    <select 
                      value={newRoomWing}
                      onChange={(e) => setNewRoomWing(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
                    >
                      {wingsList.map((w, idx) => <option key={idx} value={w}>{w}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Capacity (Pax Limit)</label>
                    <input 
                      type="number" 
                      value={newRoomCapacity}
                      onChange={(e) => setNewRoomCapacity(Number(e.target.value))}
                      required
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Facility Type</label>
                    <select 
                      value={newRoomType}
                      onChange={(e) => setNewRoomType(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
                    >
                      {typesList.map((t, idx) => <option key={idx} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Starting Status</label>
                    <select 
                      value={newRoomStatus}
                      onChange={(e) => setNewRoomStatus(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
                    >
                      {statusList.map((s, idx) => <option key={idx} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
                  <button 
                    type="button" 
                    onClick={() => setIsAddOpen(false)}
                    className="btn" 
                    style={{ backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', color: 'var(--text-main)', width: '100%' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ width: '100%' }}
                  >
                    Register Facility
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIEW SCHEDULE MODAL */}
      <AnimatePresence>
        {isScheduleOpen && selectedRoomSchedule && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', padding: '24px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: '24px', maxWidth: '550px', width: '100%', boxShadow: 'var(--shadow-2xl)', border: '1px solid var(--border-color)', position: 'relative' }}
            >
              <button 
                onClick={() => {
                  setIsScheduleOpen(false);
                  setSelectedRoomSchedule(null);
                }}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '8px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={24} color="var(--primary)" /> {selectedRoomSchedule.name} Timetable
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Hourly calendar occupancy schedule inside the <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{selectedRoomSchedule.wing}</span>.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {selectedRoomSchedule.schedule.length > 0 ? (
                  selectedRoomSchedule.schedule.map((slot, idx) => (
                    <div 
                      key={idx}
                      style={{ 
                        padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>{slot.period}</span>
                        <span style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-main)' }}>{slot.subject}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>{slot.class}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Instructor: {slot.teacher}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '30px 16px', border: '1px dashed var(--border-color)', borderRadius: '16px' }}>
                    <CheckCircle2 size={32} color="#10B981" style={{ marginBottom: '10px' }} />
                    <p style={{ margin: 0, fontWeight: 700, color: 'var(--text-main)' }}>No Scheduled Classes Today</p>
                    <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>This facility is currently fully unallocated and open for use.</p>
                  </div>
                )}
              </div>

              <button 
                onClick={() => {
                  setIsScheduleOpen(false);
                  setSelectedRoomSchedule(null);
                }}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '24px' }}
              >
                Close Calendar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MANAGE SPECS MODAL */}
      <AnimatePresence>
        {isSpecsOpen && selectedRoomSpecs && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', padding: '24px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: '24px', maxWidth: '450px', width: '100%', boxShadow: 'var(--shadow-2xl)', border: '1px solid var(--border-color)', position: 'relative' }}
            >
              <button 
                onClick={() => {
                  setIsSpecsOpen(false);
                  setSelectedRoomSpecs(null);
                }}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '8px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Cpu size={24} color="var(--primary)" /> Manage {selectedRoomSpecs.name} Specifications
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Toggle available facility amenities and academic tech parameters.</p>

              <form onSubmit={handleSaveSpecs} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Custom Specs Toggles */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={tempSpecs.wifi} 
                      onChange={(e) => setTempSpecs({ ...tempSpecs, wifi: e.target.checked })}
                      style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Wifi size={16} color="#10B981" />
                      <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>High-Speed Wi-Fi 6 AP</span>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={tempSpecs.ac} 
                      onChange={(e) => setTempSpecs({ ...tempSpecs, ac: e.target.checked })}
                      style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Wind size={16} color="#3B82F6" />
                      <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>Air Conditioning Unit (AC)</span>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={tempSpecs.projector} 
                      onChange={(e) => setTempSpecs({ ...tempSpecs, projector: e.target.checked })}
                      style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Tv size={16} color="#8B5CF6" />
                      <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>HD AV Projector System</span>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={tempSpecs.smartboard} 
                      onChange={(e) => setTempSpecs({ ...tempSpecs, smartboard: e.target.checked })}
                      style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Cpu size={16} color="#EC4899" />
                      <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>Interactive Smartboard Canvas</span>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={tempSpecs.computers} 
                      onChange={(e) => setTempSpecs({ ...tempSpecs, computers: e.target.checked })}
                      style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Terminal size={16} color="#F59E0B" />
                      <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>Desktop PC Workstations</span>
                    </div>
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsSpecsOpen(false);
                      setSelectedRoomSpecs(null);
                    }}
                    className="btn" 
                    style={{ backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', color: 'var(--text-main)', width: '100%' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Save size={16} /> Save Specs
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Classrooms;
