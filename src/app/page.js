"use client";

import { useState, useEffect } from "react";

export default function HomePage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: "",
    email: "",
    address: "",
    city: ""
  });
  const [search, setSearch] = useState("");

  // 🔄 Fetch users
  useEffect(() => {
    fetch("/api/users")
      .then(res => res.json())
      .then(data => setUsers(data.users));
  }, []);

  // 📝 Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ➕ Submit user
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setForm({ username: "", email: "", address: "", city: "" });
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data.users);
  };

  // 🔍 Filtered users
  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.city ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Hello from PC!</h1>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "8px", marginBottom: "1rem", width: "100%" }}
      />

      {/* ➕ Add User Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input name="username" value={form.username} onChange={handleChange} placeholder="Username" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
        <input name="address" value={form.address} onChange={handleChange} placeholder="Address" />
        <input name="city" value={form.city} onChange={handleChange} placeholder="City" />
        <button type="submit">Add User</button>
      </form>

      {/* 📋 Users Table */}
      <table border="1" cellPadding="10">
        <thead>
          <tr><th>Username</th><th>Email</th><th>Address</th><th>City</th></tr>
        </thead>
        <tbody>
          {filteredUsers.map((u, i) => (
            <tr key={i}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.address}</td>
              <td>{u.city}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
