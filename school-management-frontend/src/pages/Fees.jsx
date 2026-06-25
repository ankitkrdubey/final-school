import React, { useState } from 'react';
import { IndianRupee, CreditCard, Clock, TrendingUp, ArrowUpRight, ArrowDownRight, PieChart as PieIcon, BarChart3, Wallet, Calendar, Filter, Download, MoreVertical, FileText, Building, Zap, User, ChevronRight, Activity, X } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
  Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToast, ToastRenderer } from '../hooks/useToast';

const FeesDashboard = () => {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  const [showForecastModal, setShowForecastModal] = useState(false);
  const [forecastMonths, setForecastMonths] = useState(6);
  const [growthRate, setGrowthRate] = useState(5);

  const handleDownloadAnnualReport = () => {
    const summaryRows = [
      ['Financial Summary Metrics', 'Value'],
      ['Total Revenue', '₹1,250,000'],
      ['Collection Rate', '94.2%'],
      ['Pending Amount', '₹24,500'],
      ['Active Discounts & Scholars', '42'],
      [],
      ['Collection by Category', 'Percentage (%)'],
      ['Tuition Fees', '65%'],
      ['Transport Fees', '15%'],
      ['Hostel Fees', '12%'],
      ['Library & Miscellaneous', '8%'],
      [],
      ['Collection by Payment Method', 'Transactions Count'],
      ['Online Portal', '450'],
      ['Direct Bank Transfer', '320'],
      ['Cash Collection', '120'],
      ['Cheque Deposits', '45'],
      [],
      ['Recent Transactions Ledger', ''],
      ['Invoice ID', 'Student Name', 'Type', 'Amount', 'Status', 'Date'],
      ['#INV-2024', 'Alex Johnson', 'Tuition', '₹450.00', 'Paid', '05 May'],
      ['#INV-2023', 'Sarah Williams', 'Transport', '₹80.00', 'Paid', '05 May'],
      ['#INV-2022', 'Michael Brown', 'Tuition', '₹450.00', 'Pending', '04 May'],
    ];
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += summaryRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "annual_financial_report_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Annual financial report CSV successfully generated and downloaded!', 'success', 'Report Downloaded');
  };

  const getForecastedData = () => {
    const currentBase = 58000;
    const projected = [];
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    let cumulative = 0;
    
    for (let i = 0; i < forecastMonths; i++) {
      const growthFactor = 1 + (growthRate / 100) * (i + 1) / forecastMonths;
      const expected = Math.round(currentBase * growthFactor);
      cumulative += expected;
      projected.push({
        month: months[i % 12],
        projectedRevenue: expected,
        cumulative: cumulative
      });
    }
    return { projected, cumulative };
  };

  const [selectedYear, setSelectedYear] = useState('Current Year');

  const collectionDataCurrent = [
    { month: 'Jan', collection: 45000, target: 50000 },
    { month: 'Feb', collection: 52000, target: 50000 },
    { month: 'Mar', collection: 48000, target: 55000 },
    { month: 'Apr', collection: 61000, target: 60000 },
    { month: 'May', collection: 55000, target: 65000 },
    { month: 'Jun', collection: 67000, target: 65000 },
  ];

  const collectionDataPrevious = [
    { month: 'Jan', collection: 38000, target: 40000 },
    { month: 'Feb', collection: 41000, target: 40000 },
    { month: 'Mar', collection: 43000, target: 42000 },
    { month: 'Apr', collection: 49000, target: 45000 },
    { month: 'May', collection: 51000, target: 48000 },
    { month: 'Jun', collection: 53000, target: 50000 },
  ];

  const collectionData = selectedYear === 'Current Year' ? collectionDataCurrent : collectionDataPrevious;

  const categoryData = [
    { name: 'Tuition Fees', value: 65, color: 'var(--primary)' },
    { name: 'Transport', value: 15, color: '#F59E0B' },
    { name: 'Hostel', value: 12, color: '#10B981' },
    { name: 'Library/Misc', value: 8, color: '#8B5CF6' },
  ];

  const methodData = [
    { name: 'Online', value: 450, color: 'var(--primary)' },
    { name: 'Bank Transfer', value: 320, color: '#10B981' },
    { name: 'Cash', value: 120, color: '#F59E0B' },
    { name: 'Cheque', value: 45, color: '#EF4444' },
  ];

  const recentTransactions = [
    { id: '#INV-2024', student: 'Alex Johnson', type: 'Tuition', amount: '₹450.00', status: 'Paid', date: '05 May' },
    { id: '#INV-2023', student: 'Sarah Williams', type: 'Transport', amount: '₹80.00', status: 'Paid', date: '05 May' },
    { id: '#INV-2022', student: 'Michael Brown', type: 'Tuition', amount: '₹450.00', status: 'Pending', date: '04 May' },
  ];

  const highDuesData = [
    { month: 'Jan', 'Alex': 1200, 'Sarah': 900, 'Michael': 1500, 'Emily': 600, 'Robert': 1100 },
    { month: 'Feb', 'Alex': 1100, 'Sarah': 850, 'Michael': 1400, 'Emily': 550, 'Robert': 1000 },
    { month: 'Mar', 'Alex': 1000, 'Sarah': 800, 'Michael': 1300, 'Emily': 500, 'Robert': 900 },
    { month: 'Apr', 'Alex': 900, 'Sarah': 750, 'Michael': 1200, 'Emily': 450, 'Robert': 800 },
    { month: 'May', 'Alex': 800, 'Sarah': 700, 'Michael': 1100, 'Emily': 400, 'Robert': 700 },
    { month: 'Jun', 'Alex': 700, 'Sarah': 650, 'Michael': 1000, 'Emily': 350, 'Robert': 600 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '60px' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '8px' }}>
            <div style={{ padding: '8px', backgroundColor: 'var(--primary-light)', borderRadius: '10px' }}>
               <BarChart3 size={20} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Financial Analytics</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 950, margin: 0, letterSpacing: '-1px' }}>Fees Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '6px', fontWeight: 600 }}>Monitor institutional revenue, pending dues, and financial growth metrics.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <button 
              onClick={handleDownloadAnnualReport}
              className="btn" 
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
           >
              <Download size={18} /> ANNUAL REPORT
           </button>
           <button 
              onClick={() => setShowForecastModal(true)}
              className="btn btn-primary" 
              style={{ padding: '12px 28px', fontWeight: 900, boxShadow: '0 4px 12px rgba(72, 128, 255, 0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
           >
              <TrendingUp size={18} /> FORECAST REVENUE
           </button>
        </div>
      </div>

      {/* Summary Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
         {[
           { label: 'Total Revenue', value: '₹1.25M', change: '+12.5%', isPositive: true, icon: <IndianRupee size={20} />, color: 'var(--primary)' },
           { label: 'Collection Rate', value: '94.2%', change: '+3.1%', isPositive: true, icon: <Activity size={20} />, color: '#10B981' },
           { label: 'Pending Amount', value: '₹24.5k', change: '-1.2%', isPositive: false, icon: <Clock size={20} />, color: '#EF4444' },
           { label: 'Active Discounts', value: '42', change: '+5', isPositive: true, icon: <Zap size={20} />, color: '#F59E0B' }
         ].map((stat, i) => (
            <div key={i} className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
               <div style={{ width: '54px', height: '54px', borderRadius: '16px', backgroundColor: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {stat.icon}
               </div>
               <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{stat.label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                     <div style={{ fontSize: '1.4rem', fontWeight: 950 }}>{stat.value}</div>
                     <div style={{ fontSize: '0.7rem', fontWeight: 900, color: stat.isPositive ? 'var(--success)' : 'var(--danger)', display: 'flex', alignItems: 'center' }}>
                        {stat.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {stat.change}
                     </div>
                  </div>
               </div>
            </div>
         ))}
      </div>

      {/* Analytics Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
         <div className="card" style={{ padding: '32px', borderRadius: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
               <h3 style={{ fontSize: '1.25rem', fontWeight: 950, margin: 0 }}>Revenue Collection Trends</h3>
               <select 
                  className="form-input" 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  style={{ width: '150px', borderRadius: '12px', padding: '8px 12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
               >
                  <option value="Current Year">Current Year</option>
                  <option value="Previous Year">Previous Year</option>
               </select>
            </div>
            <div style={{ height: '350px', width: '100%' }}>
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={collectionData}>
                     <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: 'var(--text-muted)' }} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: 'var(--text-muted)' }} tickFormatter={(v) => `₹${v/1000}k`} />
                     <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: 'var(--shadow-xl)' }} />
                     <Area type="monotone" dataKey="collection" stroke="var(--primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                     <Area type="monotone" dataKey="target" stroke="#E2E8F0" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="card" style={{ padding: '32px', borderRadius: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 950, marginBottom: '32px' }}>Collection by Category</h3>
            <div style={{ height: '280px', width: '100%' }}>
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={categoryData}
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                     >
                        {categoryData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                     </Pie>
                     <Tooltip />
                     <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
               </ResponsiveContainer>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
               {categoryData.map((cat, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cat.color }}></div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>{cat.name}</span>
                     </div>
                     <span style={{ fontSize: '0.85rem', fontWeight: 900 }}>{cat.value}%</span>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* Analytics Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '32px' }}>
         <div className="card" style={{ padding: '32px', borderRadius: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 950, marginBottom: '32px' }}>Payment Methods</h3>
            <div style={{ height: '300px', width: '100%' }}>
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={methodData} layout="vertical">
                     <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-color)" />
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 800, fill: 'var(--text-muted)' }} width={100} />
                     <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                     <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                        {methodData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="card" style={{ padding: '0', borderRadius: '32px', overflow: 'hidden' }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-body)' }}>
               <h3 style={{ fontSize: '1.2rem', fontWeight: 950, margin: 0 }}>Recent Transactions</h3>
               <button 
                  onClick={() => navigate('/dashboard/transactions')}
                  style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 900, background: 'none', border: 'none', cursor: 'pointer' }}
               >
                  VIEW ALL
               </button>
            </div>
            <div style={{ padding: '16px' }}>
               {recentTransactions.map((trx, i) => (
                  <div key={i} style={{ padding: '20px', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i === recentTransactions.length - 1 ? 'none' : '1px solid var(--border-color)' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                           <FileText size={20} />
                        </div>
                        <div>
                           <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{trx.student}</div>
                           <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{trx.id} • {trx.type}</div>
                        </div>
                     </div>
                     <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1rem', fontWeight: 950 }}>{trx.amount}</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 900, color: trx.status === 'Paid' ? 'var(--success)' : '#F59E0B' }}>{trx.status.toUpperCase()}</div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* High Dues Monitoring (Bumped Area Chart) */}
      <div className="card" style={{ padding: '32px', borderRadius: '32px', marginTop: '32px' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
               <h3 style={{ fontSize: '1.25rem', fontWeight: 950, margin: 0 }}>High Dues Monitoring</h3>
               <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tracking cumulative outstanding balances for top priority student profiles.</p>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
               {['#4880FF', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'].map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                     <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: c }}></div>
                     Profile {i+1}
                  </div>
               ))}
            </div>
         </div>
         <div style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={highDuesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: 'var(--text-muted)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: 'var(--text-muted)' }} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: 'var(--shadow-xl)' }} />
                  <Area type="monotone" dataKey="Alex" stackId="1" stroke="#4880FF" strokeWidth={3} fill="#4880FF" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="Sarah" stackId="1" stroke="#10B981" strokeWidth={3} fill="#10B981" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="Michael" stackId="1" stroke="#F59E0B" strokeWidth={3} fill="#F59E0B" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="Emily" stackId="1" stroke="#EF4444" strokeWidth={3} fill="#EF4444" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="Robert" stackId="1" stroke="#8B5CF6" strokeWidth={3} fill="#8B5CF6" fillOpacity={0.6} />
               </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>
      
      {/* Forecast Modal */}
      <AnimatePresence>
        {showForecastModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', padding: '24px' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForecastModal(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '600px', position: 'relative', boxShadow: 'var(--shadow-2xl)' }}
            >
              <button 
                onClick={() => setShowForecastModal(false)}
                style={{ position: 'absolute', top: '32px', right: '32px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '8px', borderRadius: '10px', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Close"
              >
                <X size={20} />
              </button>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '8px' }}>
                <TrendingUp size={24} />
                <span style={{ fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>AI Revenue Forecaster</span>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px' }}>Predictive Financial Modeler</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Simulate growth parameters to forecast future fee collections and budget targets.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontWeight: 800, fontSize: '0.85rem' }}>Projection Term</label>
                    <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.85rem' }}>{forecastMonths} Months</span>
                  </div>
                  <input 
                    type="range" 
                    min="3" 
                    max="12" 
                    value={forecastMonths} 
                    onChange={(e) => setForecastMonths(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                    <span>3 Months</span>
                    <span>6 Months</span>
                    <span>12 Months</span>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontWeight: 800, fontSize: '0.85rem' }}>Expected Annual Growth Rate</label>
                    <span style={{ fontWeight: 800, color: '#10B981', fontSize: '0.85rem' }}>+{growthRate}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="20" 
                    value={growthRate} 
                    onChange={(e) => setGrowthRate(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: '#10B981', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                    <span>+1% Growth</span>
                    <span>+10% Growth</span>
                    <span>+20% Growth</span>
                  </div>
                </div>

                {/* Results Card */}
                {(() => {
                  const { projected, cumulative } = getForecastedData();
                  return (
                    <div style={{ padding: '20px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                        <div>
                          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Forecasted Revenue</div>
                          <div style={{ fontWeight: 950, fontSize: '1.4rem', color: 'var(--primary)' }}>₹{cumulative.toLocaleString()}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target Met Percentage</div>
                          <div style={{ fontWeight: 950, fontSize: '1.4rem', color: '#10B981' }}>{Math.round(100 + growthRate * 1.5)}%</div>
                        </div>
                      </div>

                      <div style={{ maxHeight: '150px', overflowY: 'auto', paddingRight: '8px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: 800, textAlign: 'left' }}>
                              <th style={{ padding: '6px 0' }}>MONTH</th>
                              <th style={{ padding: '6px 0', textAlign: 'right' }}>PROJECTED COLLECTION</th>
                              <th style={{ padding: '6px 0', textAlign: 'right' }}>CUMULATIVE</th>
                            </tr>
                          </thead>
                          <tbody>
                            {projected.map((p, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)', fontWeight: 700 }}>
                                <td style={{ padding: '8px 0', color: 'var(--text-main)' }}>{p.month}</td>
                                <td style={{ padding: '8px 0', textAlign: 'right', color: 'var(--primary)' }}>₹{p.projectedRevenue.toLocaleString()}</td>
                                <td style={{ padding: '8px 0', textAlign: 'right', color: 'var(--text-muted)' }}>₹{p.cumulative.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button className="btn" onClick={() => setShowForecastModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', fontWeight: 800 }}>Close Forecaster</button>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    const { cumulative } = getForecastedData();
                    showToast(`Simulated forecast applied! Projected collection target adjusted to ₹${cumulative.toLocaleString()}.`, 'success', 'Forecast Applied');
                    setShowForecastModal(false);
                  }}
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', fontWeight: 800, border: 'none', cursor: 'pointer' }}
                >
                  Apply Forecast Target
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <ToastRenderer toast={toast} onClose={hideToast} />
    </motion.div>
  );
};

export default FeesDashboard;
