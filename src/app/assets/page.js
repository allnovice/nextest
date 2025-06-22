"use client";

import { useEffect, useState } from "react";
import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  getDocs,
  collection,
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

export default function AssetPage() {
  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");
  const [results, setResults] = useState([]);
  const [searchTime, setSearchTime] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [moodData, setMoodData] = useState([]);
  const [isOffline, setIsOffline] = useState(false);

  // Fetch EdgeDB assets
  useEffect(() => {
    fetchAssets("");
  }, []);
  useEffect(() => {
  fetchMoodStats();
}, []);

useEffect(() => {
  const updateStatus = () => setIsOffline(!navigator.onLine);

  window.addEventListener("online", updateStatus);
  window.addEventListener("offline", updateStatus);

  updateStatus(); // run once on load

  return () => {
    window.removeEventListener("online", updateStatus);
    window.removeEventListener("offline", updateStatus);
  };
}, []);

const fetchMoodStats = async () => {
  const snap = await getDocs(collection(db, "moods"));
  const data = snap.docs.map(doc => ({
    mood: doc.id,
    count: doc.data().count
  }));
  setMoodData(data);
};

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
  const keywords = searchB.trim().split(/\s+/); // Split by spaces
  fetchAssets(keywords); // Send array instead of string
};


  // Save mood to Firestore
  const saveMood = async (mood) => {
    try {
      const moodDocRef = doc(db, "moods", mood); // Emoji as doc ID
      const docSnap = await getDoc(moodDocRef);

      if (docSnap.exists()) {
        await updateDoc(moodDocRef, {
          count: increment(1),
          lastUpdated: new Date()
        });
      } else {
        await setDoc(moodDocRef, {
          count: 1,
          lastUpdated: new Date()
        });
      }
      fetchMoodStats()
      alert(`Mood "${mood}" saved.`);
    } catch (error) {
      console.error("❌ Error saving mood:", error);
      alert("Failed to save mood.");
    }
  };

  const filteredResults = results.filter(asset =>
    asset.name.toLowerCase().includes(filterText.toLowerCase()) ||
    asset.serial_number.toLowerCase().includes(filterText.toLowerCase()) ||
    asset.type.toLowerCase().includes(filterText.toLowerCase()) ||
    asset.location.toLowerCase().includes(filterText.toLowerCase()) ||
    (asset.user ?? '').toLowerCase().includes(filterText.toLowerCase())
  );

  return (


    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
    {isOffline && (
  <div style={{
    backgroundColor: "#ffcccc",
    padding: "1rem",
    textAlign: "center",
    color: "#990000",
    fontWeight: "bold"
  }}>
    🔴 You’re offline. Changes will sync when back online.
  </div>
)}

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

      {/* 🔎 Client-side Filter */}
      <h3 style={{ marginTop: '2rem' }}>Live Filter (Client-side)</h3>
      <input
        type="text"
        placeholder="Type to filter below..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />

      {/* 😊 Mood Selector */}
<div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
  {/* Mood Selector */}
  <div>
    <h3>How are you feeling today?</h3>
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
      {['😊', '😐', '😞', '😠', '😴'].map((mood, index) => (
        <button
          key={index}
          onClick={() => saveMood(mood)}
          style={{
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          {mood}
        </button>
      ))}
    </div>
  </div>

  {/* Mood Stats Chart */}
  {moodData.length > 0 && (
    <div style={{ maxWidth: "200px" }}>
      <h3>Mood Stats</h3>
      <Pie
        data={{
          labels: moodData.map(d => d.mood),
          datasets: [{
            data: moodData.map(d => d.count),
            backgroundColor: ['#FFD700', '#A9A9A9', '#87CEFA', '#FF6347', '#9370DB']
          }]
        }}
      />
      <p>Total entries: {moodData.reduce((sum, d) => sum + d.count, 0)}</p>
    </div>
  )}
</div>



      {searchTime && <p>Search took {searchTime} ms</p>}

      {/* 📋 Results Table */}
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
