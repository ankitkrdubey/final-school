import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Image as ImageIcon, Camera, Filter, LayoutGrid, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';

import campusView from '../assets/gallery/campus_view.png';
import sportsDay from '../assets/gallery/sports_day.png';
import scienceFair from '../assets/gallery/science_fair.png';
import graduation from '../assets/gallery/graduation.png';
import smartClassroom from '../assets/gallery/smart_classroom.png';
import libraryLounge from '../assets/gallery/library_lounge.png';

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const isDark = theme === 'dark';

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const categories = ['All', 'Infrastructure', 'Academic', 'Sports', 'Events'];

  const images = [
    { title: 'Campus View', cat: 'Infrastructure', url: campusView },
    { title: 'Annual Sports Day', cat: 'Sports', url: sportsDay },
    { title: 'Science Fair 2025', cat: 'Academic', url: scienceFair },
    { title: 'Graduation Ceremony', cat: 'Events', url: graduation },
    { title: 'Smart Classroom', cat: 'Infrastructure', url: smartClassroom },
    { title: 'Library Lounge', cat: 'Infrastructure', url: libraryLounge },
  ];

  const filteredImages = activeFilter === 'All' 
    ? images 
    : images.filter(img => img.cat === activeFilter);

  return (
    <div style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc', minHeight: '100vh', transition: 'background-color 0.3s ease' }}>
      <nav style={{ 
        height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        padding: '0 8%', backgroundColor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)',
        borderBottom: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100,
        transition: 'all 0.3s ease'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}>
          <div style={{ padding: '10px', backgroundColor: '#4f46e5', borderRadius: '14px', color: 'white', boxShadow: '0 8px 16px rgba(79, 70, 229, 0.3)' }}>
            <GraduationCap size={28} />
          </div>
          <div>
            <span style={{ fontSize: '1.75rem', fontWeight: 950, color: isDark ? '#ffffff' : '#0f172a', letterSpacing: '-2.2px', lineHeight: 1, transition: 'color 0.3s ease' }}>
              EduPro <small style={{ color: '#4f46e5', fontSize: '0.8rem', verticalAlign: 'middle', marginLeft: '4px' }}>ELITE</small>
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
               <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#4f46e5' }}></div>
               <span style={{ fontSize: '0.65rem', fontWeight: 800, color: isDark ? '#94a3b8' : '#64748b', letterSpacing: '1px', textTransform: 'uppercase', transition: 'color 0.3s ease' }}>Operating System</span>
            </div>
          </div>
        </Link>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          <Link to="/about" style={{ textDecoration: 'none', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600, transition: 'color 0.3s ease' }}>Features</Link>
          <Link to="/pricing" style={{ textDecoration: 'none', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600, transition: 'color 0.3s ease' }}>Pricing</Link>
          <Link to="/contact" style={{ textDecoration: 'none', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600, transition: 'color 0.3s ease' }}>Support</Link>
          
          {/* Custom Theme Toggle Button */}
          <motion.button
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.05)',
              color: isDark ? '#f59e0b' : '#4f46e5',
              transition: 'all 0.3s ease',
              boxShadow: isDark ? '0 4px 12px rgba(245, 158, 11, 0.15)' : '0 4px 12px rgba(79, 70, 229, 0.1)',
            }}
            whileHover={{ scale: 1.1, backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.1)' }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          <Link to="/login" style={{ padding: '12px 28px', borderRadius: '12px', fontWeight: 700, backgroundColor: '#4f46e5', color: 'white', textDecoration: 'none' }}>Portal Login</Link>
        </div>
      </nav>

      <div style={{ padding: '100px 8%' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontSize: '4.5rem', fontWeight: 950, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '24px', letterSpacing: '-3px', transition: 'color 0.3s ease' }}>Captured <span style={{ color: '#4f46e5' }}>Moments.</span></h1>
            <p style={{ fontSize: '1.25rem', color: isDark ? '#94a3b8' : '#64748b', maxWidth: '700px', margin: '0 auto', fontWeight: 500, lineHeight: 1.6, transition: 'color 0.3s ease' }}>A visual journey through the culture and high-performance environment of EduPro Elite.</p>
          </motion.div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '60px', flexWrap: 'wrap' }}>
             {categories.map(cat => (
               <button 
                 key={cat}
                 onClick={() => setActiveFilter(cat)}
                 style={{ 
                   padding: '12px 28px', borderRadius: '30px', fontWeight: 800, fontSize: '0.9rem',
                   backgroundColor: activeFilter === cat ? (isDark ? '#ffffff' : '#1e293b') : (isDark ? '#1e293b' : 'white'),
                   color: activeFilter === cat ? (isDark ? '#0f172a' : 'white') : '#64748b',
                   border: activeFilter === cat ? 'none' : (isDark ? '1px solid #334155' : '1px solid #e2e8f0'),
                   boxShadow: activeFilter === cat ? '0 10px 20px rgba(0,0,0,0.1)' : 'none',
                   transition: '0.3s', cursor: 'pointer',
                   display: 'flex', alignItems: 'center', gap: '10px'
                 }}
               >
                 {cat === 'All' && <LayoutGrid size={16} />}
                 {cat}
               </button>
             ))}
          </div>
        </div>

        <motion.div 
          layout
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '30px' }}
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((img, i) => (
              <motion.div 
                key={img.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ borderRadius: '40px', overflow: 'hidden', position: 'relative', height: '500px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}
                className="gallery-card"
              >
                 <img 
                   src={img.url} 
                   alt={img.title} 
                   style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s ease' }} 
                   className="gallery-img"
                 />
                 <div style={{ 
                   position: 'absolute', bottom: 0, left: 0, right: 0, padding: '48px', 
                   background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95), transparent)', color: 'white' 
                 }}>
                   <span style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: '#4f46e5', backgroundColor: '#ffffff', padding: '6px 14px', borderRadius: '10px', letterSpacing: '1px' }}>{img.cat}</span>
                   <h3 style={{ marginTop: '20px', fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.5px' }}>{img.title}</h3>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <Footer shareTitle="EduPro Elite Showcase" newsletterId="newsletter-email-gallery" />

      <style>{`
        .gallery-card:hover .gallery-img {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default Gallery;
