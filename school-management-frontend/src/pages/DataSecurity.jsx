import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Database, Lock, ChevronLeft, Globe, Zap, Server } from 'lucide-react';
import Footer from '../components/Footer';

const DataSecurity = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const infrastructure = [
    {
      icon: <Server size={24} />,
      title: 'Military-Grade Infrastructure',
      content: 'Our servers are housed in Tier-4 data centers with 99.99% uptime and physical security protocols equivalent to federal institutions.'
    },
    {
      icon: <Lock size={24} />,
      title: 'End-to-End Encryption',
      content: 'Every byte of data, from student transcripts to financial ledgers, is encrypted using AES-256 and TLS 1.3 standards.'
    },
    {
      icon: <Database size={24} />,
      title: 'Redundant Backups',
      content: 'Real-time multi-regional data mirroring ensures that your institution can recover from any eventuality within minutes.'
    }
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
          <div style={{ display: 'inline-flex', padding: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '16px', marginBottom: '24px' }}>
            <Database size={32} />
          </div>
          <h1 style={{ fontSize: '4rem', fontWeight: 950, color: 'white', marginBottom: '24px', letterSpacing: '-2px' }}>Security Architecture.</h1>
          <p style={{ fontSize: '1.25rem', lineHeight: 1.6, maxWidth: '700px', margin: '0 auto' }}>
            The EduPro Elite ecosystem is fortified with the most advanced security stack in the educational technology sector. 
            We protect your institution’s integrity with uncompromising precision.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginBottom: '120px' }}>
          {infrastructure.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{ 
                padding: '48px', backgroundColor: 'rgba(255,255,255,0.02)', 
                borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)',
                position: 'relative', overflow: 'hidden'
              }}
            >
              <div style={{ color: '#10b981', marginBottom: '24px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white', marginBottom: '16px' }}>{item.title}</h3>
              <p style={{ lineHeight: 1.8, fontSize: '1rem' }}>{item.content}</p>
            </motion.div>
          ))}
        </div>

        <section style={{ marginBottom: '120px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
             <div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 950, color: 'white', marginBottom: '24px' }}>Threat Mitigation.</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                   {[
                     { title: 'Intrusion Detection', desc: 'AI-driven monitoring for suspicious behavioral patterns across all access portals.' },
                     { title: 'Brute-Force Shield', desc: 'Adaptive rate-limiting and biometric verification for all administrative logins.' },
                     { title: 'Zero-Knowledge Architecture', desc: 'Your sensitive passwords and private keys are never stored in plain text.' }
                   ].map((t, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '20px' }}>
                         <div style={{ marginTop: '4px' }}><Zap size={18} color="#10b981" /></div>
                         <div>
                            <h5 style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', margin: '0 0 8px' }}>{t.title}</h5>
                            <p style={{ margin: 0, fontSize: '0.95rem' }}>{t.desc}</p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
             <div style={{ backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '48px', padding: '48px', textAlign: 'center' }}>
                <Globe size={120} color="#10b981" style={{ opacity: 0.2, marginBottom: '40px' }} />
                <h4 style={{ color: 'white', fontWeight: 900, fontSize: '1.5rem', marginBottom: '16px' }}>Global Sync Protocol</h4>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.8 }}>Our security updates are pushed globally in real-time. When a vulnerability is identified anywhere in the sector, your institution is patched within seconds.</p>
             </div>
          </div>
        </section>
      </main>

      <Footer shareTitle="EduPro Security Architecture" newsletterId="newsletter-email-security" />
    </div>
  );
};

export default DataSecurity;
