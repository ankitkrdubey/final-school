import React, { useState } from 'react';
import { 
  Tags, Search, Plus, Filter, 
  BookOpen, Trophy, Music, Heart, Palette,
  Activity, Award, Sparkles, Loader2, CircleCheck, ShieldAlert, Trash2, Edit
} from 'lucide-react';
import Table from '../components/Table';
import { motion, AnimatePresence } from 'framer-motion';

const colorsList = [
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Rose', value: '#ec4899' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Sky', value: '#0ea5e9' },
  { name: 'Gold', value: '#eab308' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Crimson', value: '#ef4444' }
];

const iconsList = [
  { name: 'BookOpen', label: 'Academic', icon: <BookOpen size={16} /> },
  { name: 'Trophy', label: 'Athletics', icon: <Trophy size={16} /> },
  { name: 'Palette', label: 'Artistic', icon: <Palette size={16} /> },
  { name: 'Music', label: 'Musical', icon: <Music size={16} /> },
  { name: 'Heart', label: 'Service', icon: <Heart size={16} /> },
  { name: 'Activity', label: 'Fitness', icon: <Activity size={16} /> },
  { name: 'Award', label: 'Honors', icon: <Award size={16} /> },
  { name: 'Sparkles', label: 'Innovation', icon: <Sparkles size={16} /> }
];

const StudentCategories = () => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data promoted to dynamic reactive state
  const [categories, setCategories] = useState([
    { id: 1, name: 'Scholastic Elite', iconName: 'BookOpen', color: '#45b3e0', count: 120, description: 'Students with GPA above 3.8' },
    { id: 2, name: 'Sports Varsity', iconName: 'Trophy', color: '#f59e0b', count: 45, description: 'Active members of school sports teams' },
    { id: 3, name: 'Arts & Creative', iconName: 'Palette', color: '#ec4899', count: 32, description: 'Students enrolled in advanced arts programs' },
    { id: 4, name: 'Music Academy', iconName: 'Music', color: '#8b5cf6', count: 28, description: 'Band and choir members' },
    { id: 5, name: 'Community Service', iconName: 'Heart', color: '#10b981', count: 64, description: 'Students with 50+ volunteer hours' }
  ]);

  // Create Category modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createStep, setCreateStep] = useState('input'); // 'input', 'processing', 'success'
  const [createMsg, setCreateMsg] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryColor, setCategoryColor] = useState('#6366f1');
  const [categoryIcon, setCategoryIcon] = useState('BookOpen');

  // Edit Category modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editStep, setEditStep] = useState('input'); // 'input', 'processing', 'success'
  const [editMsg, setEditMsg] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editColor, setEditColor] = useState('#6366f1');
  const [editIcon, setEditIcon] = useState('BookOpen');

  // Delete Category modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStep, setDeleteStep] = useState('confirm'); // 'confirm', 'processing', 'success'
  const [deleteMsg, setDeleteMsg] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Helper to dynamically resolve lucide-react icon elements
  const getIconElement = (name, color, size = 18) => {
    const props = { size, color };
    switch (name) {
      case 'BookOpen': return <BookOpen {...props} />;
      case 'Trophy': return <Trophy {...props} />;
      case 'Palette': return <Palette {...props} />;
      case 'Music': return <Music {...props} />;
      case 'Heart': return <Heart {...props} />;
      case 'Activity': return <Activity {...props} />;
      case 'Award': return <Award {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      default: return <BookOpen {...props} />;
    }
  };

  const columns = [
    { 
      header: 'Category Name', 
      key: 'name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '40px', height: '40px', borderRadius: '12px', 
            backgroundColor: `${row.color}15`, color: row.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {getIconElement(row.iconName, row.color)}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{row.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.description}</div>
          </div>
        </div>
      )
    },
    { 
      header: 'Student Count', 
      key: 'count',
      render: (row) => (
        <span style={{ 
          padding: '6px 12px', backgroundColor: 'var(--bg-body)', 
          borderRadius: '10px', fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)' 
        }}>
          {row.count} Students
        </span>
      )
    },
    { 
      header: 'Status', 
      key: 'status',
      render: () => (
        <span style={{ 
          padding: '4px 8px', backgroundColor: 'var(--success-light)', 
          color: 'var(--success)', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 
        }}>
          Active
        </span>
      )
    }
  ];

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setCreateStep('processing');
    setCreateMsg('Registering category metadata in institutional registry...');

    setTimeout(() => {
      setCreateMsg('Provisioning storage clusters for category logs...');
    }, 500);

    setTimeout(() => {
      setCreateMsg('Completing category setup...');
    }, 1000);

    setTimeout(() => {
      const newCategory = {
        id: Date.now(),
        name: categoryName,
        iconName: categoryIcon,
        color: categoryColor,
        count: 0,
        description: categoryDescription || 'No description provided.'
      };
      setCategories(prev => [newCategory, ...prev]);
      setCreateStep('success');
    }, 1500);
  };

  const handleEditCategory = (e) => {
    e.preventDefault();
    if (!editName.trim()) return;

    setEditStep('processing');
    setEditMsg('Updating category registry metadata...');

    setTimeout(() => {
      setEditMsg('Synchronizing student associations...');
    }, 500);

    setTimeout(() => {
      setCategories(prev => prev.map(cat => 
        cat.id === selectedCategory.id 
          ? { ...cat, name: editName, iconName: editIcon, color: editColor, description: editDescription }
          : cat
      ));
      setEditStep('success');
    }, 1100);
  };

  const handleDeleteCategory = () => {
    if (!categoryToDelete) return;

    setDeleteStep('processing');
    setDeleteMsg('Declassifying category records...');

    setTimeout(() => {
      setDeleteMsg('Purging catalog references and links...');
    }, 500);

    setTimeout(() => {
      setCategories(prev => prev.filter(cat => cat.id !== categoryToDelete.id));
      setDeleteStep('success');
    }, 1100);
  };

  // Filter states
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [selectedColorFilter, setSelectedColorFilter] = useState('All');
  const [selectedCountFilter, setSelectedCountFilter] = useState('All');

  const filteredCategories = categories.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesColor = selectedColorFilter === 'All' || c.color.toLowerCase() === selectedColorFilter.toLowerCase();
    
    let matchesCount = true;
    if (selectedCountFilter === 'High') {
      matchesCount = c.count > 50;
    } else if (selectedCountFilter === 'Low') {
      matchesCount = c.count <= 50 && c.count > 0;
    } else if (selectedCountFilter === 'Empty') {
      matchesCount = c.count === 0;
    }
    
    return matchesSearch && matchesColor && matchesCount;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }}
      style={{ paddingBottom: '40px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0 }}>Student Categories</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Organize and group students based on academic, athletic, or extracurricular tracks.</p>
        </div>
        <button 
          onClick={() => {
            setCategoryName('');
            setCategoryDescription('');
            setCategoryColor('#6366f1');
            setCategoryIcon('BookOpen');
            setCreateStep('input');
            setShowCreateModal(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={18} /> Create Category
        </button>
      </div>

      {/* Grid view of Category Cards */}
      {filteredCategories.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', marginBottom: '32px', border: '1px dashed var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <Filter size={24} style={{ opacity: 0.7 }} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>No Matching Categories</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', maxWidth: '340px', lineHeight: 1.5 }}>No category matches your active color filters, count ranges, or search terms. Try clearing filters to reveal all records.</p>
          </div>
          {(selectedColorFilter !== 'All' || selectedCountFilter !== 'All' || searchQuery !== '') && (
            <button
              onClick={() => {
                setSelectedColorFilter('All');
                setSelectedCountFilter('All');
                setSearchQuery('');
              }}
              className="btn"
              style={{ backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', fontSize: '0.8rem', fontWeight: 700, padding: '8px 16px', borderRadius: '10px' }}
            >
              Clear Active Filters
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {filteredCategories.map((cat) => (
            <div key={cat.id} className="card" style={{ padding: '24px', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', transition: 'transform 0.2s' }}>
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px', backgroundColor: `${cat.color}10`, borderRadius: '50%' }}></div>
              
              {/* Hover Actions in Top Right */}
              <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px', zIndex: 5 }}>
                <button 
                  onClick={() => {
                    setSelectedCategory(cat);
                    setEditName(cat.name);
                    setEditDescription(cat.description);
                    setEditColor(cat.color);
                    setEditIcon(cat.iconName);
                    setEditStep('input');
                    setShowEditModal(true);
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                  title="Edit Category"
                  className="hover-color-accent"
                >
                  <Edit size={14} />
                </button>
                <button 
                  onClick={() => {
                    setCategoryToDelete(cat);
                    setDeleteStep('confirm');
                    setShowDeleteModal(true);
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                  title="Delete Category"
                  className="hover-color-danger"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: `${cat.color}15`, color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                {getIconElement(cat.iconName, cat.color, 20)}
              </div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 800 }}>{cat.name}</h3>
              <p style={{ margin: '0 0 20px 0', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, minHeight: '3em' }}>{cat.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>{cat.count} Students</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search categories..." 
              style={{ paddingLeft: '48px' }} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsFilterPanelOpen(prev => !prev)}
            className="btn" 
            style={{ 
              backgroundColor: isFilterPanelOpen ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-body)', 
              border: isFilterPanelOpen ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid var(--border-color)',
              color: isFilterPanelOpen ? '#6366f1' : 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 700
            }}
          >
            <Filter size={18} /> Filter 
            {(selectedColorFilter !== 'All' || selectedCountFilter !== 'All') && (
              <span style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: '#6366f1', 
                display: 'inline-block' 
              }} />
            )}
          </button>
        </div>

        {/* Expandable Filter Panel */}
        <AnimatePresence>
          {isFilterPanelOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: 20 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: 'hidden', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                {/* Accent Color Filter */}
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>FILTER BY ACCENT COLOR</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button
                      onClick={() => setSelectedColorFilter('All')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        border: '1px solid',
                        borderColor: selectedColorFilter === 'All' ? '#6366f1' : 'var(--border-color)',
                        backgroundColor: selectedColorFilter === 'All' ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-body)',
                        color: selectedColorFilter === 'All' ? '#6366f1' : 'var(--text-muted)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      All Colors
                    </button>
                    {colorsList.map(c => (
                      <button
                        key={c.value}
                        onClick={() => setSelectedColorFilter(c.value)}
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: c.value,
                          border: selectedColorFilter === c.value ? '2px solid var(--bg-card)' : 'none',
                          outline: selectedColorFilter === c.value ? `2px solid ${c.value}` : 'none',
                          cursor: 'pointer',
                          padding: 0,
                          transition: 'all 0.15s ease'
                        }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Student Count Range Filter */}
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>FILTER BY STUDENT COUNT</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {[
                      { value: 'All', label: 'All Counts' },
                      { value: 'High', label: '> 50 Students' },
                      { value: 'Low', label: '≤ 50 Students' },
                      { value: 'Empty', label: '0 Students' }
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setSelectedCountFilter(opt.value)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          border: '1px solid',
                          borderColor: selectedCountFilter === opt.value ? '#6366f1' : 'var(--border-color)',
                          backgroundColor: selectedCountFilter === opt.value ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-body)',
                          color: selectedCountFilter === opt.value ? '#6366f1' : 'var(--text-muted)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reset / Actions */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', gap: '10px' }}>
                  {(selectedColorFilter !== 'All' || selectedCountFilter !== 'All') && (
                    <button
                      onClick={() => {
                        setSelectedColorFilter('All');
                        setSelectedCountFilter('All');
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--danger)',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        padding: '8px 12px'
                      }}
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grid list detail table */}
      <Table 
        columns={columns} 
        data={filteredCategories} 
        loading={loading}
        onEdit={(row) => {
          setSelectedCategory(row);
          setEditName(row.name);
          setEditDescription(row.description);
          setEditColor(row.color);
          setEditIcon(row.iconName);
          setEditStep('input');
          setShowEditModal(true);
        }}
        onDelete={(row) => {
          setCategoryToDelete(row);
          setDeleteStep('confirm');
          setShowDeleteModal(true);
        }}
      />

      {/* Glassmorphic Create Category Dialog Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (createStep !== 'processing') setShowCreateModal(false);
            }}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              backgroundColor: 'rgba(15, 23, 42, 0.45)', 
              backdropFilter: 'blur(16px)', 
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              style={{ 
                width: '100%', maxWidth: '480px', backgroundColor: 'var(--bg-card)', 
                borderRadius: '30px', border: '1px solid var(--border-color)', overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            >
              {createStep === 'input' && (
                <div style={{ padding: '32px' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: `${categoryColor}15`, color: categoryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                        {getIconElement(categoryIcon, categoryColor, 20)}
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Create Category</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Configure administrative index properties</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowCreateModal(false)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer', fontWeight: 300 }}
                    >
                      &times;
                    </button>
                  </div>

                  <form onSubmit={handleCreateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="form-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>CATEGORY NAME</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        required
                        placeholder="e.g. Science Varsity"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 600 }}
                      />
                    </div>

                    <div className="form-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>DESCRIPTION</label>
                      <textarea 
                        className="form-input" 
                        rows="2"
                        placeholder="Describe the target audience or criteria..."
                        value={categoryDescription}
                        onChange={(e) => setCategoryDescription(e.target.value)}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 600, resize: 'none' }}
                      />
                    </div>

                    <div className="form-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>ACCENT COLOR</label>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {colorsList.map((colorItem) => (
                          <button
                            type="button"
                            key={colorItem.value}
                            onClick={() => setCategoryColor(colorItem.value)}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              backgroundColor: colorItem.value,
                              border: categoryColor === colorItem.value ? '3px solid var(--bg-card)' : 'none',
                              outline: categoryColor === colorItem.value ? `2px solid ${colorItem.value}` : 'none',
                              cursor: 'pointer',
                              padding: 0,
                              transition: 'all 0.15s ease'
                            }}
                            title={colorItem.name}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>REPRESENTATIVE ICON</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                        {iconsList.map((iconItem) => (
                          <button
                            type="button"
                            key={iconItem.name}
                            onClick={() => setCategoryIcon(iconItem.name)}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '10px 8px',
                              borderRadius: '12px',
                              border: '1px solid',
                              borderColor: categoryIcon === iconItem.name ? categoryColor : 'var(--border-color)',
                              backgroundColor: categoryIcon === iconItem.name ? `${categoryColor}10` : 'var(--bg-body)',
                              color: categoryIcon === iconItem.name ? categoryColor : 'var(--text-muted)',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {iconItem.icon}
                            <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>{iconItem.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                      <button 
                        type="button"
                        className="btn" 
                        onClick={() => setShowCreateModal(false)}
                        style={{ flex: 1, backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)' }}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="btn btn-primary" 
                        style={{ flex: 1.5, backgroundColor: categoryColor, border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      >
                        <Plus size={16} /> Create Category
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {createStep === 'processing' && (
                <div style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '28px' }}>
                    <div style={{ 
                      boxSizing: 'border-box', position: 'absolute', width: '80px', height: '80px',
                      border: '4px solid var(--border-color)', borderRadius: '50%'
                    }} />
                    <div style={{ 
                      boxSizing: 'border-box', position: 'absolute', width: '80px', height: '80px',
                      border: '4px solid', borderColor: categoryColor, borderRadius: '50%',
                      borderTopColor: 'transparent', animation: 'spin 1s linear infinite'
                    }} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: categoryColor }}>
                      <Loader2 size={28} style={{ animation: 'spin 2s linear infinite' }} />
                    </div>
                  </div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 800 }}>Enrolling Registry Group</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '300px', margin: 0, minHeight: '3em' }}>{createMsg}</p>
                </div>
              )}

              {createStep === 'success' && (
                <div style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                    style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: `${categoryColor}15`, color: categoryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px' }}
                  >
                    <CircleCheck size={48} />
                  </motion.div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: 800 }}>Category Created</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '320px', margin: '0 0 32px 0' }}>
                    <strong>{categoryName}</strong> has been successfully configured and mapped to current administrative directories.
                  </p>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => {
                      setShowCreateModal(false);
                    }}
                    style={{ width: '100%', backgroundColor: categoryColor, border: 'none', color: 'white' }}
                  >
                    Return to Dashboard
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glassmorphic Edit Category Dialog Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (editStep !== 'processing') setShowEditModal(false);
            }}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              backgroundColor: 'rgba(15, 23, 42, 0.45)', 
              backdropFilter: 'blur(16px)', 
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              style={{ 
                width: '100%', maxWidth: '480px', backgroundColor: 'var(--bg-card)', 
                borderRadius: '30px', border: '1px solid var(--border-color)', overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            >
              {editStep === 'input' && (
                <div style={{ padding: '32px' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: `${editColor}15`, color: editColor, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                        {getIconElement(editIcon, editColor, 20)}
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Edit Category</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Update index tag criteria</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowEditModal(false)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer', fontWeight: 300 }}
                    >
                      &times;
                    </button>
                  </div>

                  <form onSubmit={handleEditCategory} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="form-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>CATEGORY NAME</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        required
                        placeholder="e.g. Science Varsity"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 600 }}
                      />
                    </div>

                    <div className="form-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>DESCRIPTION</label>
                      <textarea 
                        className="form-input" 
                        rows="2"
                        placeholder="Describe the target audience or criteria..."
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontWeight: 600, resize: 'none' }}
                      />
                    </div>

                    <div className="form-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>ACCENT COLOR</label>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {colorsList.map((colorItem) => (
                          <button
                            type="button"
                            key={colorItem.value}
                            onClick={() => setEditColor(colorItem.value)}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              backgroundColor: colorItem.value,
                              border: editColor === colorItem.value ? '3px solid var(--bg-card)' : 'none',
                              outline: editColor === colorItem.value ? `2px solid ${colorItem.value}` : 'none',
                              cursor: 'pointer',
                              padding: 0,
                              transition: 'all 0.15s ease'
                            }}
                            title={colorItem.name}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>REPRESENTATIVE ICON</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                        {iconsList.map((iconItem) => (
                          <button
                            type="button"
                            key={iconItem.name}
                            onClick={() => setEditIcon(iconItem.name)}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '10px 8px',
                              borderRadius: '12px',
                              border: '1px solid',
                              borderColor: editIcon === iconItem.name ? editColor : 'var(--border-color)',
                              backgroundColor: editIcon === iconItem.name ? `${editColor}10` : 'var(--bg-body)',
                              color: editIcon === iconItem.name ? editColor : 'var(--text-muted)',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {iconItem.icon}
                            <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>{iconItem.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                      <button 
                        type="button"
                        className="btn" 
                        onClick={() => setShowEditModal(false)}
                        style={{ flex: 1, backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)' }}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="btn btn-primary" 
                        style={{ flex: 1.5, backgroundColor: editColor, border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      >
                        <CircleCheck size={16} /> Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {editStep === 'processing' && (
                <div style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '28px' }}>
                    <div style={{ 
                      boxSizing: 'border-box', position: 'absolute', width: '80px', height: '80px',
                      border: '4px solid var(--border-color)', borderRadius: '50%'
                    }} />
                    <div style={{ 
                      boxSizing: 'border-box', position: 'absolute', width: '80px', height: '80px',
                      border: '4px solid', borderColor: editColor, borderRadius: '50%',
                      borderTopColor: 'transparent', animation: 'spin 1s linear infinite'
                    }} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: editColor }}>
                      <Loader2 size={28} style={{ animation: 'spin 2s linear infinite' }} />
                    </div>
                  </div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 800 }}>Updating Registry</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '300px', margin: 0, minHeight: '3em' }}>{editMsg}</p>
                </div>
              )}

              {editStep === 'success' && (
                <div style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                    style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: `${editColor}15`, color: editColor, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px' }}
                  >
                    <CircleCheck size={48} />
                  </motion.div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: 800 }}>Changes Saved</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '320px', margin: '0 0 32px 0' }}>
                    <strong>{editName}</strong> has been successfully synchronized and updated across systems.
                  </p>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => {
                      setShowEditModal(false);
                    }}
                    style={{ width: '100%', backgroundColor: editColor, border: 'none', color: 'white' }}
                  >
                    Return to Dashboard
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glassmorphic Delete Category Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (deleteStep !== 'processing') setShowDeleteModal(false);
            }}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              backgroundColor: 'rgba(15, 23, 42, 0.45)', 
              backdropFilter: 'blur(16px)', 
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              style={{ 
                width: '100%', maxWidth: '450px', backgroundColor: 'var(--bg-card)', 
                borderRadius: '30px', border: '1px solid var(--border-color)', overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            >
              {deleteStep === 'confirm' && (
                <div style={{ padding: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShieldAlert size={20} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Delete Category</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Declassify tag index references</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowDeleteModal(false)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer', fontWeight: 300 }}
                    >
                      &times;
                    </button>
                  </div>

                  <div style={{ 
                    padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: '16px', 
                    border: '1px solid rgba(239, 68, 68, 0.1)', marginBottom: '24px', display: 'flex', gap: '12px'
                  }}>
                    <ShieldAlert size={20} color="var(--danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>Declassify Database Registry</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                        You are about to delete category <strong>{categoryToDelete?.name}</strong>. This removes the administrative classification. Students grouped in this category will be unassigned.
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      className="btn" 
                      onClick={() => setShowDeleteModal(false)}
                      style={{ flex: 1, backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)' }}
                    >
                      Cancel
                    </button>
                    <button 
                      className="btn btn-primary" 
                      onClick={handleDeleteCategory}
                      style={{ 
                        flex: 1.5, 
                        backgroundColor: 'var(--danger)', 
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <Trash2 size={16} /> Authorize Deletion
                    </button>
                  </div>
                </div>
              )}

              {deleteStep === 'processing' && (
                <div style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '28px' }}>
                    <div style={{ 
                      boxSizing: 'border-box', position: 'absolute', width: '80px', height: '80px',
                      border: '4px solid var(--border-color)', borderRadius: '50%'
                    }} />
                    <div style={{ 
                      boxSizing: 'border-box', position: 'absolute', width: '80px', height: '80px',
                      border: '4px solid var(--danger)', borderRadius: '50%',
                      borderTopColor: 'transparent', animation: 'spin 1s linear infinite'
                    }} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--danger)' }}>
                      <Loader2 size={28} style={{ animation: 'spin 2s linear infinite' }} />
                    </div>
                  </div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 800 }}>Enforcing Database Purge</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '300px', margin: 0, minHeight: '3em' }}>{deleteMsg}</p>
                </div>
              )}

              {deleteStep === 'success' && (
                <div style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                    style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px' }}
                  >
                    <CircleCheck size={48} />
                  </motion.div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: 800 }}>Category Purged</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '320px', margin: '0 0 32px 0' }}>
                    <strong>{categoryToDelete?.name}</strong> has been successfully zero-filled and declassified from registers.
                  </p>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => {
                      setShowDeleteModal(false);
                      setCategoryToDelete(null);
                    }}
                    style={{ width: '100%', backgroundColor: 'var(--danger)', border: 'none', color: 'white' }}
                  >
                    Return to Dashboard
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StudentCategories;
