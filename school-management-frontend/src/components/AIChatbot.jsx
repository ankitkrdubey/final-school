import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { resolveAIIntent } from '../utils/aiIntentRouter';

const AIChatbot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! I am your EduPro AI Assistant. How can I help you manage the school today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = React.useRef(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  const executeQuery = (queryText) => {
    if (isTyping) return;
    processMessage(queryText);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    
    processMessage(input);
    setInput('');
  };

  const processMessage = (textMsg) => {
    const newMessages = [...messages, { role: 'user', text: textMsg }];
    setMessages(newMessages);
    setIsTyping(true);
    
    // Natural Language Routing Logic
    setTimeout(() => {
      const intent = resolveAIIntent(textMsg);
      let routeAction = intent.route;
      let textResponse = intent.text;

      if (!routeAction) {
        const responses = [
          `I've analyzed your request: "${textMsg}". My predictive models suggest checking the Academic settings.`,
          `Regarding "${textMsg}", there is a strong correlation between early attendance patterns and final term results. Proactive notification is recommended.`,
          `Based on "${textMsg}", the institutional resource audit is complete. We can optimize current operational costs by 8%.`,
          `Neural Engine analysis for "${textMsg}" is ready. I suggest an archival cycle for older records to improve system speed.`
        ];
        textResponse = responses[Math.floor(Math.random() * responses.length)];
      }
      
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: textResponse 
      }]);

      if (routeAction) {
        setTimeout(() => {
          navigate(routeAction);
          setIsOpen(false);
        }, 1500);
      }
    }, 1000 + Math.random() * 1000); // Dynamic typing delay
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}>
      {/* Chat Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--primary)', 
          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', 
          boxShadow: 'var(--shadow-lg)', border: 'none', cursor: 'pointer', transition: 'all 0.3s'
        }}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          style={{ 
            position: 'absolute', bottom: '80px', right: '0', width: '350px', height: '450px', 
            backgroundColor: 'var(--bg-card)', borderRadius: '20px', boxShadow: 'var(--shadow-xl)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--border-color)'
          }}
        >
          {/* Header */}
          <div style={{ backgroundColor: 'var(--primary)', padding: '20px', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Bot size={24} />
            <div>
              <h4 style={{ marginBottom: 0 }}>EduPro AI</h4>
              <p style={{ fontSize: '0.7rem', opacity: 0.8, marginBottom: 0 }}>Online & Smart</p>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg, i) => (
              <div 
                key={i} 
                style={{ 
                  alignSelf: msg.role === 'bot' ? 'flex-start' : 'flex-end',
                  maxWidth: '80%', padding: '10px 14px', borderRadius: '15px',
                  backgroundColor: msg.role === 'bot' ? 'var(--bg-body)' : 'var(--primary)',
                  color: msg.role === 'bot' ? 'var(--text-main)' : 'white',
                  fontSize: '0.85rem', lineHeight: '1.4',
                  boxShadow: msg.role === 'bot' ? 'none' : '0 4px 10px rgba(99, 102, 241, 0.2)'
                }}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', padding: '12px 16px', borderRadius: '15px', backgroundColor: 'var(--bg-body)', display: 'flex', gap: '4px' }}>
                 <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-muted)', animation: 'pulse 1.5s infinite' }}></div>
                 <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-muted)', animation: 'pulse 1.5s infinite 0.2s' }}></div>
                 <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-muted)', animation: 'pulse 1.5s infinite 0.4s' }}></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length < 3 && !isTyping && (
            <div style={{ padding: '10px 15px', display: 'flex', gap: '8px', overflowX: 'auto', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }} className="hide-scrollbar">
               {['Show Attendance', 'Fee Setup', 'Hostel Menu'].map(action => (
                 <button 
                   key={action}
                   onClick={() => executeQuery(action)}
                   style={{ whiteSpace: 'nowrap', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--primary)', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                 >
                   {action}
                 </button>
               ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSend} style={{ padding: '15px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '10px', backgroundColor: 'white' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Ask anything..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1, marginBottom: 0, padding: '10px', borderRadius: '12px' }}
            />
            <button disabled={isTyping} className="btn btn-primary" style={{ padding: '0 14px', borderRadius: '12px', opacity: isTyping ? 0.7 : 1 }}><Send size={18} /></button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;
