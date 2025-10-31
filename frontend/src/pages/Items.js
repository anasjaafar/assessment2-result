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
  console.log(items)

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

  const handleNext = () => setPage(prev => prev + 1);
  const handlePrev = () => setPage(prev => Math.max(1, prev - 1));

  if (!items.length) return <p>Loading...</p>;

  return (
    <>
      <div style={{ marginBottom: '1rem' }}>
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
        <Button variant="outlined" onClick={handleNext} disabled={total <= limit}>
          Next
        </Button>
      </div>
    </>
  );
}

export default Items;