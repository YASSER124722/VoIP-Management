"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddExtension() {
  const router = useRouter();
  const [extension, setExtension] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/extensions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        extension,
        name,
        email,
      }),
    });

    const result = await response.json();
    if (result.success) {
      router.push("/extensions");
    } else {
      alert(result.message);
    }
  };

  return (
    <main>
      <div className="page-header">
        <h2>Add Extension</h2>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="extension">Extension</label>
            <input
              id="extension"
              type="text"
              value={extension}
              onChange={(e) => setExtension(e.target.value)}
              placeholder="e.g. 1001"
            />
          </div>

          <div>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
            />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
            />
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
            <button type="submit" className="btn-primary">Create Extension</button>
            <button type="button" className="btn-secondary" onClick={() => router.push("/extensions")}>Cancel</button>
          </div>
        </form>
      </div>
    </main>
  );
}
