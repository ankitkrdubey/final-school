import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Globe, Zap, ChevronLeft, Server, Database, MessageSquare } from 'lucide-react';
import Footer from '../components/Footer';

const SystemStatus = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [uptime] = useState(99.99);
  
  const services = [
    { name: 'Core API Engine', status: 'Operational', latency: '42ms', icon: <Zap size={20} /> },
    { name: 'Institutional Database', status: 'Operational', latency: '12ms', icon: <Database size={20} /> },
    { name: 'AI Prediction Models', status: 'Operational', latency: '156ms', icon: <Activity size={20} /> },
    { name: 'Messaging Gateways', status: 'Operational', latency: '85ms', icon: <MessageSquare size={20} /> },
    { name: 'Document CDN', status: 'Operational', latency: '28ms', icon: <Server size={20} /> },
    { name: 'Auth & Identity', status: 'Operational', latency: '18ms', icon: <ShieldCheck size={20} /> }
  ];

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: '#94a3b8', fontFamily: 'var(--font-main)' }}>
      {/* Mini Header */}
      <nav style={{ height: '80px', display: 'flex', alignItems: 'center', padding: '0 8%', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'white' }}>
          <ChevronLeft size={20} />
          <span style={{ fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Back to Home</span>
        </Link>
      </nav>

      <main style={{ padding: '120px 8%', maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '100px' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '8px 24px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '30px', marginBottom: '24px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 12px #10b981' }}></div>
            <span style={{ fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>All Systems Operational</span>
          </div>
          <h1 style={{ fontSize: '4.5rem', fontWeight: 950, color: 'white', marginBottom: '24px', letterSpacing: '-3px' }}>Real-time Health.</h1>
          <p style={{ fontSize: '1.25rem', lineHeight: 1.6, maxWidth: '700px', margin: '0 auto' }}>
            Monitor the pulse of the EduPro Elite infrastructure. We maintain transparency across every global data node.
          </p>
        </motion.div>

        {/* Uptime Hero Card */}
        <div style={{ 
          padding: '60px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '48px', 
          border: '1px solid rgba(255,255,255,0.05)', marginBottom: '80px', textAlign: 'center'
        }}>
           <div style={{ fontSize: '1rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px' }}>System Uptime (90 Days)</div>
           <div style={{ fontSize: '6rem', fontWeight: 950, color: 'white', letterSpacing: '-4px', lineHeight: 1 }}>{uptime}%</div>
           <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginTop: '40px' }}>
              {[...Array(60)].map((_, i) => (
                <div key={i} style={{ width: '6px', height: '32px', backgroundColor: '#10b981', borderRadius: '3px', opacity: Math.random() > 0.05 ? 1 : 0.2 }}></div>
              ))}
           </div>
        </div>

        {/* Services Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '120px' }}>
          {services.map((service, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              style={{ 
                padding: '32px', backgroundColor: 'rgba(255,255,255,0.01)', 
                borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                 <div style={{ color: '#4f46e5' }}>{service.icon}</div>
                 <div>
                    <h4 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{service.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: '#4b5563', fontWeight: 700 }}>Latency: {service.latency}</span>
                 </div>
              </div>
              <div style={{ padding: '6px 14px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 900 }}>
                 {service.status}
              </div>
            </motion.div>
          ))}
        </div>

        <section style={{ padding: '80px', backgroundColor: 'rgba(79, 70, 229, 0.05)', borderRadius: '48px', border: '1px solid rgba(79, 70, 229, 0.1)', textAlign: 'center' }}>
           <Globe size={64} color="#4f46e5" style={{ marginBottom: '32px' }} />
           <h3 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', marginBottom: '20px' }}>Global Edge Network</h3>
           <p style={{ maxWidth: '600px', margin: '0 auto', lineHeight: 1.8 }}>Our infrastructure is distributed across 24 global regions to ensure that institutional data is processed as close to the campus as possible, minimizing latency and maximizing security.</p>
        </section>
      </main>

      <Footer shareTitle="EduPro System Status" newsletterId="newsletter-email-status" />
    </div>
  );
};

export default SystemStatus;
