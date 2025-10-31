import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:4001/api/items/' + id)
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(setItem)
      .catch(() => navigate('/'));
  }, [id, navigate]);

  if (!item) return <p>Loading...</p>;

  return (
    <div
      style={{
        maxWidth: '700px',
        margin: '2rem auto',
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h2
        style={{
          fontSize: '1.75rem',
          marginBottom: '1rem',
          color: '#1976d2',
          borderBottom: '2px solid #e0e0e0',
          paddingBottom: '0.5rem',
        }}
      >
        {item.name}
      </h2>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          fontSize: '1.05rem',
          color: '#333',
        }}
      >
        <p>
          <strong style={{ color: '#555' }}>Category:</strong> {item.category}
        </p>
        <p>
          <strong style={{ color: '#555' }}>Price:</strong>{' '}
          <span style={{ color: '#2e7d32', fontWeight: 600 }}>${item.price}</span>
        </p>
      </div>

      <div
        style={{
          marginTop: '2rem',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <button
          onClick={() => window.history.back()}
          style={{
            backgroundColor: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.6rem 1.2rem',
            cursor: 'pointer',
            fontWeight: 500,
            transition: '0.2s ease',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#1259a7')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#1976d2')}
        >
          ← Back to Items
        </button>
      </div>
    </div>
  );
}

export default ItemDetail;