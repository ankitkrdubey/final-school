import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import AIChatbot from '../components/AIChatbot';
import { Menu, Sun, Moon, Bell, User, LogOut, Activity, Search, X, Settings } from 'lucide-react';
import { logout } from '../services/service';

const MainLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, title: 'Academic Alert: Exam Results Out', time: '2h ago', type: 'academic', unread: true },
    { id: 2, title: 'Finance: Fee Receipt Generated', time: '5h ago', type: 'finance', unread: true },
    { id: 3, title: 'Security: New Login Detected', time: '1d ago', type: 'security', unread: false }
  ]);

  useEffect(() => {
    const syncTheme = () => {
      const storedTheme = localStorage.getItem('theme');
      setIsDark(storedTheme === 'dark');
    };
    window.addEventListener('storage', syncTheme);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    return () => window.removeEventListener('storage', syncTheme);
  }, [isDark]);

  return (
    <div>
      <Sidebar collapsed={collapsed} />
      
      <Topbar toggleSidebar={() => setCollapsed(!collapsed)} />

      <main className="main-content">
        <div style={{ minHeight: 'calc(100vh - 160px)' }}>
          <Outlet />
        </div>
        
        {/* Global Footer */}
        <footer style={{ 
          marginTop: '40px', padding: '32px 0', borderTop: '1px solid var(--border-color)', 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          color: 'var(--text-muted)', fontSize: '0.85rem'
        }}>
          <div>
            © {new Date().getFullYear()} <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>EduPro Elite</span> OS. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '24px', fontWeight: 600 }}>
            <span 
              onClick={() => navigate('/privacy')} 
              style={{ cursor: 'pointer', transition: '0.3s' }}
              onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              Privacy Policy
            </span>
            <span 
              onClick={() => navigate('/terms')} 
              style={{ cursor: 'pointer', transition: '0.3s' }}
              onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              Terms of Service
            </span>
            <span 
              onClick={() => navigate('/contact')} 
              style={{ cursor: 'pointer', transition: '0.3s' }}
              onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              Support
            </span>
          </div>
        </footer>
      </main>

      <AIChatbot />
    </div>
  );
};

export default MainLayout;
