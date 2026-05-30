import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus, MapPin, Clock, Users, FileText, X, Save, Image as ImageIcon, Link as LinkIcon, Star, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AddEvent = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const categories = ['Academic', 'Sports', 'Co-Curricular', 'Social', 'Administrative', 'Examination'];
  const venues = ['Grand Auditorium', 'Main Stadium', 'Science Block Hall', 'Library Seminar Room', 'Conference Room A'];

  // Default initial events for synchronizing fallback storage
  const initialEvents = [
    { id: 1, title: 'Annual Sports Day 2026', date: 'May 25', day: 'Wednesday', time: '09:00 AM', location: 'Main Stadium', category: 'Sports', attendees: 'Grade 1-12', status: 'Upcoming' },
    { id: 2, title: 'Global Science Symposium', date: 'June 05', day: 'Friday', time: '10:00 AM', location: 'Grand Auditorium', category: 'Academic', attendees: 'Faculty & Researchers', status: 'Upcoming' },
    { id: 3, title: 'Parent-Teacher Conference', date: 'June 15', day: 'Monday', time: '08:30 AM', location: 'Administrative Block', category: 'General', attendees: 'Parents & Teachers', status: 'Planning' },
    { id: 4, title: 'Inter-School Debate Final', date: 'June 22', day: 'Monday', time: '11:00 AM', location: 'Debate Hall', category: 'Co-Curricular', attendees: 'Debate Team', status: 'Draft' },
  ];

  // States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [venue, setVenue] = useState(venues[0]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [participants, setParticipants] = useState('');
  
  // Visibility States
  const [showPublic, setShowPublic] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);
  const [enableReg, setEnableReg] = useState(false);

  // Banner Upload state
  const [bannerImage, setBannerImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Image Upload Handler
  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const reader = new FileReader();
            reader.onload = (event) => {
              setBannerImage(event.target.result);
              setIsUploading(false);
              showToast('Banner uploaded successfully!', 'success');
            };
            reader.readAsDataURL(file);
          }, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  // Submit / Publish event
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Event title is required', 'error');
      return;
    }
    if (!startDate) {
      showToast('Start date and time is required', 'error');
      return;
    }
    if (!endDate) {
      showToast('End date and time is required', 'error');
      return;
    }
    if (!participants.trim()) {
      showToast('Target participants are required', 'error');
      return;
    }

    // Date Parser
    const startObj = new Date(startDate);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    const formattedDate = `${months[startObj.getMonth()].slice(0, 3)} ${startObj.getDate().toString().padStart(2, '0')}`;
    const formattedDay = days[startObj.getDay()];

    let hours = startObj.getHours();
    const minutes = startObj.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;

    const newEventItem = {
      id: Date.now(),
      title: title.trim(),
      date: formattedDate,
      day: formattedDay,
      time: formattedTime,
      location: venue,
      category: category,
      attendees: participants.trim(),
      status: 'Upcoming',
      bannerImage: bannerImage,
      showPublic,
      sendEmail,
      enableReg
    };

    // Save to localStorage
    const saved = localStorage.getItem('school_events');
    const currentEvents = saved ? JSON.parse(saved) : initialEvents;
    const updatedEvents = [newEventItem, ...currentEvents];
    localStorage.setItem('school_events', JSON.stringify(updatedEvents));

    showToast('Event published successfully!', 'success');
    
    // Redirect after brief delay to let toast show
    setTimeout(() => {
      navigate('/dashboard/events');
    }, 1000);
  };

  return (
    <div style={{ padding: '20px' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 className="page-title" style={{ marginBottom: '8px' }}>Create New Campus Event</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Schedule and broadcast upcoming gatherings, competitions, or administrative sessions.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
             <button 
               type="button" 
               onClick={() => navigate('/dashboard/events')}
               className="btn" 
               style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', cursor: 'pointer' }}
             >
                <X size={20} /> Cancel
             </button>
             <button 
               type="submit" 
               className="btn btn-primary" 
               style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', cursor: 'pointer', border: 'none' }}
             >
                <Save size={20} /> Publish Event
             </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
           {/* Form Section */}
           <div className="card" style={{ padding: '40px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div>
                 <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>
                    <FileText size={16} /> Event Title
                 </label>
                 <input 
                   required
                   type="text" 
                   value={title}
                   onChange={e => setTitle(e.target.value)}
                   placeholder="e.g. Annual Sports Day 2026" 
                   style={{ width: '100%', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontSize: '1.1rem', fontWeight: 600 }}
                 />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                 <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>
                       <Calendar size={16} /> Category
                    </label>
                    <select 
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600, cursor: 'pointer' }}
                    >
                       {categories.map(c => <option key={c}>{c}</option>)}
                    </select>
                 </div>
                 <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>
                       <MapPin size={16} /> Venue / Location
                    </label>
                    <select 
                      value={venue}
                      onChange={e => setVenue(e.target.value)}
                      style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600, cursor: 'pointer' }}
                    >
                       {venues.map(v => <option key={v}>{v}</option>)}
                    </select>
                 </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                 <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>
                       <Clock size={16} /> Start Date & Time
                    </label>
                    <input 
                      required
                      type="datetime-local" 
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600, cursor: 'pointer' }} 
                    />
                 </div>
                 <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>
                       <Clock size={16} /> End Date & Time
                    </label>
                    <input 
                      required
                      type="datetime-local" 
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600, cursor: 'pointer' }} 
                    />
                 </div>
              </div>

              <div>
                 <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>
                    <Users size={16} /> Target Participants
                 </label>
                 <input 
                   required
                   type="text" 
                   value={participants}
                   onChange={e => setParticipants(e.target.value)}
                   placeholder="e.g. All Students, Faculty Members, Parents..." 
                   style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }}
                 />
              </div>
           </div>

           {/* Sidebar: Media & Promotion */}
           <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="card" style={{ padding: '28px', border: '1px solid var(--border-color)' }}>
                 <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)' }}>
                    <ImageIcon size={18} /> Event Media
                 </h3>

                 {bannerImage ? (
                   <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                      <img src={bannerImage} alt="Event Banner" style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                      <button 
                        type="button"
                        onClick={() => setBannerImage(null)}
                        style={{ 
                          position: 'absolute', top: '10px', right: '10px', 
                          width: '28px', height: '28px', borderRadius: '50%', 
                          backgroundColor: 'rgba(15,23,42,0.8)', border: 'none', 
                          color: 'white', display: 'flex', alignItems: 'center', 
                          justifyContent: 'center', cursor: 'pointer' 
                        }}
                      >
                         <X size={14} />
                      </button>
                   </div>
                 ) : isUploading ? (
                   <div style={{ padding: '30px 20px', border: '2px dashed var(--border-color)', borderRadius: '16px', textAlign: 'center', backgroundColor: 'var(--bg-body)' }}>
                      <RefreshCw size={24} className="spin text-muted" style={{ marginBottom: '8px', color: 'var(--primary)' }} />
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '4px' }}>Uploading Banner ({uploadProgress}%)</div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
                         <div style={{ width: `${uploadProgress}%`, height: '100%', backgroundColor: 'var(--primary)', transition: 'width 0.2s' }}></div>
                      </div>
                   </div>
                 ) : (
                   <div 
                     onClick={() => fileInputRef.current.click()}
                     style={{ 
                       padding: '40px', 
                       border: '2px dashed var(--border-color)', 
                       borderRadius: '16px', 
                       textAlign: 'center', 
                       backgroundColor: 'var(--bg-body)',
                       cursor: 'pointer',
                       userSelect: 'none',
                       transition: '0.2s'
                     }}
                     onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                     onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                   >
                      <ImageIcon size={32} className="text-muted" style={{ marginBottom: '12px' }} />
                      <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Upload Banner Image</p>
                      <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', opacity: 0.6 }}>1200 x 400px recommended</p>
                   </div>
                 )}
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   onChange={handleBannerUpload} 
                   accept="image/*"
                   style={{ display: 'none' }} 
                 />
              </div>

              <div className="card" style={{ padding: '28px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
                 <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)' }}>
                    <Star size={18} className="text-muted" /> Visibility Settings
                 </h3>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', color: 'var(--text-main)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                       <input 
                         type="checkbox" 
                         id="v1" 
                         checked={showPublic}
                         onChange={e => setShowPublic(e.target.checked)}
                         style={{ width: '18px', height: '18px', cursor: 'pointer' }} 
                       />
                       <label htmlFor="v1" style={{ fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}>Show on Public Website</label>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                       <input 
                         type="checkbox" 
                         id="v2" 
                         checked={sendEmail}
                         onChange={e => setSendEmail(e.target.checked)}
                         style={{ width: '18px', height: '18px', cursor: 'pointer' }} 
                       />
                       <label htmlFor="v2" style={{ fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}>Send Email Reminders</label>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                       <input 
                         type="checkbox" 
                         id="v3" 
                         checked={enableReg}
                         onChange={e => setEnableReg(e.target.checked)}
                         style={{ width: '18px', height: '18px', cursor: 'pointer' }} 
                       />
                       <label htmlFor="v3" style={{ fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}>Enable Registration Form</label>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </form>

      {/* Toast Notification Container */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{ 
              position: 'fixed', bottom: '32px', right: '32px', zIndex: 2000, 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 24px', 
              backgroundColor: '#0f172a', color: 'white', borderRadius: '20px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)', maxWidth: '450px', border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div style={{ 
              width: '28px', height: '28px', borderRadius: '8px', 
              backgroundColor: toast.type === 'success' ? '#10b98120' : '#ef444420', 
              color: toast.type === 'success' ? '#10b981' : '#ef4444', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <CheckCircle size={16} />
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: '1.4', flex: 1 }}>{toast.message}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddEvent;
