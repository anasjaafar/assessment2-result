import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Items from './Items';
import ItemDetail from './ItemDetail';
import { DataProvider } from '../state/DataContext';

function App() {
  return (
    <DataProvider>
      <nav 
        style={{
          backgroundColor: '#1976d2',
          color: 'white',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Link 
          to="/"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '1.25rem',
            fontWeight: 600,
            letterSpacing: '0.5px',
            transition: '0.2s opacity ease',
            fontFamily:
              '"Poppins", "Inter", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
          }}
          onMouseEnter={(e) => (e.target.style.opacity = 0.8)}
          onMouseLeave={(e) => (e.target.style.opacity = 1)}
        >
          Items
        </Link>
      </nav>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#f3f4f6',
          padding: '2rem 1rem',
        }}
      >
        <Routes>
          <Route path="/" element={<Items />} />
          <Route path="/items/:id" element={<ItemDetail />} />
        </Routes>
      </div>
    </DataProvider>
  );
}

export default App;