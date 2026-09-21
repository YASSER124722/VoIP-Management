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

  if (d === "ANSWERED") {
    return (
      <span className="badge badge-success">
        {disposition}
      </span>
    );
  }

  if (d === "FAILED" || d === "BUSY") {
    return (
      <span className="badge badge-danger">
        {disposition}
      </span>
    );
  }

  if (d === "NO ANSWER") {
    return (
      <span className="badge badge-warning">
        {disposition}
      </span>
    );
  }

  return (
    <span className="badge badge-default">
      {disposition}
    </span>
  );
}

export default function Dashboard() {
  const [extensionCount, setExtensionCount] = useState(0);
  const [callsCount, setCallsCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [missedCount, setMissedCount] = useState(0);
  const [calls, setCalls] = useState<Call[]>([]);
  const [loadingCalls, setLoadingCalls] = useState(true);

  useEffect(() => {
    // Get extension count
    fetch("/api/extensions")
      .then((response) => response.json())
      .then((data) => {
        setExtensionCount(
          data.data?.fetchAllExtensions?.totalCount || 0
        );
      });

    // Get calls
    setLoadingCalls(true);

    fetch("/api/calls")
      .then((response) => response.json())
      .then((data) => {
        const cdrs: Call[] =
          data.data?.fetchAllCdrs?.cdrs || [];

        // Total calls from the API
        setCallsCount(
          data.data?.fetchAllCdrs?.totalCount || 0
        );

        setCalls(cdrs);

        // Today's date
        const today = new Date().toLocaleDateString("en-CA");

        // Keep only today's calls
        const todayCalls = cdrs.filter((call) => {
          const callDate = call.calldate.split(" ")[0];

          return callDate === today;
        });

        // Today's answered calls
        setAnsweredCount(
          todayCalls.filter(
            (call) =>
              call.disposition?.toUpperCase() === "ANSWERED"
          ).length
        );

        // Today's missed calls
        setMissedCount(
          todayCalls.filter(
            (call) =>
              call.disposition?.toUpperCase() === "NO ANSWER"
          ).length
        );
      })
      .finally(() => {
        setLoadingCalls(false);
      });
  }, []);

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        className="page-header"
        style={{
          width: "100%",
          maxWidth: "1200px",
          display: "flex",
        }}
      >
        <h2>Dashboard</h2>
      </div>

      <div
        className="stat-grid"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "24px",
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        {/* Extensions */}
        <div
          className="stat-card"
          style={{
            flex: "1 1 240px",
            maxWidth: "350px",
          }}
        >
          <h3>Extensions</h3>
          <p>{extensionCount}</p>
        </div>

        {/* Calls */}
        <div
          className="stat-card"
          style={{
            flex: "1 1 240px",
            maxWidth: "350px",
          }}
        >
          <h3>Calls</h3>
          <p>{callsCount}</p>
        </div>

        {/* Answered - TODAY */}
        <div
          className="stat-card"
          style={{
            flex: "1 1 240px",
            maxWidth: "350px",
          }}
        >
          <h3 style={{ color: "var(--success)" }}>
            Answered Today
          </h3>
          <p style={{ color: "var(--success)" }}>
            {answeredCount}
          </p>
        </div>

        {/* Missed - TODAY */}
        <div
          className="stat-card"
          style={{
            flex: "1 1 240px",
            maxWidth: "350px",
          }}
        >
          <h3 style={{ color: "var(--danger)" }}>
            Missed Today
          </h3>
          <p style={{ color: "var(--danger)" }}>
            {missedCount}
          </p>
        </div>
      </div>

      {/* Recent Calls */}
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          marginTop: "24px",
        }}
      >
        <h3
          style={{
            marginBottom: "16px",
            fontSize: "18px",
            fontWeight: 600,
          }}
        >
          Recent Calls
        </h3>

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
              {!loadingCalls && calls.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{ textAlign: "center" }}
                  >
                    No calls found.
                  </td>
                </tr>
              ) : (
                calls.slice(0, 5).map((call) => (
                  <tr key={call.id}>
                    <td style={{ fontWeight: 500 }}>
                      {call.src}
                    </td>

                    <td>{call.dst}</td>

                    <td>
                      {dispositionBadge(call.disposition)}
                    </td>

                    <td>{call.duration}s</td>

                    <td
                      style={{
                        color: "var(--text-muted)",
                      }}
                    >
                      {call.calldate}
                    </td>
                  </tr>
                ))
              )}

              {loadingCalls && (
                <tr>
                  <td
                    colSpan={5}
                    style={{ textAlign: "center" }}
                  >
                    Loading calls...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}