import React, { useState, useEffect } from 'react';
import { Home, Bed, Users, AlertCircle } from 'lucide-react';
import { HostelApi } from '../services/service';

const Hostel = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const data = await HostelApi.getAll();
      setRooms(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Hostel Management</h1>

      <div className="grid-4">
        {rooms.map((room) => (
          <div className="card" key={room.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: 0 }}>Room {room.room_no}</h2>
              <span className={`status-badge ${room.available_beds > 0 ? 'status-active' : 'status-danger'}`}>
                {room.available_beds > 0 ? 'Available' : 'Full'}
              </span>
            </div>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px' }}>{room.block_name} Block</p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontSize: '0.9rem' }}>
              <Bed size={16} />
              <span>{room.available_beds} / {room.capacity} Beds free</span>
            </div>

            <div style={{ marginTop: '16px', height: '6px', backgroundColor: 'var(--bg-body)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${((room.capacity - room.available_beds) / room.capacity) * 100}%`, 
                height: '100%', 
                backgroundColor: 'var(--primary)' 
              }}></div>
            </div>
          </div>
        ))}
        {rooms.length === 0 && (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            <p className="text-muted">No hostel room data found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hostel;
