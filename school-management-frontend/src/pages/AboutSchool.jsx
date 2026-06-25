import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Target, Users, Award, ShieldCheck, Heart, Globe, Share2, Mail, Zap, Cpu, Database, Smartphone, BarChart3, Lock, Search, BookOpen, Clock, MessageSquare, UserCheck, Settings, PieChart, Layout } from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

const AboutSchool = () => {
  const featureGroups = [
    {
      title: 'Academic Suite',
      id: 'academic',
      icon: <BookOpen size={24} />,
      color: '#6366f1',
      features: [
        { title: 'Digital Gradebook', desc: 'Real-time assessment tracking with AI grade prediction.' },
        { title: 'Smart Attendance', desc: 'Biometric and geo-fenced attendance for students and staff.' },
        { title: 'LMS Integration', desc: 'Seamless connection with Google Classroom and Moodle.' },
        { title: 'Exam Management', desc: 'End-to-end examination lifecycle from scheduling to results.' }
      ]
    },
    {
      title: 'Administrative Hub',
      id: 'admin',
      icon: <Settings size={24} />,
      color: '#8b5cf6',
      features: [
        { title: 'Admissions CRM', desc: 'Simplified digital inquiry and enrollment workflow.' },
        { title: 'Finance & ERP', desc: 'Automated fee collection, payroll, and expense tracking.' },
        { title: 'Inventory Control', desc: 'Manage school assets, library books, and laboratory stock.' },
        { title: 'HR & Payroll', desc: 'Comprehensive staff management and salary processing.' }
      ]
    },
    {
      title: 'Communication Core',
      id: 'comms',
      icon: <MessageSquare size={24} />,
      color: '#ec4899',
      features: [
        { title: 'Parent Portal App', desc: 'Real-time notifications and performance reports for parents.' },
        { title: 'Broadcast Engine', desc: 'Instant SMS and Email alerts for announcements.' },
        { title: 'Notice Board', desc: 'Centralized digital repository for school news and events.' },
        { title: 'Teacher Connect', desc: 'Direct secure messaging between staff and administration.' }
      ]
    }
  ];

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [window.location.hash]);

  return (
    <div style={{ backgroundColor: '#030712', minHeight: '100vh', color: 'white', overflowX: 'hidden' }}>
      {/* Premium Navbar */}
      <nav style={{ 
        height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        padding: '0 8%', backgroundColor: 'rgba(3, 7, 18, 0.8)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, zIndex: 100 
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}>
          <div style={{ padding: '10px', backgroundColor: '#6366f1', borderRadius: '14px', color: 'white', boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)' }}>
            <GraduationCap size={28} />
          </div>
          <div>
            <span style={{ fontSize: '1.75rem', fontWeight: 950, color: 'white', letterSpacing: '-2.2px', lineHeight: 1 }}>
              EduPro <small style={{ color: '#6366f1', fontSize: '0.8rem', verticalAlign: 'middle', marginLeft: '4px' }}>ELITE</small>
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
               <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#6366f1' }}></div>
               <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase' }}>Operating System</span>
            </div>
          </div>
        </Link>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          <Link to="/about" style={{ textDecoration: 'none', color: 'white', fontWeight: 700 }}>Features</Link>
          <Link to="/pricing" style={{ textDecoration: 'none', color: '#94a3b8', fontWeight: 600 }}>Pricing</Link>
          <Link to="/gallery" style={{ textDecoration: 'none', color: '#94a3b8', fontWeight: 600 }}>Showcase</Link>
          <Link to="/contact" style={{ textDecoration: 'none', color: '#94a3b8', fontWeight: 600 }}>Support</Link>
          <Link to="/login" style={{ padding: '12px 28px', borderRadius: '12px', fontWeight: 700, backgroundColor: '#6366f1', color: 'white', textDecoration: 'none' }}>Portal Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '140px 8% 100px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '1000px', height: '400px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 0 }}></div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 1 }}>
          <span style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', padding: '8px 24px', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>Capabilities</span>
          <h1 style={{ fontSize: '5rem', fontWeight: 950, margin: '24px 0', lineHeight: 1, letterSpacing: '-4px' }}>
            Engineered for <span style={{ background: 'linear-gradient(to right, #818cf8, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Excellence.</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '800px', margin: '0 auto 60px', lineHeight: 1.6 }}>
            Explore the most comprehensive operating system ever built for educational institutions. 
            From AI-driven insights to seamless financial automation.
          </p>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '80px 8% 140px' }}>
        <div style={{ display: 'grid', gap: '80px' }}>
          {featureGroups.map((group, i) => (
            <div key={i} id={group.id} style={{ scrollMarginTop: '120px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '48px' }}>
                <div style={{ padding: '12px', backgroundColor: `${group.color}20`, color: group.color, borderRadius: '14px', border: `1px solid ${group.color}40` }}>
                  {group.icon}
                </div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1.5px' }}>{group.title}</h2>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                {group.features.map((feat, j) => (
                  <motion.div 
                    key={j}
                    whileHover={{ y: -10, backgroundColor: 'rgba(255,255,255,0.03)' }}
                    style={{ 
                      padding: '40px', borderRadius: '24px', backgroundColor: 'rgba(255,255,255,0.01)', 
                      border: '1px solid rgba(255,255,255,0.05)', transition: '0.3s'
                    }}
                  >
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', color: 'white' }}>{feat.title}</h3>
                    <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>{feat.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Visual Showcase / Dashboard Preview */}
      <section id="ai-insights" style={{ padding: '140px 8%', backgroundColor: 'rgba(99, 102, 241, 0.02)', position: 'relative', scrollMarginTop: '80px' }}>
         <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 950, letterSpacing: '-2px' }}>Operational <span style={{ color: '#8b5cf6' }}>Command.</span></h2>
            <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>A unified interface to manage every aspect of your institution.</p>
         </div>

         <div style={{ 
           maxWidth: '1200px', margin: '0 auto', padding: '12px', backgroundColor: 'rgba(255,255,255,0.05)', 
           borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
           overflow: 'hidden'
         }}>
            <div style={{ height: '650px', backgroundColor: '#030712', borderRadius: '20px', display: 'flex', position: 'relative', overflow: 'hidden' }}>
               {/* Mockup Sidebar */}
               <div style={{ width: '80px', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 0', gap: '30px' }}>
                  <div style={{ padding: '10px', backgroundColor: '#6366f1', borderRadius: '12px' }}><GraduationCap size={20} /></div>
                  {[Layout, Users, BarChart3, Database, MessageSquare, Settings].map((Icon, i) => (
                    <Icon key={i} size={20} color={i === 0 ? '#6366f1' : '#4b5563'} style={{ cursor: 'pointer' }} />
                  ))}
               </div>

               {/* Mockup Main Content */}
               <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Mockup Header */}
                  <div style={{ height: '70px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(255,255,255,0.03)', padding: '8px 16px', borderRadius: '10px', width: '300px' }}>
                        <Search size={16} color="#4b5563" />
                        <span style={{ fontSize: '0.85rem', color: '#4b5563' }}>Search academic records...</span>
                     </div>
                     <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}></div>
                     </div>
                  </div>

                  {/* Mockup Grid */}
                  <div style={{ padding: '30px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', height: '100%' }}>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        {/* Stats Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                           {[
                             { label: 'Active Students', val: '2,482', change: '+12%', color: '#6366f1' },
                             { label: 'Avg. Attendance', val: '94.2%', change: '+2.4%', color: '#10b981' },
                             { label: 'Revenue (MTD)', val: '₹84,200', change: '+8.1%', color: '#ec4899' }
                           ].map((stat, i) => (
                             <div key={i} style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4b5563', textTransform: 'uppercase', marginBottom: '8px' }}>{stat.label}</p>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                   <h4 style={{ fontSize: '1.5rem', fontWeight: 900 }}>{stat.val}</h4>
                                   <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>{stat.change}</span>
                                </div>
                                <motion.div 
                                  animate={{ width: ['20%', '60%', '40%', '80%'] }}
                                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                  style={{ height: '4px', backgroundColor: stat.color, borderRadius: '2px', marginTop: '16px', opacity: 0.3 }}
                                />
                             </div>
                           ))}
                        </div>

                        {/* Chart Area */}
                        <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', padding: '30px', position: 'relative', overflow: 'hidden' }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                              <h5 style={{ fontWeight: 800 }}>Performance Analytics</h5>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                 <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#6366f1' }}></div>
                                 <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#ec4899' }}></div>
                              </div>
                           </div>
                           <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '150px', display: 'flex', alignItems: 'flex-end', gap: '12px', padding: '0 30px 30px' }}>
                              {[40, 70, 45, 90, 65, 80, 50, 75, 60, 85, 45, 95].map((h, i) => (
                                <motion.div 
                                  key={i}
                                  initial={{ height: 0 }}
                                  animate={{ height: `${h}%` }}
                                  transition={{ delay: i * 0.05, duration: 1 }}
                                  style={{ flex: 1, backgroundColor: i % 2 === 0 ? '#6366f1' : '#ec4899', opacity: 0.2, borderRadius: '4px 4px 0 0' }}
                                />
                              ))}
                           </div>
                        </div>
                     </div>

                     {/* Sidebar Panels */}
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <div style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                           <h5 style={{ fontWeight: 800, marginBottom: '20px' }}>Recent Alerts</h5>
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              {[
                                { title: 'New Admission', time: '2m ago', color: '#6366f1' },
                                { title: 'Fee Payment', time: '15m ago', color: '#10b981' },
                                { title: 'Exam Scheduled', time: '1h ago', color: '#f59e0b' }
                              ].map((alert, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                   <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: alert.color }}></div>
                                   <div style={{ flex: 1 }}>
                                      <p style={{ fontSize: '0.8rem', fontWeight: 700, margin: 0 }}>{alert.title}</p>
                                      <p style={{ fontSize: '0.7rem', color: '#4b5563', margin: 0 }}>{alert.time}</p>
                                   </div>
                                </div>
                              ))}
                           </div>
                        </div>
                        <div style={{ flex: 1, padding: '24px', backgroundColor: 'rgba(99, 102, 241, 0.05)', borderRadius: '24px', border: '1px solid rgba(99, 102, 241, 0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                            <Zap size={32} color="#6366f1" style={{ marginBottom: '16px' }} />
                            <h6 style={{ fontWeight: 800, marginBottom: '8px' }}>AI Insights Ready</h6>
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Predictive analysis for Grade 12 is complete.</p>
                            <button style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#6366f1', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 800, fontSize: '0.75rem' }}>View Report</button>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Mockup Floating Badge */}
               <motion.div 
                 animate={{ y: [0, -10, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                 style={{ position: 'absolute', top: '100px', right: '40px', padding: '12px 20px', backgroundColor: '#030712', border: '1px solid #10b981', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
               >
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981' }}>LIVE UPDATES</span>
               </motion.div>
            </div>
         </div>
      </section>

      {/* Values & Vision */}
      <section style={{ padding: '140px 8%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '100px', alignItems: 'center' }}>
         <div>
            <span style={{ color: '#ec4899', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>Our Ethos</span>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 950, margin: '24px 0', lineHeight: 1.1 }}>More than Software. <br/>A Partnership.</h2>
            <p style={{ fontSize: '1.2rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: '40px' }}>
              We believe technology should empower educators, not overwhelm them. 
              Our mission is to eliminate administrative friction so you can focus on what matters most: the students.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
               <div>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '8px' }}>99.9%</h4>
                  <p style={{ color: '#4b5563', fontWeight: 700 }}>Service Reliability</p>
               </div>
               <div>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '8px' }}>24/7</h4>
                  <p style={{ color: '#4b5563', fontWeight: 700 }}>Elite Support</p>
               </div>
            </div>
         </div>
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {[
               { icon: <ShieldCheck />, title: 'Security', color: '#6366f1' },
               { icon: <Zap />, title: 'Performance', color: '#8b5cf6' },
               { icon: <Users />, title: 'Community', color: '#ec4899' },
               { icon: <Globe />, title: 'Global', color: '#f59e0b' }
            ].map((card, i) => (
               <div key={i} style={{ padding: '40px', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', textAlign: 'center' }}>
                  <div style={{ color: card.color, marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>{card.icon}</div>
                  <h4 style={{ fontWeight: 800 }}>{card.title}</h4>
               </div>
            ))}
         </div>
      </section>



      <Footer shareTitle="EduPro Elite Features" newsletterId="newsletter-email-about" />
    </div>
  );
};

export default AboutSchool;
