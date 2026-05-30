import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Globe, Share2, Mail, ShieldCheck } from 'lucide-react';
import { useToast, ToastRenderer } from '../hooks/useToast';

const Footer = ({ shareTitle = 'EduPro Elite', newsletterId = 'newsletter-email' }) => {
  const { toast, showToast, hideToast } = useToast();
  const isSharing = useRef(false);

  const isAuthenticated = () => localStorage.getItem('isAuthenticated') === 'true';

  const handleShare = async () => {
    if (isSharing.current) return;
    isSharing.current = true;
    const shareUrl = window.location.href;
    
    try {
      if (navigator.share) { 
        await navigator.share({ title: shareTitle, url: shareUrl }); 
      } else { 
        throw new Error('Native share not supported');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(shareUrl);
          showToast('Institutional link copied to clipboard!', 'success', 'Link Copied'); 
        } catch (clipboardErr) {
          const textArea = document.createElement("textarea");
          textArea.value = shareUrl;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          showToast('Institutional link copied to clipboard!', 'success', 'Link Copied'); 
        }
      }
    } finally {
      isSharing.current = false;
    }
  };

  const handleNewsletter = (e) => {
    const btn = e.currentTarget;
    const input = document.getElementById(newsletterId);
    if (input.value && input.value.includes('@')) {
      btn.innerHTML = 'Subscribed';
      btn.style.backgroundColor = '#10b981';
      input.value = '';
      input.disabled = true;
      input.placeholder = 'Access Granted.';
      showToast('Successfully subscribed to the EduPro weekly!', 'success', 'Subscribed');
    } else {
      input.style.border = '1px solid #ef4444';
      setTimeout(() => input.style.border = '1px solid rgba(255,255,255,0.1)', 2000);
      showToast('Please enter a valid institutional email address.', 'error', 'Invalid Email');
    }
  };

  return (
    <footer style={{ padding: '120px 8% 60px', backgroundColor: '#020617', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: '1px', background: 'linear-gradient(90deg, transparent, #4f46e5, transparent)', opacity: 0.3 }}></div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 2fr', gap: '80px', marginBottom: '100px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
             <div style={{ padding: '8px', backgroundColor: '#4f46e5', borderRadius: '12px', boxShadow: '0 8px 16px rgba(79, 70, 229, 0.4)' }}><GraduationCap size={28} color="white" /></div>
             <span style={{ fontSize: '2.2rem', fontWeight: 950, color: 'white', letterSpacing: '-2px' }}>
               EduPro <small style={{ color: '#4f46e5', fontSize: '0.9rem', verticalAlign: 'middle', marginLeft: '6px' }}>ELITE</small>
             </span>
          </div>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#64748b' }}>
            The definitive operating system for modern institutional management. Synchronizing academic excellence across the globe.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
             {[
               { Icon: Globe, action: () => window.open('https://edupro-elite.school.edu', '_blank') },
               { Icon: Share2, action: handleShare },
               { Icon: Mail, action: () => window.location.href = 'mailto:support@edupro-elite.edu' }
             ].map((item, i) => (
               <div 
                 key={i}
                 onClick={(e) => { e.stopPropagation(); item.action(); }}
                 style={{ 
                   width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.03)', 
                   display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.3s',
                   border: '1px solid rgba(255,255,255,0.05)'
                 }}
                 onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#4f46e5'; e.currentTarget.style.color = 'white'; }}
                 onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#94a3b8'; }}
               >
                 <item.Icon size={20} style={{ pointerEvents: 'none' }} />
               </div>
             ))}
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 950, color: 'white', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '1px' }}>Ecosystem</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontWeight: 600 }}>
            {[
              { name: 'Academic Suite', path: '/about#academic', internal: '/dashboard/students' },
              { name: 'Finance Hub', path: '/about#admin', internal: '/dashboard/fees' },
              { name: 'AI Insights', path: '/about#ai-insights', internal: '/dashboard/performance' },
              { name: 'LMS Connect', path: '/about#academic', internal: '/dashboard/lms' },
              { name: 'Library Pro', path: '/about#admin', internal: '/dashboard/library' }
            ].map(link => (
              <Link 
                key={link.name} 
                to={isAuthenticated() ? link.internal : link.path} 
                style={{ color: '#64748b', textDecoration: 'none', transition: '0.3s', fontSize: '1rem' }} 
                onMouseOver={(e) => e.currentTarget.style.color = 'white'} 
                onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 950, color: 'white', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '1px' }}>Institutional</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontWeight: 600 }}>
            <Link to="/about" style={{ color: '#64748b', textDecoration: 'none', transition: '0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}>About OS</Link>
            <Link to="/pricing" style={{ color: '#64748b', textDecoration: 'none', transition: '0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}>Service Tiers</Link>
            <Link to="/gallery" style={{ color: '#64748b', textDecoration: 'none', transition: '0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}>Global Showcase</Link>
            <Link to="/admission" style={{ color: '#64748b', textDecoration: 'none', transition: '0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}>Admission Hub</Link>
            <Link to="/privacy" style={{ color: '#64748b', textDecoration: 'none', transition: '0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}>Privacy Policy</Link>
            <Link to="/terms" style={{ color: '#64748b', textDecoration: 'none', transition: '0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}>Institutional Terms</Link>
          </div>
        </div>

        <div style={{ 
          backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '32px', padding: '48px', 
          border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' 
        }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle at top right, rgba(79, 70, 229, 0.1), transparent)', zIndex: 0 }}></div>
          <h4 style={{ fontSize: '1.4rem', fontWeight: 950, color: 'white', marginBottom: '16px', position: 'relative' }}>Institutional Intelligence</h4>
          <p style={{ fontSize: '1rem', color: '#64748b', marginBottom: '32px', lineHeight: 1.5, position: 'relative' }}>Subscribe to the EduPro weekly for exclusive pedagogical whitepapers.</p>
          <div style={{ position: 'relative' }}>
            <input id={newsletterId} type="email" placeholder="institutional@email.edu" style={{ width: '100%', padding: '22px 28px', borderRadius: '20px', backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none', fontSize: '1rem' }} />
            <button 
              onClick={handleNewsletter}
              style={{ position: 'absolute', right: '8px', top: '8px', bottom: '8px', padding: '0 32px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 900, cursor: 'pointer', transition: '0.3s' }}
            >Join</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '32px', fontSize: '0.8rem', color: '#4b5563', fontWeight: 700 }}>
             <ShieldCheck size={16} color="#10b981" /> Data encrypted via AES-256 standards.
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#4b5563' }}>© 2026 EduPro Elite OS. Built for Academic Excellence.</p>
         <div style={{ display: 'flex', gap: '32px' }}>
            {[
              { text: 'System Status', path: '/status' },
              { text: 'Privacy Policy', path: '/privacy' },
              { text: 'Data Security', path: '/security' },
              { text: 'Institutional Terms', path: '/terms' }
            ].map(item => (
              <Link 
                key={item.text} 
                to={item.path} 
                style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4b5563', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
                onMouseOver={(e) => e.currentTarget.style.color = 'white'}
                onMouseOut={(e) => e.currentTarget.style.color = '#4b5563'}
              >
                 {item.text === 'System Status' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>}
                 {item.text}
              </Link>
            ))}
         </div>
      </div>
      <ToastRenderer toast={toast} onClose={hideToast} />
    </footer>
  );
};

export default Footer;
