"use client";

import { useEffect, useState } from "react";

export default function AssetPage() {
  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");
  const [results, setResults] = useState([]);
  const [searchTime, setSearchTime] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [liveFilter, setLiveFilter] = useState("");

  useEffect(() => {
  fetchAssets(""); // Fetch all on first load
}, []);


const filteredResults = results.filter(asset =>
  asset.name.toLowerCase().includes(filterText.toLowerCase()) ||
  asset.serial_number.toLowerCase().includes(filterText.toLowerCase()) ||
  asset.type.toLowerCase().includes(filterText.toLowerCase()) ||
  asset.location.toLowerCase().includes(filterText.toLowerCase()) ||
  (asset.user ?? '').toLowerCase().includes(filterText.toLowerCase())
);



  const fetchAssets = async (query) => {
    setSearchTime(null);
    const start = performance.now();
    try {
      const res = await fetch(`/api/assets?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      const end = performance.now();
      setSearchTime((end - start).toFixed(2));
      setResults(data.assets || []);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setResults([]);
    }
  };

  const handleSearchA = () => {
    setSearchB("");
    fetchAssets(searchA);
  };

  const handleSearchB = () => {
    setSearchA("");
    fetchAssets(searchB);
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Compare Search Bars</h1>

      {/* 🔍 Simple Search */}
      <div>
        <label>🔍 Search A (1 keyword):</label><br />
        <input
          value={searchA}
          onChange={(e) => setSearchA(e.target.value)}
          disabled={!!searchB}
        />
        <button onClick={handleSearchA} disabled={!searchA.trim()}>Search A</button>
      </div>

      {/* 🧠 Smart Search */}
      <div style={{ marginTop: "1rem" }}>
        <label>🧠 Search B (multi-keywords):</label><br />
        <input
          value={searchB}
          onChange={(e) => setSearchB(e.target.value)}
          disabled={!!searchA}
        />
        <button onClick={handleSearchB} disabled={!searchB.trim()}>Search B</button>
      </div>

      <h3 style={{ marginTop: '2rem' }}>Live Filter (Client-side)</h3>
<input
  type="text"
  placeholder="Type to filter below..."
  value={filterText}
  onChange={(e) => setFilterText(e.target.value)}
  style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
/>

      {searchTime && <p>Search took {searchTime} ms</p>}

      {/* 📋 Results */}
      <table border="1" cellPadding="10" style={{ marginTop: "2rem" }}>
        <thead>
          <tr>
            <th>Name</th><th>Serial #</th><th>Type</th><th>Location</th><th>User</th>
          </tr>
        </thead>
        <tbody>
  {filteredResults.map((a, i) => (
    <tr key={i}>
      <td>{a.name}</td>
      <td>{a.serial_number}</td>
      <td>{a.type}</td>
      <td>{a.location}</td>
      <td>{a.user}</td>
    </tr>
  ))}
  {filteredResults.length === 0 && (
    <tr><td colSpan="5">No results found</td></tr>
  )}
</tbody>

      </table>

    </main>
  );
}
