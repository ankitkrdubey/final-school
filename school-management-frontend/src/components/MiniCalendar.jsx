import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MiniCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const renderDays = () => {
    const days = [];
    const today = new Date();
    
    // Empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} style={{ width: '14.2%', padding: '8px 0' }}></div>);
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = 
        i === today.getDate() && 
        currentDate.getMonth() === today.getMonth() && 
        currentDate.getFullYear() === today.getFullYear();

      days.push(
        <div key={i} style={{ 
          width: '14.2%', 
          display: 'flex', 
          justifyContent: 'center', 
          padding: '6px 0',
          marginBottom: '4px'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            backgroundColor: isToday ? 'var(--primary)' : 'transparent',
            color: isToday ? 'white' : 'var(--text-main)',
            fontWeight: isToday ? 800 : 500,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            ':hover': {
              backgroundColor: isToday ? 'var(--primary)' : 'var(--bg-body)'
            }
          }}>
            {i}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h4>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={prevMonth}
            style={{ 
              width: '28px', height: '28px', borderRadius: '8px', 
              border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' 
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={nextMonth}
            style={{ 
              width: '28px', height: '28px', borderRadius: '8px', 
              border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' 
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div style={{ display: 'flex', width: '100%', marginBottom: '12px' }}>
        {dayNames.map(day => (
          <div key={day} style={{ 
            width: '14.2%', textAlign: 'center', fontSize: '0.8rem', 
            fontWeight: 800, color: 'var(--text-muted)' 
          }}>
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
        {renderDays()}
      </div>
    </div>
  );
};

export default MiniCalendar;
