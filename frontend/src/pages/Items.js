import { useEffect, useState } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
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
    <>
      <div style={{ display: 'flex', marginBottom: '1rem', gap: '0.5rem' }}>
        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
        <button onClick={handleSearch}>Search</button>
      </div>

      <List>
        {items.map(item => (
          <Link key={item.id} to={'/items/' + item.id}>
            <ListItem>
              <ListItemText
                primary={item.name}
                secondary={`${item.category} — $${item.price}`}
              />
            </ListItem>
            <Divider />
          </Link>
        ))}
      </List>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <Button variant="outlined" onClick={handlePrev} disabled={page === 1}>
          Previous
        </Button>
        <span>Page {page}</span>
        <Button variant="outlined" onClick={handleNext} disabled={page >= totalPages}>
          Next
        </Button>
      </div>
    </>
  );
}

export default Items;