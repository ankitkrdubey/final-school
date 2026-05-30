import React from 'react';
import { MoreVertical, Edit, Trash2, Eye } from 'lucide-react';

const Table = ({ columns, data, loading, onEdit, onDelete, onView }) => {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', border: 'none', boxShadow: 'var(--shadow-md)' }}>
      <div style={{ overflowX: 'auto' }}>
        <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              {columns.map((col, i) => (
                <th key={i} style={{ textAlign: 'left', padding: '18px 24px', whiteSpace: 'nowrap' }}>{col.header}</th>
              ))}
              <th style={{ textAlign: 'right', padding: '18px 24px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '60px' }}>
                  <div className="spinner" style={{ margin: '0 auto', width: '30px', height: '30px', border: '3px solid var(--primary-light)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  <p style={{ marginTop: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>Fetching records...</p>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                  No records found in the database.
                </td>
              </tr>
            ) : data.map((row, rowIndex) => (
              <tr key={rowIndex} style={{ borderBottom: '1px solid var(--border-color)', transition: '0.2s' }}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex} style={{ padding: '18px 24px' }}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                <td style={{ padding: '18px 24px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    {onView && (
                      <button onClick={() => onView(row)} className="btn-icon" title="View Details">
                        <Eye size={16} />
                      </button>
                    )}
                    {onEdit && (
                      <button onClick={() => onEdit(row)} className="btn-icon" title="Edit Record">
                        <Edit size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(row)} className="btn-icon btn-icon-danger" title="Delete Record">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
