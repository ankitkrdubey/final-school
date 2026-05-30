import React, { useState, useEffect } from 'react';
import { Smartphone, Send, Users, MessageSquare, AlertCircle, Clock, CheckCircle2, Search, Filter, History, X, RefreshCw, PlusCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BulkSMS = () => {
  // Pre-configured recipient sizes
  const audienceDetails = {
    Students: { count: 150, label: 'All Active Students' },
    Parents: { count: 280, label: 'Registered Parents & Guardians' },
    Teachers: { count: 64, label: 'Faculty & Administrative Staff' }
  };

  const initialHistory = [
    { id: 1, date: '2026-05-08', time: '10:30 AM', audience: 'Students', detailLabel: 'Class 10-A', content: 'Reminder: Mathematics Internal Assessment tomorrow.', status: 'Delivered', sent: 45, segments: 1, cost: 0.90 },
    { id: 2, date: '2026-05-05', time: '02:15 PM', audience: 'Parents', detailLabel: 'Parents (Grade 5)', content: 'Summer camp registration is now open.', status: 'Delivered', sent: 120, segments: 1, cost: 2.40 },
    { id: 3, date: '2026-05-01', time: '09:00 AM', audience: 'Teachers', detailLabel: 'All Faculty', content: 'Staff meeting at 4 PM in the main hall.', status: 'Failed', sent: 85, segments: 1, cost: 1.70 },
  ];

  // States
  const [targetAudience, setTargetAudience] = useState('Students');
  const [message, setMessage] = useState('');
  
  const [credits, setCredits] = useState(() => {
    const saved = localStorage.getItem('school_broadcast_credits');
    return saved ? parseInt(saved, 10) : 12450;
  });

  const [broadcastHistory, setBroadcastHistory] = useState(() => {
    const saved = localStorage.getItem('school_broadcast_history');
    return saved ? JSON.parse(saved) : initialHistory;
  });

  const [isSending, setIsSending] = useState(false);
  const [gatewayStatus, setGatewayStatus] = useState('CONNECTED'); // CONNECTED, DISCONNECTED, CONNECTING
  const [toast, setToast] = useState(null);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('school_broadcast_credits', credits.toString());
  }, [credits]);

  useEffect(() => {
    localStorage.setItem('school_broadcast_history', JSON.stringify(broadcastHistory));
  }, [broadcastHistory]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Derived SMS metrics
  const charLimit = 160;
  const charsUsed = message.length;
  // Multi-part SMS logic: 1 segment is up to 160. Thereafter, segmented into chunks of 153 chars
  const segments = charsUsed === 0 ? 0 : (charsUsed <= charLimit ? 1 : Math.ceil(charsUsed / 153));
  const recipientsCount = audienceDetails[targetAudience].count;
  const creditsNeeded = recipientsCount * segments;
  const estimatedCost = (creditsNeeded * 0.02).toFixed(2);

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      showToast('Please type your broadcast message', 'error');
      return;
    }
    if (gatewayStatus !== 'CONNECTED') {
      showToast('SMS Gateway is currently offline. Please reconnect.', 'error');
      return;
    }
    if (credits < creditsNeeded) {
      showToast('Insufficient SMS credits. Please top up your balance.', 'error');
      return;
    }

    setIsSending(true);

    // Simulate API request to SMS gateway
    setTimeout(() => {
      const newBroadcast = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        audience: targetAudience,
        detailLabel: audienceDetails[targetAudience].label,
        content: message,
        status: 'Delivered',
        sent: recipientsCount,
        segments: segments,
        cost: parseFloat(estimatedCost)
      };

      setBroadcastHistory([newBroadcast, ...broadcastHistory]);
      setCredits(prev => prev - creditsNeeded);
      setMessage('');
      setIsSending(false);
      showToast(`Broadcast successfully sent to ${recipientsCount} recipients!`, 'success');
    }, 1800);
  };

  const handleTestGateway = () => {
    if (gatewayStatus === 'CONNECTING') return;

    setGatewayStatus('CONNECTING');
    showToast('Testing SMS Gateway latency...', 'success');

    setTimeout(() => {
      setGatewayStatus('CONNECTED');
      showToast('Gateway Connected. Average Ping: 38ms', 'success');
    }, 1200);
  };

  const toggleGatewayStatus = () => {
    if (gatewayStatus === 'CONNECTED') {
      setGatewayStatus('DISCONNECTED');
      showToast('Gateway disconnected manually.', 'error');
    } else {
      setGatewayStatus('CONNECTING');
      setTimeout(() => {
        setGatewayStatus('CONNECTED');
        showToast('Gateway connection re-established!', 'success');
      }, 1000);
    }
  };

  const handlePurchaseCredits = (pkg) => {
    if (!pkg) return;
    setCredits(prev => prev + pkg.sms);
    setShowTopUpModal(false);
    setSelectedPackage(null);
    showToast(`Successfully added ${pkg.sms.toLocaleString()} credits to your account!`, 'success');
  };

  const topUpPackages = [
    { id: 1, sms: 2000, price: 19.99, title: 'Starter Booster' },
    { id: 2, sms: 5000, price: 44.99, title: 'Standard Pack', popular: true },
    { id: 3, sms: 15000, price: 119.99, title: 'Enterprise Bundle' }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Bulk SMS & Broadcasting</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Send urgent alerts and mass announcements directly to mobile devices via SMS gateway.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <div 
             onClick={toggleGatewayStatus}
             title="Click to toggle gateway connection status"
             style={{ 
               padding: '12px 20px', 
               backgroundColor: 'var(--bg-card)', 
               borderRadius: '12px', 
               border: '1px solid var(--border-color)', 
               display: 'flex', 
               alignItems: 'center', 
               gap: '10px',
               cursor: 'pointer',
               userSelect: 'none',
               transition: '0.2s',
               boxShadow: 'var(--shadow-sm)'
             }}
             onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-light)'}
             onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
           >
              <div style={{ 
                width: '10px', 
                height: '10px', 
                borderRadius: '50%', 
                backgroundColor: gatewayStatus === 'CONNECTED' ? '#10b981' : gatewayStatus === 'CONNECTING' ? '#f59e0b' : '#ef4444',
                animation: gatewayStatus === 'CONNECTING' ? 'pulse 1s infinite' : 'none'
              }}></div>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Gateway: {gatewayStatus}
              </span>
           </div>

           <button 
             onClick={handleTestGateway}
             disabled={gatewayStatus === 'CONNECTING'}
             className="btn"
             style={{ 
               padding: '12px 18px', 
               borderRadius: '12px', 
               backgroundColor: 'var(--bg-card)', 
               border: '1px solid var(--border-color)', 
               color: 'var(--text-main)',
               fontWeight: 700, 
               fontSize: '0.85rem',
               cursor: gatewayStatus === 'CONNECTING' ? 'not-allowed' : 'pointer',
               display: 'flex',
               alignItems: 'center',
               gap: '8px'
             }}
           >
             <RefreshCw size={14} className={gatewayStatus === 'CONNECTING' ? 'spin' : ''} /> Test Latency
           </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
         {/* Compose Section */}
         <div className="card" style={{ padding: '40px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-main)' }}>
               <MessageSquare size={24} className="text-muted" /> Compose Message
            </h3>

            <form onSubmit={handleSendBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
               <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>Target Audience</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                     {Object.keys(audienceDetails).map(type => (
                        <button 
                          type="button"
                          key={type}
                          onClick={() => setTargetAudience(type)}
                          style={{ 
                            padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)', 
                            backgroundColor: targetAudience === type ? 'var(--primary)' : 'var(--bg-body)',
                            color: targetAudience === type ? 'white' : 'var(--text-main)',
                            fontWeight: 800, cursor: 'pointer', transition: '0.2s',
                            boxShadow: targetAudience === type ? '0 8px 16px rgba(99, 102, 241, 0.2)' : 'none'
                          }}
                        >
                           <div style={{ fontSize: '0.95rem' }}>{type}</div>
                           <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '4px', fontWeight: 600 }}>
                             {audienceDetails[type].count} devices
                           </div>
                        </button>
                     ))}
                  </div>
               </div>

               <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>Message Content</label>
                  <div style={{ position: 'relative' }}>
                     <textarea 
                       placeholder="Type your SMS content here..." 
                       rows={6}
                       value={message}
                       onChange={(e) => setMessage(e.target.value)}
                       style={{ 
                         width: '100%', 
                         padding: '16px', 
                         borderRadius: '16px', 
                         border: '1px solid var(--border-color)', 
                         backgroundColor: 'var(--bg-body)', 
                         color: 'var(--text-main)',
                         outline: 'none', 
                         resize: 'none', 
                         fontSize: '1rem', 
                         lineHeight: '1.6',
                         fontWeight: 500
                       }}
                     ></textarea>
                     <div style={{ 
                       position: 'absolute', 
                       bottom: '12px', 
                       right: '12px', 
                       fontSize: '0.75rem', 
                       color: charsUsed > charLimit ? 'var(--danger)' : 'var(--text-muted)', 
                       fontWeight: 800,
                       backgroundColor: 'var(--bg-card)',
                       padding: '2px 8px',
                       borderRadius: '6px',
                       border: '1px solid var(--border-color)'
                     }}>
                        {charsUsed} / {charLimit} Chars ({segments} SMS Segment{segments !== 1 ? 's' : ''})
                     </div>
                  </div>
               </div>

               {/* Dynamically Computed Rate Panel */}
               <div style={{ 
                 display: 'flex', 
                 alignItems: 'center', 
                 gap: '12px', 
                 padding: '16px', 
                 backgroundColor: credits < creditsNeeded ? 'rgba(239, 68, 68, 0.05)' : 'rgba(245, 158, 11, 0.05)', 
                 borderRadius: '16px', 
                 border: credits < creditsNeeded ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)', 
                 color: credits < creditsNeeded ? 'var(--danger)' : '#b45309' 
               }}>
                  <AlertCircle size={20} style={{ flexShrink: 0 }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, lineHeight: '1.4' }}>
                     {credits < creditsNeeded ? (
                       <span>Estimated cost: <strong>{creditsNeeded.toLocaleString()} Credits</strong>. You do not have enough credits to broadcast.</span>
                     ) : (
                       <span>Broadcasting to <strong>{recipientsCount}</strong> recipients requires <strong>{creditsNeeded.toLocaleString()} Credits</strong> (Est. Carrier Rate: ${estimatedCost}).</span>
                     )}
                  </div>
               </div>

               <button 
                 type="submit"
                 disabled={isSending || !message.trim() || credits < creditsNeeded || gatewayStatus !== 'CONNECTED'}
                 className="btn btn-primary" 
                 style={{ 
                   padding: '20px', 
                   borderRadius: '16px', 
                   fontWeight: 900, 
                   display: 'flex', 
                   alignItems: 'center', 
                   justifyContent: 'center', 
                   gap: '12px', 
                   border: 'none',
                   cursor: (isSending || !message.trim() || credits < creditsNeeded || gatewayStatus !== 'CONNECTED') ? 'not-allowed' : 'pointer',
                   opacity: (isSending || !message.trim() || credits < creditsNeeded || gatewayStatus !== 'CONNECTED') ? 0.65 : 1,
                   boxShadow: '0 8px 24px rgba(99, 102, 241, 0.25)',
                   fontSize: '1rem'
                 }}
               >
                  {isSending ? (
                    <>
                      <RefreshCw size={20} className="spin" /> BROADCASTING VIA GATEWAY...
                    </>
                  ) : (
                    <>
                      <Send size={20} /> SEND BROADCAST NOW
                    </>
                  )}
               </button>
            </form>
         </div>

         {/* History Section */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '28px', border: '1px solid var(--border-color)' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)' }}>
                  <History size={18} className="text-muted" /> Recent Activity
               </h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
                  {broadcastHistory.length === 0 ? (
                    <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <Smartphone size={32} style={{ opacity: 0.2, marginBottom: '12px' }} />
                      <p style={{ margin: 0, fontWeight: 700 }}>No broadcast activity logged</p>
                    </div>
                  ) : (
                    broadcastHistory.map(item => (
                       <div 
                         key={item.id} 
                         style={{ 
                           padding: '16px', 
                           borderRadius: '16px', 
                           backgroundColor: 'var(--bg-body)', 
                           border: '1px solid var(--border-color)',
                           transition: 'transform 0.2s',
                         }}
                       >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                             <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase' }}>
                               {item.audience} ({item.sent} Recip.)
                             </span>
                             <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item.date}</span>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-main)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.5' }}>
                            {item.content}
                          </p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: 800, color: item.status === 'Delivered' ? '#10b981' : '#ef4444' }}>
                                {item.status === 'Delivered' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                {item.status} ({item.sent} sent)
                             </div>
                             <button 
                               onClick={() => setSelectedHistoryItem(item)}
                               style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', outline: 'none' }}
                             >
                               View Details
                             </button>
                          </div>
                       </div>
                    ))
                  )}
               </div>
            </div>

            <div className="card" style={{ padding: '28px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
               <Smartphone size={32} className="text-muted" />
               <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Credits Remaining</p>
                  <h4 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 950, color: 'var(--text-main)' }}>
                    {credits.toLocaleString()} <small style={{ fontSize: '0.8rem', opacity: 0.6 }}>SMS</small>
                  </h4>
               </div>
               <button 
                 onClick={() => setShowTopUpModal(true)}
                 className="btn"
                 style={{ 
                   marginTop: '4px',
                   padding: '10px 16px', 
                   borderRadius: '10px', 
                   backgroundColor: 'var(--primary-light)', 
                   color: 'var(--primary)', 
                   fontWeight: 800, 
                   fontSize: '0.8rem',
                   cursor: 'pointer',
                   border: 'none',
                   display: 'flex',
                   alignItems: 'center',
                   gap: '6px',
                   width: '100%',
                   justifyContent: 'center',
                   transition: '0.2s'
                 }}
                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.backgroundColor = 'var(--primary)';
                   e.currentTarget.style.color = 'white';
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.backgroundColor = 'var(--primary-light)';
                   e.currentTarget.style.color = 'var(--primary)';
                 }}
               >
                 <PlusCircle size={14} /> Buy SMS Credits
               </button>
            </div>
         </div>
      </div>

      {/* History Details Modal */}
      <AnimatePresence>
        {selectedHistoryItem && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: '100%', maxWidth: '500px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', padding: '32px', boxShadow: 'var(--shadow-2xl)', border: '1px solid var(--border-color)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                 <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>Broadcast Activity Details</h3>
                 <button onClick={() => setSelectedHistoryItem(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                    <X size={20} />
                 </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-main)' }}>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', backgroundColor: 'var(--bg-body)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                    <div>
                       <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Audience</span>
                       <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{selectedHistoryItem.audience}</span>
                    </div>
                    <div>
                       <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Delivered Devices</span>
                       <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{selectedHistoryItem.sent} Accounts</span>
                    </div>
                    <div>
                       <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Time Dispatched</span>
                       <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{selectedHistoryItem.time}</span>
                    </div>
                    <div>
                       <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Date Sent</span>
                       <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{selectedHistoryItem.date}</span>
                    </div>
                 </div>

                 <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Broadcast Message</span>
                    <div style={{ backgroundColor: 'var(--bg-body)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', fontSize: '0.9rem', lineHeight: '1.6', whiteSpace: 'pre-line', fontWeight: 500 }}>
                       {selectedHistoryItem.content}
                    </div>
                 </div>

                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-body)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                       <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>SMS Segments</span>
                       <span style={{ fontSize: '1rem', fontWeight: 900 }}>{selectedHistoryItem.segments || 1} Part{selectedHistoryItem.segments !== 1 ? 's' : ''}</span>
                    </div>
                    <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-body)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                       <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Broadcast Cost</span>
                       <span style={{ fontSize: '1rem', fontWeight: 900 }}>${(selectedHistoryItem.cost || 0).toFixed(2)}</span>
                    </div>
                 </div>

                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', backgroundColor: selectedHistoryItem.status === 'Delivered' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)', borderRadius: '12px', border: selectedHistoryItem.status === 'Delivered' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)', color: selectedHistoryItem.status === 'Delivered' ? '#10b981' : '#ef4444', fontSize: '0.8rem', fontWeight: 800 }}>
                    {selectedHistoryItem.status === 'Delivered' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    <span>Status: Gateway Response Success — {selectedHistoryItem.status}</span>
                 </div>

                 <button 
                   onClick={() => setSelectedHistoryItem(null)} 
                   className="btn btn-primary" 
                   style={{ width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', border: 'none', marginTop: '4px' }}
                 >
                    Close Log
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Buy SMS Credits Modal */}
      <AnimatePresence>
        {showTopUpModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: '100%', maxWidth: '550px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', padding: '36px', boxShadow: 'var(--shadow-2xl)', border: '1px solid var(--border-color)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                 <div>
                   <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 4px 0' }}>Top Up Gateway Credits</h3>
                   <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Top up instant SMS credits for the centralized broadcasting gateway.</p>
                 </div>
                 <button onClick={() => setShowTopUpModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', alignSelf: 'flex-start' }}>
                    <X size={20} />
                 </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                   {topUpPackages.map(pkg => (
                     <div 
                       key={pkg.id}
                       onClick={() => setSelectedPackage(pkg)}
                       style={{ 
                         padding: '20px', 
                         borderRadius: '16px', 
                         border: selectedPackage?.id === pkg.id ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                         backgroundColor: selectedPackage?.id === pkg.id ? 'rgba(99, 102, 241, 0.03)' : 'var(--bg-body)',
                         cursor: 'pointer',
                         display: 'flex',
                         justifyContent: 'space-between',
                         alignItems: 'center',
                         transition: '0.2s',
                         position: 'relative',
                         boxShadow: selectedPackage?.id === pkg.id ? 'var(--shadow-md)' : 'none'
                       }}
                     >
                       {pkg.popular && (
                         <span style={{ position: 'absolute', top: '-10px', right: '20px', backgroundColor: 'var(--primary)', color: 'white', fontSize: '0.65rem', fontWeight: 900, padding: '2px 10px', borderRadius: '20px', textTransform: 'uppercase' }}>
                           Best Value
                         </span>
                       )}
                       <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                         <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           {selectedPackage?.id === pkg.id && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>}
                         </div>
                         <div>
                           <h5 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>{pkg.title}</h5>
                           <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>+{pkg.sms.toLocaleString()} Credits</span>
                         </div>
                       </div>
                       <div style={{ textAlign: 'right' }}>
                         <span style={{ fontSize: '1.2rem', fontWeight: 950, color: 'var(--text-main)' }}>${pkg.price}</span>
                       </div>
                     </div>
                   ))}
                 </div>

                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '14px', marginTop: '12px' }}>
                    <button 
                      onClick={() => setShowTopUpModal(false)}
                      className="btn"
                      style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: 800, cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handlePurchaseCredits(selectedPackage)}
                      disabled={!selectedPackage}
                      className="btn btn-primary"
                      style={{ 
                        padding: '14px', 
                        borderRadius: '12px', 
                        fontWeight: 900, 
                        cursor: selectedPackage ? 'pointer' : 'not-allowed', 
                        opacity: selectedPackage ? 1 : 0.6,
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <Check size={16} /> Purchase Package
                    </button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: '1.4', flex: 1 }}>{toast.message}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BulkSMS;
