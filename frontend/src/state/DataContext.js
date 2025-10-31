import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchItems = useCallback(async (limit, page, q) => {
    
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit);
    if (page) params.append('page', page);
    if (q) params.append('q', q);

    const url = params.toString()
      ? `http://localhost:4001/api/items?${params.toString()}`
      : `http://localhost:4001/api/items`;

    console.log('Fetching:', url);

    const res = await fetch(url);
    const json = await res.json();
    setItems(json.items || []);
    setTotal(json.total)
  }, []);

  return (
    <DataContext.Provider value={{ items, total, fetchItems }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);