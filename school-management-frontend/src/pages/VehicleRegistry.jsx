import React, { useState, useMemo } from 'react';
import { 
  Bus, Plus, Search, Filter, Shield, Activity, Calendar, MoreVertical, 
  Settings, Gauge, BatteryCharging, AlertTriangle, Wrench, X, Save, 
  CheckCircle2, AlertCircle, Edit, Trash2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SEED_VEHICLES = [
  { id: 1, reg: 'JH-02-B-1101', model: 'Tata Marcopolo Bus', capacity: 20, lastService: '2026-04-15', fitnessExp: '2027-04-15', status: 'Optimal', mileage: '45,200 km', health: 98 },
  { id: 2, reg: 'JH-02-B-2204', model: 'Mahindra Tourister Bus', capacity: 55, lastService: '2026-03-20', fitnessExp: '2027-03-20', status: 'Optimal', mileage: '82,150 km', health: 92 },
  { id: 3, reg: 'JH-02-V-4402', model: 'Force Traveller Van', capacity: 25, lastService: '2025-12-10', fitnessExp: '2026-06-10', status: 'Due Soon', mileage: '112,400 km', health: 75 },
  { id: 4, reg: 'JH-02-B-5509', model: 'Swaraj Mazda Bus', capacity: 42, lastService: '2026-05-01', fitnessExp: '2027-05-01', status: 'Maintenance', mileage: '25,600 km', health: 45 },
  { id: 5, reg: 'JH-02-B-8812', model: 'Eicher Skyline Pro', capacity: 32, lastService: '2026-02-10', fitnessExp: '2027-02-10', status: 'Optimal', mileage: '15,800 km', health: 99 },
];

const VehicleRegistry = () => {
  // Active vehicles state
  const [vehicles, setVehicles] = useState(() => {
    try {
      const s = localStorage.getItem('vehicle_registry');
      if (s) return JSON.parse(s);
    } catch(e) {}
    return SEED_VEHICLES;
  });

  const persist = (updated) => {
    setVehicles(updated);
    localStorage.setItem('vehicle_registry', JSON.stringify(updated));
  };

  // UI state variables
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showFilter, setShowFilter] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  
  // Custom dialogs & action state
  const [showActionsMenu, setShowActionsMenu] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [config, setConfig] = useState({
    autoSchedule: true,
    speedLimits: true,
    fatigueAlerts: false,
    maxLoadEnforce: true,
  });
  
  const [toast, setToast] = useState(null);

  // Form states
  const [form, setForm] = useState({ 
    reg: '', 
    model: '', 
    capacity: '', 
    status: 'Optimal', 
    mileage: '', 
    health: '100' 
  });

  // Toast notifier
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // dynamic search & filtering
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const q = searchQuery.toLowerCase();
      const matchQ = !q || v.reg.toLowerCase().includes(q) || v.model.toLowerCase().includes(q);
      const matchS = filterStatus === 'All' || v.status === filterStatus;
      return matchQ && matchS;
    });
  }, [vehicles, searchQuery, filterStatus]);

  // Form submit handler (Add / Edit)
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!form.reg.trim() || !form.model.trim()) {
      showToast('error', 'Please fill in all required fields.');
      return;
    }

    let updatedList;
    if (editingVehicle) {
      updatedList = vehicles.map(v => 
        v.id === editingVehicle.id 
          ? { 
              ...v, 
              reg: form.reg.trim(), 
              model: form.model.trim(), 
              capacity: parseInt(form.capacity) || 20, 
              status: form.status, 
              mileage: form.mileage.trim() || '0 km', 
              health: parseInt(form.health) || 100 
            } 
          : v
      );
      showToast('success', `Asset parameters for ${form.reg} updated successfully.`);
    } else {
      const newVehicle = {
        id: Date.now(),
        reg: form.reg.trim(),
        model: form.model.trim(),
        capacity: parseInt(form.capacity) || 20,
        mileage: form.mileage.trim() || '0 km',
        health: parseInt(form.health) || 100,
        status: form.status,
        lastService: new Date().toISOString().split('T')[0],
        fitnessExp: '2027-01-01',
      };
      updatedList = [...vehicles, newVehicle];
      showToast('success', `Asset ${form.reg} registered successfully.`);
    }

    persist(updatedList);
    setShowAddModal(false);
    setEditingVehicle(null);
  };

  // Open modal prefill
  const handleOpenForm = (vehicle = null) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setForm({
        reg: vehicle.reg,
        model: vehicle.model,
        capacity: vehicle.capacity,
        status: vehicle.status,
        mileage: vehicle.mileage,
        health: vehicle.health.toString()
      });
    } else {
      setEditingVehicle(null);
      setForm({
        reg: '',
        model: '',
        capacity: '',
        status: 'Optimal',
        mileage: '',
        health: '100'
      });
    }
    setShowAddModal(true);
  };

  // Log mechanical maintenance check manually
  const handleLogServiceWork = (vehicle) => {
    const updated = vehicles.map(v => 
      v.id === vehicle.id 
        ? { 
            ...v, 
            health: 100, 
            status: 'Optimal', 
            lastService: new Date().toISOString().split('T')[0] 
          } 
        : v
    );
    persist(updated);
    showToast('success', `Maintenance service logged. ${vehicle.reg} health restored to 100%.`);
    setShowActionsMenu(null);
  };

  // De-register/delete asset handler
  const handleDeleteVehicle = (vehicleId) => {
    setDeleteConfirmId(vehicleId);
    setShowActionsMenu(null);
  };

  // Dynamic statistics computations
  const totalFleetCount = 19 + vehicles.length;
  const maintenanceCount = vehicles.filter(v => v.status === 'Maintenance').length;
  const dueSoonCount = vehicles.filter(v => v.status === 'Due Soon').length;
  const safetyAlertsCount = vehicles.filter(v => v.health < 80).length;

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      {/* Toast Notification Component */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: 'fixed', bottom: '36px', right: '36px', zIndex: 9999,
              backgroundColor: toast.type === 'success' ? '#10B981' : '#EF4444', color: 'white',
              padding: '16px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px',
              boxShadow: '0 10px 30px -5px rgba(0,0,0,0.25)', fontWeight: 700, fontSize: '0.9rem'
            }}
          >
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Block */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Institutional Vehicle Fleet</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Comprehensive asset management system for tracking vehicle health, compliance, and service history.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <button onClick={() => setShowConfigModal(true)} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', cursor: 'pointer', fontWeight: 800 }}>
              <Settings size={20} /> Fleet Config
           </button>
           <button onClick={() => handleOpenForm()} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', cursor: 'pointer', fontWeight: 800 }}>
              <Plus size={20} /> Register New Asset
           </button>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
         <div style={{ padding: '24px', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '20px', alignItems: 'center' }}>
             <div style={{ flex: 1, position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                <input 
                  type="text" 
                  placeholder="Search by registration, model, or chassis number..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', outline: 'none', fontWeight: 600, color: 'var(--text-main)' }}
                />
             </div>
             <div style={{ position: 'relative' }}>
               <button onClick={() => setShowFilter(!showFilter)} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', padding: '12px 20px', fontWeight: 700, cursor: 'pointer' }}>
                 <Filter size={18} /> {filterStatus === 'All' ? 'Status Filter' : filterStatus}
                 {filterStatus !== 'All' && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)', marginLeft: '4px' }}></span>}
               </button>
               {showFilter && (
                 <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', zIndex: 100, minWidth: '160px' }}>
                   {['All', 'Optimal', 'Due Soon', 'Maintenance'].map(s => (
                     <div 
                       key={s} 
                       onClick={() => { setFilterStatus(s); setShowFilter(false); }}
                       style={{ padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', backgroundColor: filterStatus === s ? 'var(--primary-light)' : 'transparent', color: filterStatus === s ? 'var(--primary)' : 'var(--text-main)', fontWeight: 700, fontSize: '0.85rem' }}
                     >
                       {s}
                     </div>
                   ))}
                 </div>
               )}
             </div>
          </div>

         {/* Fleet Asset Table */}
         <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
               <thead>
                  <tr style={{ backgroundColor: 'var(--bg-body)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                     <th style={{ padding: '20px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Vehicle Identification</th>
                     <th style={{ padding: '20px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fleet Capacity</th>
                     <th style={{ padding: '20px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Asset Health</th>
                     <th style={{ padding: '20px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Compliance Status</th>
                     <th style={{ padding: '20px 24px' }}></th>
                  </tr>
               </thead>
               <tbody>
                  {filteredVehicles.map((v, idx) => (
                     <tr 
                       key={v.id}
                       style={{ borderBottom: '1px solid var(--border-color)', transition: '0.2s' }}
                     >
                        <td style={{ padding: '20px 24px' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                 <Bus size={24} />
                              </div>
                              <div>
                                 <p style={{ margin: 0, fontWeight: 900, fontSize: '1rem', color: 'var(--text-main)' }}>{v.reg}</p>
                                 <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>{v.model}</p>
                              </div>
                           </div>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>{v.capacity} Passenger Seats</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                                 <Gauge size={12} /> {v.mileage} TOTAL
                              </span>
                           </div>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                           <div style={{ width: '120px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.75rem', fontWeight: 800 }}>
                                 <span>Health Score</span>
                                 <span style={{ color: v.health > 90 ? '#10b981' : (v.health > 70 ? '#f59e0b' : '#ef4444') }}>{v.health}%</span>
                              </div>
                              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-body)', borderRadius: '10px', overflow: 'hidden' }}>
                                 <div style={{ width: `${v.health}%`, height: '100%', backgroundColor: v.health > 90 ? '#10b981' : (v.health > 70 ? '#f59e0b' : '#ef4444'), transition: '1s ease-in-out' }}></div>
                              </div>
                           </div>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                           <div style={{ 
                             display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '30px', 
                             fontSize: '0.75rem', fontWeight: 900,
                             backgroundColor: v.status === 'Optimal' ? '#ecfdf5' : (v.status === 'Due Soon' ? '#fffbeb' : '#fef2f2'),
                             color: v.status === 'Optimal' ? '#10b981' : (v.status === 'Due Soon' ? '#d97706' : '#ef4444'),
                             border: `1px solid ${v.status === 'Optimal' ? '#10b98130' : (v.status === 'Due Soon' ? '#d9770630' : '#ef444430')}`
                           }}>
                              {v.status === 'Optimal' ? <Shield size={12} /> : (v.status === 'Due Soon' ? <AlertTriangle size={12} /> : <Wrench size={12} />)}
                              {v.status.toUpperCase()}
                           </div>
                        </td>
                        <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                           <button onClick={() => setShowActionsMenu(v)} className="icon-btn" style={{ backgroundColor: 'var(--bg-body)', cursor: 'pointer' }}><MoreVertical size={20} /></button>
                        </td>
                     </tr>
                  ))}
                  {filteredVehicles.length === 0 && (
                     <tr>
                       <td colSpan={5} style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 700 }}>
                         No vehicles found matching your search.
                       </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* Dynamic Statistics Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginTop: '32px' }}>
         {[
           { label: 'Total Fleet', value: totalFleetCount, icon: <Bus size={20} />, color: 'var(--primary)' },
           { label: 'Fuel Consumed', value: '1.2k L', icon: <BatteryCharging size={20} />, color: '#4f46e5' },
           { label: 'Safety Alerts', value: safetyAlertsCount, icon: <Shield size={20} />, color: '#10b981' },
           { label: 'Maintenance due', value: maintenanceCount + dueSoonCount, icon: <Wrench size={20} />, color: '#ef4444' }
         ].map((stat, i) => (
           <div key={i} className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid var(--border-color)' }}>
              <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: `${stat.color}15`, color: stat.color }}>
                 {stat.icon}
              </div>
              <div>
                 <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>{stat.label}</p>
                 <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>{stat.value}</p>
              </div>
           </div>
         ))}
      </div>

      {/* REGISTER / EDIT ASSET MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ width: '100%', maxWidth: '600px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900 }}>
                  {editingVehicle ? 'Edit Asset Profile' : 'Register New Asset'}
                </h2>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20}/></button>
              </div>
              <form onSubmit={handleAddSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Registration No. *</label>
                    <input type="text" required value={form.reg} onChange={e => setForm({...form, reg: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} placeholder="e.g. ABC-1234" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Model / Make *</label>
                    <input type="text" required value={form.model} onChange={e => setForm({...form, model: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} placeholder="e.g. Volvo 9400" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Passenger Seating Capacity *</label>
                    <input type="number" required value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} placeholder="e.g. 50" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Current Mileage *</label>
                    <input type="text" required value={form.mileage} onChange={e => setForm({...form, mileage: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} placeholder="e.g. 10,000 km" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Health Score (0-100)</label>
                    <input type="number" min="0" max="100" required value={form.health} onChange={e => setForm({...form, health: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Compliance Status</label>
                    <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none', cursor: 'pointer' }}>
                      <option value="Optimal">Optimal</option>
                      <option value="Due Soon">Due Soon</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn" style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Save size={18} /> {editingVehicle ? 'Save Asset' : 'Register Asset'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Fleet Config Modal */}
      <AnimatePresence>
        {showConfigModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ width: '100%', maxWidth: '500px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <div style={{ padding: '10px', backgroundColor: 'var(--primary-light)', borderRadius: '12px', color: 'var(--primary)' }}><Settings size={24} /></div>
                   <div>
                      <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900 }}>Fleet Configuration</h2>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Global settings and policies.</p>
                   </div>
                </div>
                <button onClick={() => setShowConfigModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={24}/></button>
              </div>
              
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                 {[
                   { key: 'autoSchedule', label: 'Auto-Schedule Maintenance', desc: 'Automatically flag vehicles 30 days before fitness expiry.' },
                   { key: 'speedLimits', label: 'Speed Limit Telemetry', desc: 'Alert when vehicles exceed institutional speed guidelines.' },
                   { key: 'fatigueAlerts', label: 'Driver Fatigue Alerts', desc: 'Monitor continuous driving hours for driver safety.' },
                   { key: 'maxLoadEnforce', label: 'Strict Capacity Enforcement', desc: 'Prevent routing if occupancy exceeds physical capacity.' },
                 ].map((setting) => (
                    <div key={setting.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div style={{ paddingRight: '20px' }}>
                          <p style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>{setting.label}</p>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{setting.desc}</p>
                       </div>
                       <div 
                         onClick={() => setConfig({...config, [setting.key]: !config[setting.key]})}
                         style={{ 
                           width: '44px', height: '24px', borderRadius: '12px', 
                           backgroundColor: config[setting.key] ? 'var(--primary)' : 'var(--bg-body)',
                           border: `2px solid ${config[setting.key] ? 'var(--primary)' : 'var(--border-color)'}`,
                           position: 'relative', cursor: 'pointer', transition: '0.3s',
                           flexShrink: 0
                         }}
                       >
                          <div style={{ 
                            position: 'absolute', top: '2px', left: config[setting.key] ? '22px' : '2px', 
                            width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'white', 
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)', transition: '0.3s' 
                          }}></div>
                       </div>
                    </div>
                 ))}
              </div>
              <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)' }}>
                 <button onClick={() => { setShowConfigModal(false); showToast('success', 'Global fleet policies updated successfully.'); }} className="btn btn-primary" style={{ width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 900, cursor: 'pointer', border: 'none', backgroundColor: 'var(--primary)', color: 'white' }}>
                    Save Policies
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QUICK OPERATIONS MENU BOTTOM SHEET */}
      <AnimatePresence>
        {showActionsMenu && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}>
            <div style={{ position: 'absolute', inset: 0 }} onClick={() => setShowActionsMenu(null)} />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              style={{ width: '100%', maxWidth: '360px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', zIndex: 10, padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.15rem', color: 'var(--text-main)' }}>Asset Operations</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Managing vehicle {showActionsMenu.reg}</p>
                </div>
                <button onClick={() => setShowActionsMenu(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20}/></button>
              </div>

              <hr style={{ border: 'none', borderBottom: '1px solid var(--border-color)', margin: '4px 0' }} />

              <button 
                onClick={() => {
                  setShowActionsMenu(null);
                  handleOpenForm(showActionsMenu);
                }} 
                className="btn" 
                style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', cursor: 'pointer', fontWeight: 700 }}
              >
                <Edit size={18} style={{ color: 'var(--primary)' }} /> Edit Asset Parameters
              </button>

              <button 
                onClick={() => handleLogServiceWork(showActionsMenu)}
                className="btn" 
                style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', cursor: 'pointer', fontWeight: 700 }}
              >
                <Wrench size={18} style={{ color: '#10b981' }} /> Log Service Work (Restores health)
              </button>

              <button 
                onClick={() => handleDeleteVehicle(showActionsMenu.id)} 
                className="btn" 
                style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #ef444420', backgroundColor: '#fef2f2', color: '#ef4444', cursor: 'pointer', fontWeight: 800 }}
              >
                <Trash2 size={18} /> De-register Asset
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CUSTOM CONFIRM DELETE DIALOG */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}>
            <div style={{ position: 'absolute', inset: 0 }} onClick={() => setDeleteConfirmId(null)} />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', textAlign: 'center', border: '1px solid var(--border-color)', zIndex: 10 }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                <AlertCircle size={28} />
              </div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)' }}>De-register Asset</h3>
              <p style={{ margin: '0 0 24px 0', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.5 }}>
                Are you sure you want to de-register this institutional fleet asset? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => setDeleteConfirmId(null)} 
                  className="btn" 
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', fontWeight: 800, cursor: 'pointer' }}
                >
                  Go Back
                </button>
                <button 
                  onClick={() => {
                    const target = vehicles.find(v => v.id === deleteConfirmId);
                    if (target) {
                      const updated = vehicles.filter(v => v.id !== deleteConfirmId);
                      persist(updated);
                      showToast('success', `Fleet asset ${target.reg} has been de-registered.`);
                    }
                    setDeleteConfirmId(null);
                  }} 
                  className="btn" 
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#ef4444', color: 'white', fontWeight: 800, cursor: 'pointer' }}
                >
                  De-register
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VehicleRegistry;
