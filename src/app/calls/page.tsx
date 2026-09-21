"use client";

import { useEffect, useState } from "react";

type Call = {
  id: string;
  src: string;
  dst: string;
  duration: number;
  billsec: number;
  disposition: string;
  calldate: string;
};

function dispositionBadge(disposition: string) {
  const d = disposition?.toUpperCase();
  if (d === "ANSWERED") return <span className="badge badge-success">{disposition}</span>;
  if (d === "FAILED" || d === "BUSY") return <span className="badge badge-danger">{disposition}</span>;
  if (d === "NO ANSWER") return <span className="badge badge-warning">{disposition}</span>;
  return <span className="badge badge-default">{disposition}</span>;
}

export default function Calls() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCalls = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/calls");
      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Failed to load calls");
      }

      setCalls(data.data?.fetchAllCdrs?.cdrs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load calls");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalls();
  }, []);

  return (
    <main>
      <div className="page-header">
        <h2>Calls</h2>
        <button onClick={loadCalls} disabled={loading} className="btn-secondary">
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th>Duration</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {!loading && !error && calls.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>No calls found.</td>
              </tr>
            ) : (
              calls.map((call) => (
                <tr key={call.id}>
                  <td style={{ fontWeight: 500 }}>{call.src}</td>
                  <td>{call.dst}</td>
                  <td>{dispositionBadge(call.disposition)}</td>
                  <td>{call.duration}s</td>
                  <td style={{ color: "var(--text-muted)" }}>{call.calldate}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
