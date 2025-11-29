// src/components/ExpenseList.js
import React, { useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';
import api from '../api/api';

export default function ExpenseList({ expenses: propExpenses }) {
  const { expenses: contextExpenses, fetchExpenses, loading } = useContext(ExpenseContext);

  const expensesToShow = propExpenses || contextExpenses;

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await api.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <div>Loading expenses...</div>;
  if (!expensesToShow || expensesToShow.length === 0) return <div>No expenses yet.</div>;

  const maxVisibleRows = 4;
  const rowHeight = 48; // approximate row height in px
  const containerHeight =
    expensesToShow.length > maxVisibleRows
      ? maxVisibleRows * rowHeight
      : 'auto'; // only scroll if more than 4 rows

  return (
    <div
      style={{
        maxHeight: containerHeight,
        overflowY: expensesToShow.length > maxVisibleRows ? 'auto' : 'visible',
        border: '1px solid #ddd',
        borderRadius: 8,
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#f1f3f6' }}>
          <tr style={{ borderBottom: '1px solid #ddd' }}>
            <th style={{ textAlign: 'left', padding: 8 }}>Amount</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Category</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Date</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Description</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {expensesToShow.map((exp, index) => (
            <tr
              key={exp._id}
              style={{
                borderBottom:
                  index === expensesToShow.length - 1 ? 'none' : '1px solid #f0f0f0',
              }}
            >
              <td style={{ padding: 8 }}>{exp.amount}₹</td>
              <td style={{ padding: 8 }}>{exp.category}</td>
              <td style={{ padding: 8 }}>
                {new Date(exp.date).toLocaleDateString()}
              </td>
              <td style={{ padding: 8 }}>{exp.description}</td>
              <td style={{ padding: 8 }}>
                <button
                  style={{
                    padding: '6px 12px',
                    background: '#e74c3c',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                  }}
                  onClick={() => handleDelete(exp._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
