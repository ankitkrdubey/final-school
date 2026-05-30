import React, { useState } from 'react';
import { MapPin, Plus, Search, Filter, ArrowRight, Clock, Users, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

const TransportRoutes = () => {
  const [routes, setRoutes] = useState([
    { id: 1, name: 'North Express', stops: 12, distance: '15.4 km', timing: '07:30 AM - 08:30 AM', activeVehicles: 3, passengers: 145 },
    { id: 2, name: 'Downtown Shuttle', stops: 8, distance: '8.2 km', timing: '08:00 AM - 09:00 AM', activeVehicles: 2, passengers: 85 },
    { id: 3, name: 'Staff Loop', stops: 5, distance: '12.0 km', timing: '07:00 AM - 08:00 AM', activeVehicles: 1, passengers: 25 },
    { id: 4, name: 'Evening Exit', stops: 15, distance: '22.5 km', timing: '04:30 PM - 06:00 PM', activeVehicles: 4, passengers: 190 },
  ]);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Transport Routes</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Define, optimize, and manage institutional transit paths and timing schedules.</p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px' }}>
          <Plus size={20} /> New Route Path
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
        {routes.map((route, idx) => (
          <motion.div 
            key={route.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="card"
            style={{ padding: '24px', border: '1px solid var(--border-color)', borderLeft: '4px solid var(--primary)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
               <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '4px' }}>{route.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem' }}>
                     <Navigation size={14} /> {route.distance} TOTAL LENGTH
                  </div>
               </div>
               <div style={{ padding: '10px', backgroundColor: 'var(--primary-light)', borderRadius: '12px', color: 'var(--primary)' }}>
                  <MapPin size={24} />
               </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px' }}>
                  <Clock size={18} className="text-muted" />
                  <div>
                     <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Active Schedule</p>
                     <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>{route.timing}</p>
                  </div>
               </div>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                     <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900 }}>{route.stops}</p>
                     <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>STATIONS</p>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                     <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900 }}>{route.passengers}</p>
                     <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>SUBSCRIPTIONS</p>
                  </div>
               </div>
            </div>

            <button className="btn" style={{ width: '100%', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', fontWeight: 800, fontSize: '0.9rem' }}>
               View Stop Map <ArrowRight size={18} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TransportRoutes;
