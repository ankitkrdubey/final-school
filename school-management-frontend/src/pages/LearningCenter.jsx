import React, { useState } from 'react';
import { BookOpen, Video, FileText, Play, CircleCheck, HelpCircle } from 'lucide-react';

const LearningCenter = () => {
  const [activeTab, setActiveTab] = useState('notes');

  const notes = [
    { id: 1, title: 'Introduction to Calculus', subject: 'Math', type: 'PDF', size: '2.5 MB' },
    { id: 2, title: 'Quantum Mechanics Basics', subject: 'Physics', type: 'Video', size: '45 mins' },
    { id: 3, title: 'World War II Summary', subject: 'History', type: 'PDF', size: '1.8 MB' },
  ];

  const quizzes = [
    { id: 1, title: 'Algebra Weekly Quiz', subject: 'Math', questions: 10, time: '15 mins' },
    { id: 2, title: 'Chemistry Periodic Table', subject: 'Science', questions: 20, time: '30 mins' },
  ];

  return (
    <div>
      <h1 className="page-title">Learning & Examination Center</h1>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
        <button 
          onClick={() => setActiveTab('notes')}
          className="btn"
          style={{ 
            backgroundColor: activeTab === 'notes' ? 'var(--primary)' : 'var(--bg-card)',
            color: activeTab === 'notes' ? 'white' : 'inherit',
            display: 'flex', gap: '8px'
          }}
        >
          <FileText size={18} /> Study Notes
        </button>
        <button 
          onClick={() => setActiveTab('quizzes')}
          className="btn"
          style={{ 
            backgroundColor: activeTab === 'quizzes' ? 'var(--primary)' : 'var(--bg-card)',
            color: activeTab === 'quizzes' ? 'white' : 'inherit',
            display: 'flex', gap: '8px'
          }}
        >
          <HelpCircle size={18} /> Online Quizzes
        </button>
      </div>

      {activeTab === 'notes' ? (
        <div className="grid-3">
          {notes.map(note => (
            <div className="card" key={note.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <div style={{ padding: '12px', backgroundColor: 'var(--primary-light)', borderRadius: '12px', color: 'var(--primary)' }}>
                  {note.type === 'Video' ? <Video size={24} /> : <FileText size={24} />}
                </div>
                <div>
                  <h3 style={{ marginBottom: '4px', fontSize: '1.1rem' }}>{note.title}</h3>
                  <span className="text-muted" style={{ fontSize: '0.8rem' }}>{note.subject}</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem' }}>{note.size}</span>
                <button className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '0.85rem' }}>
                  {note.type === 'Video' ? <Play size={14} /> : <BookOpen size={14} />} {note.type === 'Video' ? 'Watch' : 'Read'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid-2">
          {quizzes.map(quiz => (
            <div className="card" key={quiz.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{quiz.title}</h3>
                <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span>{quiz.subject}</span>
                  <span>{quiz.questions} Questions</span>
                  <span>{quiz.time}</span>
                </div>
              </div>
              <button className="btn" style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>Start Quiz</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningCenter;
