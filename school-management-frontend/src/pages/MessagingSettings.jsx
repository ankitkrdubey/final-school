import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Mail, Zap, Key, ShieldCheck, 
  Smartphone, Send, Settings, CheckCircle2, 
  AlertCircle, Info, ExternalLink, Save, RefreshCw, Eye, EyeOff,
  Bell, Layout, Plus, Trash2, Edit3, MessageCircle,
  X, Sparkles, Terminal, Activity, Server, Wifi, AlertTriangle
} from 'lucide-react';

const MessagingSettings = () => {
  const [activeTab, setActiveTab] = useState('sms');
  const [isSaving, setIsSaving] = useState(false);

  // Separate configurations for each provider state
  const [smsConfigs, setSmsConfigs] = useState(() => {
    const saved = localStorage.getItem('school_messaging_hub_sms');
    return saved ? JSON.parse(saved) : {
      Twilio: { sid: 'AC739485293481023948', token: '8203948572834910234857', senderId: 'EDUPRO' },
      Vonage: { apiKey: 'vn_92834810', apiSecret: '839284729384729384', senderNo: '+15552345' },
      Plivo: { authId: 'pl_029348239', authToken: '8392847293847293847', sourceNo: '+15558932' }
    };
  });

  const [emailConfigs, setEmailConfigs] = useState(() => {
    const saved = localStorage.getItem('school_messaging_hub_email');
    return saved ? JSON.parse(saved) : {
      SendGrid: { apiKey: 'SG.8293482934.829348239', fromEmail: 'notifications@edupro.school', fromName: 'EduPro Elite Portal' },
      'AWS SES': { accessKey: 'AKIA9283481023', secretKey: '8392847293847293847293847', fromEmail: 'alerts@edupro.school', region: 'us-east-1' },
      Mailgun: { privateKey: 'key-82934829348', domain: 'mg.edupro.school', fromEmail: 'support@edupro.school' }
    };
  });

  const [whatsappConfigs, setWhatsappConfigs] = useState(() => {
    const saved = localStorage.getItem('school_messaging_hub_whatsapp');
    return saved ? JSON.parse(saved) : {
      'Meta Business': { phoneId: '109283481023', token: 'EAA829348293482394823948239', wabaId: 'act_2938471923' },
      'Twilio WA': { sid: 'AC739485293481023948', token: '8203948572834910234857', senderNo: '+14155238886' },
      Gupshup: { appName: 'EduProWA', apiKey: 'gs_82934829348', sourceNo: '+15559023' }
    };
  });

  const [pushConfigs, setPushConfigs] = useState(() => {
    const saved = localStorage.getItem('school_messaging_hub_push');
    return saved ? JSON.parse(saved) : {
      Firebase: { apiKey: 'AIzaSy82934829348', appId: '1:49283481023:web:8293', projectId: 'edupro-push-fcm' },
      OneSignal: { appId: 'os-829348-2934-8239', apiKey: 'os_829348293482394823', safariWebId: 'web.onesignal.auto.8293' }
    };
  });

  // Active providers state
  const [selectedProviders, setSelectedProviders] = useState(() => {
    const saved = localStorage.getItem('school_messaging_hub_providers');
    return saved ? JSON.parse(saved) : {
      sms: 'Twilio',
      email: 'SendGrid',
      whatsapp: 'Meta Business',
      push: 'Firebase'
    };
  });

  // Templates state
  const [templates, setTemplates] = useState(() => {
    const saved = localStorage.getItem('school_messaging_hub_templates');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Attendance Alert', channel: 'SMS', content: 'Dear Parent, {student_name} was marked absent on {date}.' },
      { id: 2, name: 'Fee Reminder', channel: 'WhatsApp', content: 'Hello! This is a reminder for {student_name}\'s pending fees of {amount}.' },
      { id: 3, name: 'Grade Report', channel: 'Email', content: 'The report card for {term} is now available in the portal.' }
    ];
  });

  // Test Connection Form States
  const [testRecipient, setTestRecipient] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);

  // Template Form / Modal States
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [tempFormData, setTempFormData] = useState({ name: '', channel: 'SMS', content: '' });
  const [editingTemplateId, setEditingTemplateId] = useState(null);

  // Interactive Diagnostics & Logs states
  const [showLogsDrawer, setShowLogsDrawer] = useState(false);
  const [logs, setLogs] = useState([
    { time: '09:12:04', level: 'info', text: 'Omnichannel routing daemon successfully initialized.' },
    { time: '09:12:05', level: 'success', text: 'SMS gateway Twilio authenticated via Account SID AC7394...' },
    { time: '09:12:06', level: 'success', text: 'Email client SendGrid connected. SMTP handshake verified (250 OK).' },
    { time: '09:12:08', level: 'success', text: 'Meta WhatsApp Business secure webhooks successfully established.' },
    { time: '09:12:10', level: 'success', text: 'Firebase Cloud Messaging push tokens synced with 1,240 clients.' }
  ]);

  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [showDiagnosticsModal, setShowDiagnosticsModal] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState(null);

  const logsEndRef = useRef(null);

  // Auto-scroll logs terminal
  useEffect(() => {
    if (showLogsDrawer) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, showLogsDrawer]);

  // Local Toast System
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success', action = null) => {
    setToast({ message, type, action });
  };
  useEffect(() => {
    if (toast) {
      const duration = toast.action ? 6000 : 4000;
      const timer = setTimeout(() => setToast(null), duration);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Sync state to local storage on save
  const handleSave = () => {
    setIsSaving(true);
    showToast('Syncing configurations across omnichannel nodes...', 'info');
    
    // Add transaction log entry
    addLog('info', 'Synchronizing configuration changes across cloud database clusters...');

    setTimeout(() => {
      localStorage.setItem('school_messaging_hub_sms', JSON.stringify(smsConfigs));
      localStorage.setItem('school_messaging_hub_email', JSON.stringify(emailConfigs));
      localStorage.setItem('school_messaging_hub_whatsapp', JSON.stringify(whatsappConfigs));
      localStorage.setItem('school_messaging_hub_push', JSON.stringify(pushConfigs));
      localStorage.setItem('school_messaging_hub_providers', JSON.stringify(selectedProviders));
      localStorage.setItem('school_messaging_hub_templates', JSON.stringify(templates));

      setIsSaving(false);
      showToast('Messaging configurations saved and persisted successfully!', 'success');
      addLog('success', 'Omnichannel settings written successfully. Client configurations reloaded.');
    }, 1500);
  };

  const addLog = (level, text) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [...prev, { time: timeStr, level, text }]);
  };

  const handleSendTest = () => {
    if (!testRecipient.trim()) {
      showToast('Please enter a valid test recipient email or phone number.', 'error');
      return;
    }
    setIsSendingTest(true);
    const activeProvider = selectedProviders[activeTab];
    showToast(`Sending test dispatch via ${activeProvider}...`, 'info');
    addLog('info', `Dispatched connection packet via ${activeProvider} provider to: ${testRecipient}`);

    setTimeout(() => {
      setIsSendingTest(false);
      showToast(`Test message successfully delivered to ${testRecipient}!`, 'success');
      addLog('success', `Test delivery packet confirmed by ${activeProvider} broker (HTTP 200 OK).`);
      setTestRecipient('');
    }, 1500);
  };

  const handleDeleteTemplate = (id) => {
    const idx = templates.findIndex(t => t.id === id);
    const item = templates[idx];
    setTemplates(templates.filter(t => t.id !== id));
    
    addLog('warn', `Removed message template "${item.name}" from library registry.`);

    showToast(`Deleted template "${item.name}".`, 'success', {
      label: 'Undo',
      onClick: () => {
        const updated = [...templates];
        updated.splice(idx, 0, item);
        setTemplates(updated);
        localStorage.setItem('school_messaging_hub_templates', JSON.stringify(updated));
        showToast(`Template "${item.name}" restored successfully.`, 'success');
        addLog('success', `Restored message template "${item.name}" to database.`);
      }
    });
  };

  const startEditTemplate = (temp) => {
    setEditingTemplateId(temp.id);
    setTempFormData({
      name: temp.name,
      channel: temp.channel,
      content: temp.content
    });
    setShowTemplateModal(true);
  };

  const handleSaveTemplate = (e) => {
    e.preventDefault();
    if (!tempFormData.name.trim() || !tempFormData.content.trim()) {
      showToast('Please fill out all fields.', 'error');
      return;
    }

    let updatedTemplates;
    if (editingTemplateId) {
      updatedTemplates = templates.map(t => t.id === editingTemplateId ? { ...t, ...tempFormData } : t);
      setTemplates(updatedTemplates);
      showToast(`Template "${tempFormData.name}" updated successfully!`, 'success');
      addLog('success', `Updated template "${tempFormData.name}" configuration state.`);
      setEditingTemplateId(null);
    } else {
      const newTemp = {
        id: Date.now(),
        ...tempFormData
      };
      updatedTemplates = [...templates, newTemp];
      setTemplates(updatedTemplates);
      showToast(`Template "${tempFormData.name}" created successfully!`, 'success');
      addLog('success', `Created new global template "${tempFormData.name}" for channel ${tempFormData.channel}.`);
    }
    
    localStorage.setItem('school_messaging_hub_templates', JSON.stringify(updatedTemplates));
    setShowTemplateModal(false);
    setTempFormData({ name: '', channel: 'SMS', content: '' });
  };

  // Run Gateway Diagnostic Scanning Simulation
  const runGatewayDiagnostics = () => {
    setIsScanning(true);
    setScanStep(0);
    addLog('info', 'Starting comprehensive omnichannel integration diagnostics scan...');

    const interval = setInterval(() => {
      setScanStep(prev => {
        const next = prev + 1;
        if (next === 1) addLog('success', `[SMS] ping success to ${selectedProviders.sms} (Latency: 28ms).`);
        if (next === 2) addLog('success', `[Email] SMTP verification to ${selectedProviders.email} (Latency: 34ms).`);
        if (next === 3) addLog('success', `[WhatsApp] webhooks connection to ${selectedProviders.whatsapp} (Latency: 41ms).`);
        if (next === 4) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
            setDiagnosticResults([
              { channel: 'SMS Gateway', provider: selectedProviders.sms, ping: '28ms', status: 'Healthy', details: 'All shortcode routing queues operational.' },
              { channel: 'Email API Client', provider: selectedProviders.email, ping: '34ms', status: 'Healthy', details: 'DKIM, SPF alignments match institutional DNS.' },
              { channel: 'WhatsApp Cloud API', provider: selectedProviders.whatsapp, ping: '41ms', status: 'Operational', details: 'Meta certificate verified. Webhook responsive.' },
              { channel: 'Push Notify Engine', provider: selectedProviders.push, ping: '18ms', status: 'Healthy', details: 'APNS and FCM certificates active for mobile nodes.' }
            ]);
            setShowDiagnosticsModal(true);
            showToast('Gateway diagnostic audit successfully completed!', 'success');
            addLog('success', 'Omnichannel diagnostics completed successfully. Status: 100% HEALTHY.');
          }, 400);
          return 4;
        }
        return next;
      });
    }, 600);
  };

  // Diagnostic Audit Download File Simulator
  const downloadDiagnosticReport = () => {
    showToast('Compiling secure system audit report...', 'success');
    setTimeout(() => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(diagnosticResults, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `gateway_audit_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Diagnostic audit report downloaded successfully!', 'success');
    }, 1000);
  };

  const gateways = {
    sms: [
      { name: 'Twilio', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Twilio-logo-red.svg' },
      { name: 'Vonage', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Vonage_Logo.svg' },
      { name: 'Plivo', logo: 'https://raw.githubusercontent.com/gilbarbara/logos/master/logos/plivo.svg' }
    ],
    email: [
      { name: 'SendGrid', logo: 'https://raw.githubusercontent.com/gilbarbara/logos/master/logos/sendgrid-icon.svg' },
      { name: 'AWS SES', logo: 'https://raw.githubusercontent.com/gilbarbara/logos/master/logos/aws.svg' },
      { name: 'Mailgun', logo: 'https://raw.githubusercontent.com/gilbarbara/logos/master/logos/mailgun-icon.svg' }
    ],
    whatsapp: [
      { name: 'Meta Business', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },
      { name: 'Twilio WA', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Twilio-logo-red.svg' },
      { name: 'Gupshup', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Gupshup_Logo.png' }
    ],
    push: [
      { name: 'Firebase', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Firebase_Logo.svg' },
      { name: 'OneSignal', logo: 'https://raw.githubusercontent.com/gilbarbara/logos/master/logos/onesignal.svg' }
    ]
  };

  return (
    <div style={{ padding: '40px', backgroundColor: 'var(--bg-body)', minHeight: '100vh', fontFamily: 'var(--font-main)' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-1.5px', marginBottom: '8px' }}>
            Messaging <span style={{ color: 'var(--primary)' }}>Hub</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500 }}>Omnichannel communication infrastructure for your institution.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setShowLogsDrawer(!showLogsDrawer)}
            style={{ 
              padding: '14px 24px', borderRadius: '16px', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', 
              border: '1px solid var(--border-color)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', 
              cursor: 'pointer', transition: '0.3s'
            }}
          >
            <Terminal size={18} />
            {showLogsDrawer ? 'Close Console' : 'Integration Logs'}
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            style={{ 
              padding: '14px 32px', borderRadius: '16px', backgroundColor: 'var(--primary)', color: 'white', 
              border: 'none', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px', 
              cursor: 'pointer', boxShadow: '0 10px 20px rgba(79, 70, 229, 0.2)', transition: '0.3s'
            }}
          >
            {isSaving ? <RefreshCw size={20} className="spin" /> : <Save size={20} />}
            {isSaving ? 'Syncing...' : 'Save Configuration'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '40px' }}>
        {/* Left: Tab Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { id: 'sms', name: 'SMS Gateway', icon: <Smartphone size={20} />, desc: 'Text alerts & OTPs' },
            { id: 'email', name: 'Email API', icon: <Mail size={20} />, desc: 'Reports & Invites' },
            { id: 'whatsapp', name: 'WhatsApp', icon: <MessageCircle size={20} />, desc: 'Business Messaging' },
            { id: 'push', name: 'Push Notify', icon: <Bell size={20} />, desc: 'Web & Mobile' }
          ].map((tab) => (
            <div 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ 
                padding: '24px', borderRadius: '24px', backgroundColor: activeTab === tab.id ? 'var(--primary)' : 'var(--bg-card)',
                color: activeTab === tab.id ? 'white' : 'var(--text-main)',
                boxShadow: activeTab === tab.id ? '0 15px 30px rgba(79, 70, 229, 0.2)' : 'var(--shadow-sm)',
                cursor: 'pointer', transition: '0.3s', border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                <div style={{ padding: '10px', backgroundColor: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'var(--bg-body)', borderRadius: '12px' }}>
                  {tab.icon}
                </div>
                <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem' }}>{tab.name}</h4>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', opacity: activeTab === tab.id ? 0.8 : 0.6, fontWeight: 600 }}>{tab.desc}</p>
            </div>
          ))}

          {/* Compliance System Health Card */}
          <div style={{ marginTop: '20px', padding: '32px', borderRadius: '32px', backgroundColor: '#1e293b', color: 'white', display: 'flex', flexDirection: 'column', gap: '20px' }}>
             <h5 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
               <ShieldCheck size={18} color="#10b981" /> System Health
             </h5>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>API Uptime</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981' }}>99.99%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Fail Rate</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f59e0b' }}>0.02%</span>
                </div>
             </div>
             
             <button
               onClick={runGatewayDiagnostics}
               style={{
                 width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
                 backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: 800,
                 fontSize: '0.85rem', cursor: 'pointer', transition: '0.2s', display: 'flex',
                 alignItems: 'center', justifyContent: 'center', gap: '8px'
               }}
               onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.15)'}
               onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
             >
               <Activity size={15} /> Run Diagnostics
             </button>
          </div>
        </div>

        {/* Right: Configuration Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '40px', padding: '48px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)' }}>
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div style={{ marginBottom: '40px' }}>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '8px' }}>
                    {activeTab.toUpperCase()} Integration
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>
                    Select your preferred service provider and configure API authentication.
                  </p>
                </div>

                {/* Provider Selection */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '48px' }}>
                  {gateways[activeTab].map((g) => (
                    <div 
                      key={g.name}
                      onClick={() => {
                        setSelectedProviders({ ...selectedProviders, [activeTab]: g.name });
                        showToast(`Active gateway provider set to ${g.name}.`, 'success');
                        addLog('info', `Active ${activeTab.toUpperCase()} provider changed to ${g.name}.`);
                      }}
                      style={{ 
                        padding: '24px', borderRadius: '24px', border: '2px solid',
                        borderColor: selectedProviders[activeTab] === g.name ? 'var(--primary)' : 'var(--border-color)',
                        backgroundColor: selectedProviders[activeTab] === g.name ? 'var(--primary-light)' : 'transparent',
                        textAlign: 'center', cursor: 'pointer', transition: '0.3s',
                        boxShadow: selectedProviders[activeTab] === g.name ? '0 10px 20px rgba(79,70,229,0.05)' : 'none'
                      }}
                    >
                      <div style={{ height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                        <img 
                          src={g.logo} 
                          alt={g.name} 
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                          style={{ height: '100%', maxWidth: '120px', objectFit: 'contain' }} 
                        />
                        <div style={{ display: 'none', alignItems: 'center', justifyContent: 'center', height: '100%', fontWeight: 900, fontSize: '0.8rem', color: 'var(--primary)' }}>
                          {g.name.toUpperCase()}
                        </div>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>{g.name}</p>
                    </div>
                  ))}
                </div>

                {/* Dynamic Form Based on Active Tab and Provider */}
                <div style={{ display: 'grid', gap: '32px' }}>
                  {activeTab === 'sms' && (
                    <div style={{ display: 'grid', gap: '24px' }}>
                       {selectedProviders.sms === 'Twilio' && (
                         <div style={{ display: 'grid', gap: '24px' }}>
                           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                              <FormInput label="ACCOUNT SID" value={smsConfigs.Twilio.sid} onChange={(e) => setSmsConfigs({ ...smsConfigs, Twilio: { ...smsConfigs.Twilio, sid: e.target.value } })} icon={<Key size={18} />} />
                              <FormInput label="SENDER ID" value={smsConfigs.Twilio.senderId} onChange={(e) => setSmsConfigs({ ...smsConfigs, Twilio: { ...smsConfigs.Twilio, senderId: e.target.value } })} icon={<Smartphone size={18} />} />
                           </div>
                           <FormInput label="AUTH TOKEN" value={smsConfigs.Twilio.token} onChange={(e) => setSmsConfigs({ ...smsConfigs, Twilio: { ...smsConfigs.Twilio, token: e.target.value } })} icon={<Zap size={18} />} type="password" />
                         </div>
                       )}

                       {selectedProviders.sms === 'Vonage' && (
                         <div style={{ display: 'grid', gap: '24px' }}>
                           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                              <FormInput label="VONAGE API KEY" value={smsConfigs.Vonage.apiKey} onChange={(e) => setSmsConfigs({ ...smsConfigs, Vonage: { ...smsConfigs.Vonage, apiKey: e.target.value } })} icon={<Key size={18} />} />
                              <FormInput label="VONAGE SENDER NUMBER" value={smsConfigs.Vonage.senderNo} onChange={(e) => setSmsConfigs({ ...smsConfigs, Vonage: { ...smsConfigs.Vonage, senderNo: e.target.value } })} icon={<Smartphone size={18} />} />
                           </div>
                           <FormInput label="VONAGE API SECRET" value={smsConfigs.Vonage.apiSecret} onChange={(e) => setSmsConfigs({ ...smsConfigs, Vonage: { ...smsConfigs.Vonage, apiSecret: e.target.value } })} icon={<Zap size={18} />} type="password" />
                         </div>
                       )}

                       {selectedProviders.sms === 'Plivo' && (
                         <div style={{ display: 'grid', gap: '24px' }}>
                           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                              <FormInput label="PLIVO AUTH ID" value={smsConfigs.Plivo.authId} onChange={(e) => setSmsConfigs({ ...smsConfigs, Plivo: { ...smsConfigs.Plivo, authId: e.target.value } })} icon={<Key size={18} />} />
                              <FormInput label="PLIVO SOURCE NUMBER" value={smsConfigs.Plivo.sourceNo} onChange={(e) => setSmsConfigs({ ...smsConfigs, Plivo: { ...smsConfigs.Plivo, sourceNo: e.target.value } })} icon={<Smartphone size={18} />} />
                           </div>
                           <FormInput label="PLIVO AUTH TOKEN" value={smsConfigs.Plivo.authToken} onChange={(e) => setSmsConfigs({ ...smsConfigs, Plivo: { ...smsConfigs.Plivo, authToken: e.target.value } })} icon={<Zap size={18} />} type="password" />
                         </div>
                       )}
                    </div>
                  )}

                  {activeTab === 'email' && (
                    <div style={{ display: 'grid', gap: '24px' }}>
                       {selectedProviders.email === 'SendGrid' && (
                         <div style={{ display: 'grid', gap: '24px' }}>
                           <FormInput label="SENDGRID API KEY" value={emailConfigs.SendGrid.apiKey} onChange={(e) => setEmailConfigs({ ...emailConfigs, SendGrid: { ...emailConfigs.SendGrid, apiKey: e.target.value } })} icon={<Key size={18} />} type="password" />
                           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                              <FormInput label="FROM EMAIL" value={emailConfigs.SendGrid.fromEmail} onChange={(e) => setEmailConfigs({ ...emailConfigs, SendGrid: { ...emailConfigs.SendGrid, fromEmail: e.target.value } })} icon={<Mail size={18} />} />
                              <FormInput label="SENDER NAME" value={emailConfigs.SendGrid.fromName} onChange={(e) => setEmailConfigs({ ...emailConfigs, SendGrid: { ...emailConfigs.SendGrid, fromName: e.target.value } })} icon={<Settings size={18} />} />
                           </div>
                         </div>
                       )}

                       {selectedProviders.email === 'AWS SES' && (
                         <div style={{ display: 'grid', gap: '24px' }}>
                           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                              <FormInput label="AWS ACCESS KEY ID" value={emailConfigs['AWS SES'].accessKey} onChange={(e) => setEmailConfigs({ ...emailConfigs, 'AWS SES': { ...emailConfigs['AWS SES'], accessKey: e.target.value } })} icon={<Key size={18} />} />
                              <FormInput label="AWS REGION" value={emailConfigs['AWS SES'].region} onChange={(e) => setEmailConfigs({ ...emailConfigs, 'AWS SES': { ...emailConfigs['AWS SES'], region: e.target.value } })} icon={<Settings size={18} />} />
                           </div>
                           <FormInput label="AWS SECRET ACCESS KEY" value={emailConfigs['AWS SES'].secretKey} onChange={(e) => setEmailConfigs({ ...emailConfigs, 'AWS SES': { ...emailConfigs['AWS SES'], secretKey: e.target.value } })} icon={<Zap size={18} />} type="password" />
                           <FormInput label="VERIFIED FROM EMAIL" value={emailConfigs['AWS SES'].fromEmail} onChange={(e) => setEmailConfigs({ ...emailConfigs, 'AWS SES': { ...emailConfigs['AWS SES'], fromEmail: e.target.value } })} icon={<Mail size={18} />} />
                         </div>
                       )}

                       {selectedProviders.email === 'Mailgun' && (
                         <div style={{ display: 'grid', gap: '24px' }}>
                           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                              <FormInput label="MAILGUN DOMAIN" value={emailConfigs.Mailgun.domain} onChange={(e) => setEmailConfigs({ ...emailConfigs, Mailgun: { ...emailConfigs.Mailgun, domain: e.target.value } })} icon={<Layout size={18} />} />
                              <FormInput label="FROM EMAIL" value={emailConfigs.Mailgun.fromEmail} onChange={(e) => setEmailConfigs({ ...emailConfigs, Mailgun: { ...emailConfigs.Mailgun, fromEmail: e.target.value } })} icon={<Mail size={18} />} />
                           </div>
                           <FormInput label="MAILGUN PRIVATE API KEY" value={emailConfigs.Mailgun.privateKey} onChange={(e) => setEmailConfigs({ ...emailConfigs, Mailgun: { ...emailConfigs.Mailgun, privateKey: e.target.value } })} icon={<Zap size={18} />} type="password" />
                         </div>
                       )}
                    </div>
                  )}

                  {activeTab === 'whatsapp' && (
                    <div style={{ display: 'grid', gap: '24px' }}>
                       {selectedProviders.whatsapp === 'Meta Business' && (
                         <div style={{ display: 'grid', gap: '24px' }}>
                           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                              <FormInput label="PHONE NUMBER ID" value={whatsappConfigs['Meta Business'].phoneId} onChange={(e) => setWhatsappConfigs({ ...whatsappConfigs, 'Meta Business': { ...whatsappConfigs['Meta Business'], phoneId: e.target.value } })} icon={<Smartphone size={18} />} />
                              <FormInput label="BUSINESS ACCOUNT ID (WABA)" value={whatsappConfigs['Meta Business'].wabaId} onChange={(e) => setWhatsappConfigs({ ...whatsappConfigs, 'Meta Business': { ...whatsappConfigs['Meta Business'], wabaId: e.target.value } })} icon={<Settings size={18} />} />
                           </div>
                           <FormInput label="PERMANENT SYSTEM ACCESS TOKEN" value={whatsappConfigs['Meta Business'].token} onChange={(e) => setWhatsappConfigs({ ...whatsappConfigs, 'Meta Business': { ...whatsappConfigs['Meta Business'], token: e.target.value } })} icon={<Zap size={18} />} type="password" />
                         </div>
                       )}

                       {selectedProviders.whatsapp === 'Twilio WA' && (
                         <div style={{ display: 'grid', gap: '24px' }}>
                           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                              <FormInput label="TWILIO ACCOUNT SID" value={whatsappConfigs['Twilio WA'].sid} onChange={(e) => setWhatsappConfigs({ ...whatsappConfigs, 'Twilio WA': { ...whatsappConfigs['Twilio WA'], sid: e.target.value } })} icon={<Key size={18} />} />
                              <FormInput label="WHATSAPP SENDER NUMBER" value={whatsappConfigs['Twilio WA'].senderNo} onChange={(e) => setWhatsappConfigs({ ...whatsappConfigs, 'Twilio WA': { ...whatsappConfigs['Twilio WA'], senderNo: e.target.value } })} icon={<Smartphone size={18} />} />
                           </div>
                           <FormInput label="TWILIO AUTH TOKEN" value={whatsappConfigs['Twilio WA'].token} onChange={(e) => setWhatsappConfigs({ ...whatsappConfigs, 'Twilio WA': { ...whatsappConfigs['Twilio WA'], token: e.target.value } })} icon={<Zap size={18} />} type="password" />
                         </div>
                       )}

                       {selectedProviders.whatsapp === 'Gupshup' && (
                         <div style={{ display: 'grid', gap: '24px' }}>
                           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                              <FormInput label="GUPSHUP APP NAME" value={whatsappConfigs.Gupshup.appName} onChange={(e) => setWhatsappConfigs({ ...whatsappConfigs, Gupshup: { ...whatsappConfigs.Gupshup, appName: e.target.value } })} icon={<Layout size={18} />} />
                              <FormInput label="SOURCE MOBILE NUMBER" value={whatsappConfigs.Gupshup.sourceNo} onChange={(e) => setWhatsappConfigs({ ...whatsappConfigs, Gupshup: { ...whatsappConfigs.Gupshup, sourceNo: e.target.value } })} icon={<Smartphone size={18} />} />
                           </div>
                           <FormInput label="GUPSHUP Enterprise API KEY" value={whatsappConfigs.Gupshup.apiKey} onChange={(e) => setWhatsappConfigs({ ...whatsappConfigs, Gupshup: { ...whatsappConfigs.Gupshup, apiKey: e.target.value } })} icon={<Zap size={18} />} type="password" />
                         </div>
                       )}
                    </div>
                  )}

                  {activeTab === 'push' && (
                    <div style={{ display: 'grid', gap: '24px' }}>
                       {selectedProviders.push === 'Firebase' && (
                         <div style={{ display: 'grid', gap: '24px' }}>
                           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                              <FormInput label="FIREBASE PROJECT ID" value={pushConfigs.Firebase.projectId} onChange={(e) => setPushConfigs({ ...pushConfigs, Firebase: { ...pushConfigs.Firebase, projectId: e.target.value } })} icon={<Settings size={18} />} />
                              <FormInput label="FIREBASE APP ID" value={pushConfigs.Firebase.appId} onChange={(e) => setPushConfigs({ ...pushConfigs, Firebase: { ...pushConfigs.Firebase, appId: e.target.value } })} icon={<Layout size={18} />} />
                           </div>
                           <FormInput label="FCM SERVER / API KEY" value={pushConfigs.Firebase.apiKey} onChange={(e) => setPushConfigs({ ...pushConfigs, Firebase: { ...pushConfigs.Firebase, apiKey: e.target.value } })} icon={<Key size={18} />} type="password" />
                         </div>
                       )}

                       {selectedProviders.push === 'OneSignal' && (
                         <div style={{ display: 'grid', gap: '24px' }}>
                           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                              <FormInput label="ONESIGNAL APP ID" value={pushConfigs.OneSignal.appId} onChange={(e) => setPushConfigs({ ...pushConfigs, OneSignal: { ...pushConfigs.OneSignal, appId: e.target.value } })} icon={<Layout size={18} />} />
                              <FormInput label="SAFARI WEB ID" value={pushConfigs.OneSignal.safariWebId} onChange={(e) => setPushConfigs({ ...pushConfigs, OneSignal: { ...pushConfigs.OneSignal, safariWebId: e.target.value } })} icon={<Settings size={18} />} />
                           </div>
                           <FormInput label="ONESIGNAL REST API KEY" value={pushConfigs.OneSignal.apiKey} onChange={(e) => setPushConfigs({ ...pushConfigs, OneSignal: { ...pushConfigs.OneSignal, apiKey: e.target.value } })} icon={<Key size={18} />} type="password" />
                         </div>
                       )}
                    </div>
                  )}

                  {/* Test Connectivity Module */}
                  <div style={{ marginTop: '16px', padding: '32px', backgroundColor: 'var(--bg-body)', borderRadius: '32px', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-main)' }}>
                      <Send size={18} color="var(--primary)" /> Test Connectivity
                    </h4>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <input 
                          type="text" 
                          placeholder={activeTab === 'email' ? "Enter recipient email (e.g. test@school.edu)" : activeTab === 'push' ? "Enter target Device Token / App ID" : "Enter phone number (e.g. +15550199)"} 
                          value={testRecipient}
                          onChange={(e) => setTestRecipient(e.target.value)}
                          style={{ flex: 1, padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 600 }} 
                        />
                        <button 
                          onClick={handleSendTest}
                          disabled={isSendingTest}
                          style={{ padding: '0 32px', borderRadius: '12px', backgroundColor: isSendingTest ? '#94a3b8' : 'var(--primary)', color: 'white', border: 'none', fontWeight: 800, fontSize: '0.9rem', cursor: isSendingTest ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                          {isSendingTest && <RefreshCw size={16} className="spin" />}
                          {isSendingTest ? 'Sending...' : 'Send Test'}
                        </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Template Manager */}
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '40px', padding: '48px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                   <h2 style={{ fontSize: '1.75rem', fontWeight: 950, color: 'var(--text-main)', marginBottom: '8px' }}>Communication Templates</h2>
                   <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>Standardize institutional notices across all channels.</p>
                </div>
                <button 
                  onClick={() => {
                    setEditingTemplateId(null);
                    setTempFormData({ name: '', channel: 'SMS', content: '' });
                    setShowTemplateModal(true);
                  }}
                  style={{ padding: '12px 24px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', border: 'none', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <Plus size={18} /> Create Template
                </button>
             </div>

             <div style={{ display: 'grid', gap: '16px' }}>
                {templates.map((temp) => (
                  <div key={temp.id} style={{ padding: '24px', borderRadius: '20px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '24px', backgroundColor: 'var(--bg-body)' }}>
                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-card)', borderRadius: '14px', color: 'var(--primary)', border: '1px solid var(--border-color)' }}>
                      <Layout size={24} />
                    </div>
                    <div style={{ flex: 1 }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                          <h4 style={{ margin: 0, fontWeight: 800, color: 'var(--text-main)' }}>{temp.name}</h4>
                          <span style={{ fontSize: '0.7rem', fontWeight: 900, backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>{temp.channel}</span>
                       </div>
                       <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>{temp.content}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                       <button onClick={() => startEditTemplate(temp)} className="icon-btn-sm" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}><Edit3 size={16} /></button>
                       <button onClick={() => handleDeleteTemplate(temp.id)} className="icon-btn-sm" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--danger)', border: '1px solid var(--border-color)' }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Terminal Integration Logs Drawer */}
      <AnimatePresence>
        {showLogsDrawer && (
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: '320px' }}
            exit={{ height: 0 }}
            style={{ 
              position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000, 
              backgroundColor: '#0f172a', borderTop: '2px solid #334155', color: '#38bdf8', 
              boxShadow: '0 -20px 40px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', borderBottom: '1px solid #1e293b', backgroundColor: '#1e293b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Terminal size={18} />
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'white', fontFamily: 'monospace' }}>Omnichannel Gateway Integration Console</span>
              </div>
              <button 
                onClick={() => setShowLogsDrawer(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', fontFamily: 'monospace', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#090d16' }}>
              {logs.map((log, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '12px', lineHeight: '1.5' }}>
                  <span style={{ color: '#64748b' }}>[{log.time}]</span>
                  <span style={{ 
                    color: log.level === 'success' ? '#4ade80' : log.level === 'warn' ? '#facc15' : log.level === 'error' ? '#f87171' : '#38bdf8',
                    fontWeight: 700 
                  }}>
                    {log.level.toUpperCase()}:
                  </span>
                  <span style={{ color: '#e2e8f0' }}>{log.text}</span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Diagnostic Scanner Overlay */}
      <AnimatePresence>
        {isScanning && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(16px)', zIndex: 9000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', maxWidth: '400px', width: '100%', padding: '0 24px', textAlign: 'center' }}
            >
              <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid rgba(99,102,241,0.2)', borderTopColor: 'var(--primary)', animation: 'spin 1.2s linear infinite' }} />
                <Activity size={32} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', color: 'var(--primary)' }} />
              </div>
              
              <div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.25rem', fontWeight: 900 }}>System Diagnostic Audit</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Executing packet handshakes sequentially...</p>
              </div>

              <div style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                {[
                  { label: 'SMS Core Endpoint', step: 1, provider: selectedProviders.sms },
                  { label: 'Email API Mail Broker', step: 2, provider: selectedProviders.email },
                  { label: 'WhatsApp Meta Daemon', step: 3, provider: selectedProviders.whatsapp },
                  { label: 'Push Firebase Dispatcher', step: 4, provider: selectedProviders.push }
                ].map(item => (
                  <div key={item.step} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', opacity: scanStep >= item.step ? 1 : 0.4 }}>
                    <span style={{ fontWeight: 700 }}>{item.label} ({item.provider})</span>
                    {scanStep > item.step ? (
                      <span style={{ color: '#4ade80', fontWeight: 800 }}>[SUCCESS]</span>
                    ) : scanStep === item.step ? (
                      <span style={{ color: 'var(--primary)', fontWeight: 800 }} className="spin"><RefreshCw size={12} /></span>
                    ) : (
                      <span style={{ color: '#64748b' }}>[QUEUED]</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Diagnostics Results Modal */}
      <AnimatePresence>
        {showDiagnosticsModal && diagnosticResults && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 8000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowDiagnosticsModal(false)}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(12px)' }}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              style={{ position: 'relative', width: '100%', maxWidth: '580px', backgroundColor: 'var(--bg-card)', borderRadius: '32px', padding: '40px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-2xl)' }}
            >
              <button 
                onClick={() => setShowDiagnosticsModal(false)}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Wifi size={24} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 950, color: 'var(--text-main)' }}>Diagnostic Audit Summary</h3>
                  <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 800 }}>OMNICHANNEL CHANNELS: 100% OPERATIONAL</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
                {diagnosticResults.map((res, idx) => (
                  <div key={idx} style={{ padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>{res.channel}</h4>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{res.details}</p>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#10b981' }}>{res.status}</span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'monospace' }}>Ping: {res.ping}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={downloadDiagnosticReport}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '16px', borderRadius: '14px', fontWeight: 800, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Save size={18} /> Export Audit Log
                </button>
                <button 
                  onClick={() => setShowDiagnosticsModal(false)}
                  className="btn"
                  style={{ flex: 1, padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', fontWeight: 800 }}
                >
                  Close Results
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Template Form Modal */}
      <AnimatePresence>
        {showTemplateModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowTemplateModal(false)}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(12px)' }}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={{ position: 'relative', width: '100%', maxWidth: '500px', backgroundColor: 'var(--bg-card)', borderRadius: '32px', padding: '40px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-2xl)' }}
            >
              <button 
                onClick={() => setShowTemplateModal(false)}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>

              <h2 style={{ fontSize: '1.75rem', fontWeight: 950, color: 'var(--text-main)', marginBottom: '24px' }}>
                {editingTemplateId ? 'Edit Template' : 'Create Template'}
              </h2>

              <form onSubmit={handleSaveTemplate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>TEMPLATE NAME</label>
                  <input required type="text" placeholder="e.g. Exam Schedule Alert" value={tempFormData.name} onChange={(e) => setTempFormData({ ...tempFormData, name: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600 }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>CHANNEL</label>
                  <select value={tempFormData.channel} onChange={(e) => setTempFormData({ ...tempFormData, channel: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600 }}>
                    <option value="SMS">SMS</option>
                    <option value="Email">Email</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Push">Push Notification</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>TEMPLATE CONTENT</label>
                  <textarea required placeholder="e.g. Hello Parent, {student_name} scored {grade} in {subject}." rows={4} value={tempFormData.content} onChange={(e) => setTempFormData({ ...tempFormData, content: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, resize: 'vertical' }} />
                </div>
                <button 
                  type="submit"
                  style={{ width: '100%', marginTop: '8px', padding: '18px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '16px', border: 'none', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(99,102,241,0.2)' }}
                >
                  Confirm Template Settings
                </button>
              </form>
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
              {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: '1.4', flex: 1 }}>{toast.message}</div>
            {toast.action && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toast.action.onClick();
                  setToast(null);
                }}
                style={{
                  background: 'rgba(99, 102, 241, 0.25)',
                  border: 'none',
                  color: '#818cf8',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  transition: 'background 0.2s',
                  marginLeft: '8px',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.35)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.25)'}
              >
                {toast.action.label}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .config-input { width: 100%; padding: 16px 20px 16px 48px; border-radius: 14px; border: 2px solid var(--border-color); background-color: var(--bg-body); color: var(--text-main); font-size: 1rem; font-weight: 600; transition: 0.3s; }
        .config-input:focus { outline: none; border-color: var(--primary); background-color: var(--bg-card); }
        .icon-btn-sm { padding: 10px; border-radius: 10px; border: 1px solid var(--border-color); background-color: var(--bg-card); color: var(--text-muted); cursor: pointer; transition: 0.2s; }
        .icon-btn-sm:hover { background-color: var(--bg-body); color: var(--primary); border-color: var(--primary-light); }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      ` }} />
    </div>
  );
};

const FormInput = ({ label, value, onChange, icon, type = 'text' }) => {
  const [show, setShow] = useState(false);
  const isPass = type === 'password';

  return (
    <div className="form-group">
      <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '12px', display: 'block' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: '16px', top: '18px', color: '#94a3b8' }}>{icon}</div>
        <input 
          type={isPass ? (show ? 'text' : 'password') : 'text'} 
          value={value} 
          onChange={onChange}
          className="config-input" 
        />
        {isPass && (
          <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default MessagingSettings;
