'use client';

import { useState } from 'react';


export default function AssetSearchPage() {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);
  const [searchTime, setSearchTime] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    setLoading(true);
    const start = performance.now();

try {
  const res = await fetch(`/api/assets?q=${encodeURIComponent(searchText)}`);
  const data = await res.json();
  const end = performance.now();
  setSearchTime((end - start).toFixed(2));
  setResults(data.assets || []);
} catch (error) {
  console.error("Fetch error:", error);
  setResults([]);
  setSearchTime(null);
}



    setLoading(false);
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 600, margin: 'auto' }}>
      <h1>Asset Search</h1>

      <input
        type="text"
        placeholder="Search by name, type, or user"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginTop: '1rem' }}
      />

      <button
        onClick={handleSearch}
        disabled={loading || !searchText.trim()}
        style={{ marginTop: '1rem' }}
      >
        {loading ? 'Searching...' : 'Search'}
      </button>

      {searchTime !== null && (
        <p style={{ marginTop: '1rem' }}>Search took: {searchTime} ms</p>
      )}

      <div style={{ marginTop: '2rem' }}>
        <h2>Results:</h2>
        {results.length === 0 && !loading && <p>No results found.</p>}
        {results.map((asset, i) => (
          <div
            key={i}
            style={{
              borderBottom: '1px solid #ccc',
              padding: '0.5rem 0',
            }}
          >
            <strong>{asset.name}</strong> — SN#: {asset.serial_number} <br />
            Type: {asset.type} <br />
            Location: {asset.location || 'N/A'} <br />
            User: {asset.user || 'N/A'}
          </div>
        ))}
      </div>
    </div>
  );
}
