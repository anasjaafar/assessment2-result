import { useEffect, useState } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';

function Items() {
  const { items, total, fetchItems } = useData();
  const [active, setActive] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("")
  const limit = 5

  const totalPages = Math.ceil(total / limit);

  const loadItems = async(params = {}) => {
    try {
      const { limit, page, q } = params;
      await fetchItems(limit, page, q);
      if (!active) return;
    } catch (err) {
      if (active) console.error(err);
    }
  };

  useEffect(() => {
    loadItems({ limit, page });
    return () => {
      setActive(false);
    };
  }, [limit, searchQuery, page, fetchItems]);

  const handleSearch = () => {
    setPage(1);
    loadItems({ limit, page: 1, q: searchQuery });
  };

   const handleNext = () => {
    if (page < totalPages) setPage(prev => prev + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage(prev => prev - 1);
  };

  if (!items.length) return <p>Loading...</p>;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      margin: '2rem auto',
      maxWidth: '800px',
      backgroundColor: '#fff',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    }}>
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'center',
        marginBottom: '1.5rem',
      }}>
        <input 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            padding: '0.6rem 1rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
            outline: 'none',
            transition: '0.2s border-color ease',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#1976d2')}
          onBlur={(e) => (e.target.style.borderColor = '#ccc')}
        />
        <button 
          onClick={handleSearch}
          style={{
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.6rem 1.2rem',
            cursor: 'pointer',
            fontWeight: 500,
            transition: '0.2s background-color ease',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#1259a7')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#1976d2')}
        >
          Search
        </button>
      </div>

      <List>
        {items.map(item => (
          <div 
            key={item.id}
            style={{
              backgroundColor: '#f9fafb',
              borderRadius: '10px',
              marginBottom: '0.75rem',
              transition: '0.2s transform ease, 0.2s box-shadow ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Link 
              to={'/items/' + item.id}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <ListItem>
                <ListItemText
                  primary={
                    <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>
                      {item.name}
                    </span>
                  }
                  secondary={
                    <span style={{ color: '#555' }}>
                      {item.category} — ${item.price}
                    </span>
                  }
                />
              </ListItem>
            </Link>
          </div>
        ))}
      </List>

      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '1.5rem',
        }}
      >
        <Button 
          variant="outlined" 
          onClick={handlePrev} 
          disabled={page === 1} 
          sx={{ textTransform: 'none' }}
        >
          ← Previous
        </Button>
        <span style={{ fontWeight: 500, fontSize: '1.05rem' }}>
          Page {page} of {totalPages || 1}
        </span>
        <Button 
          variant="outlined" 
          onClick={handleNext} 
          disabled={page >= totalPages}
          sx={{ textTransform: 'none' }}
        >
          Next →
        </Button>
      </div>
    </div>
  );
}

export default Items;