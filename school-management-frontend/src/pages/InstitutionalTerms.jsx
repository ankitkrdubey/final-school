import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, Scale, Gavel, ChevronLeft, Shield } from 'lucide-react';
import Footer from '../components/Footer';

const InstitutionalTerms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const clauses = [
    {
      icon: <Scale size={24} />,
      title: 'SaaS Service Agreement',
      content: 'By utilizing the EduPro Elite OS, institutions agree to the professional standards of pedagogical management and administrative integrity outlined in our master service agreement.'
    },
    {
      icon: <Gavel size={24} />,
      title: 'Institutional Responsibility',
      content: 'Institutions are responsible for maintaining the accuracy of student records and ensuring that administrative credentials are kept within authorized institutional circles.'
    },
    {
      icon: <Shield size={24} />,
      title: 'Ethical AI Usage',
      content: 'The use of AI insights for student evaluation must be governed by institutional ethics committees. EduPro Elite provides the tools; the institution provides the oversight.'
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
          <div style={{ display: 'inline-flex', padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '16px', marginBottom: '24px' }}>
            <FileText size={32} />
          </div>
          <h1 style={{ fontSize: '4rem', fontWeight: 950, color: 'white', marginBottom: '24px', letterSpacing: '-2px' }}>Service Tiers & Terms.</h1>
          <p style={{ fontSize: '1.25rem', lineHeight: 1.6, maxWidth: '700px', margin: '0 auto' }}>
            Operating at the pinnacle of institutional management requires a clear framework of legal and operational excellence. 
            These terms define the partnership between EduPro Elite and your institution.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginBottom: '120px' }}>
          {clauses.map((item, i) => (
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
              <div style={{ color: '#ef4444', marginBottom: '24px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white', marginBottom: '16px' }}>{item.title}</h3>
              <p style={{ lineHeight: 1.8, fontSize: '1rem' }}>{item.content}</p>
            </motion.div>
          ))}
        </div>

        <section style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '80px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 950, color: 'white', marginBottom: '48px' }}>Standard Provisions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px' }}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {[
                  'Subscription auto-renewal every 12 months unless terminated.',
                  'Data portability is guaranteed upon institutional exit.',
                  'Service Level Agreement (SLA) of 99.9% monthly uptime.',
                  'Unlimited technical support for administrative personnel.'
                ].map((text, i) => (
                  <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                     <CheckCircle size={20} color="#10b981" />
                     <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{text}</span>
                  </div>
                ))}
             </div>
             <div style={{ padding: '40px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ color: 'white', fontWeight: 800, marginBottom: '20px' }}>Termination & Transition</h4>
                <p style={{ lineHeight: 1.8 }}>Institutions may terminate their service agreement with a 60-day notice. EduPro Elite ensures a seamless transition period where all institutional records are provided in standard CSV and JSON formats to ensure zero data loss.</p>
             </div>
          </div>
        </section>
      </main>

      <Footer shareTitle="EduPro Institutional Terms" newsletterId="newsletter-email-terms" />
    </div>
  );
};

export default InstitutionalTerms;
