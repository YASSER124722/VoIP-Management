"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Extension = {
  extensionId: string;
  tech: string;
  user: {
    name: string;
  };
};

export default function Extensions() {
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadExtensions = () => {
    setLoading(true);
    setError("");

    fetch("/api/extensions")
      .then((response) => response.json())
      .then((data) => {
        if (data.errors) {
          setError("Failed to load extensions");
          return;
        }

        setExtensions(data.data?.fetchAllExtensions?.extension || []);
      })
      .catch(() => {
        setError("Failed to connect to the server");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadExtensions();
  }, []);

  const handleDelete = async (extensionId: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete extension ${extensionId}?`,
    );

    if (!confirmed) {
      return;
    }

    const response = await fetch("/api/extensions", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        extensionId,
      }),
    });

    const result = await response.json();

    console.log(result);
    if (!result.errors) {
      setExtensions((current) =>
        current.filter((extension) => extension.extensionId !== extensionId),
      );

      alert("Extension deleted successfully");
    } else {
      alert("Failed to delete extension");
    }
  };

  return (
    <main>
      <div className="page-header">
        <h2>Extensions</h2>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={loadExtensions} disabled={loading} className="btn-secondary">
            {loading ? "Loading..." : "↻ Refresh"}
          </button>
          <Link href="/extensions/add">
            <button className="btn-primary">+ Add Extension</button>
          </Link>
        </div>
      </div>
      
      {error && <div className="alert-error">{error}</div>}
      
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Extension</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={3} style={{ textAlign: "center" }}>Loading...</td>
              </tr>
            )}
            {!loading && !error && extensions.length === 0 && (
              <tr>
                <td colSpan={3} style={{ textAlign: "center" }}>No extensions found.</td>
              </tr>
            )}
            {extensions.map((extension) => (
              <tr key={extension.extensionId}>
                <td style={{ fontWeight: 600 }}>{extension.extensionId}</td>
                <td>{extension.user.name}</td>
                <td>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Link href={`/extensions/${extension.extensionId}/edit`}>
                      <button className="btn-ghost">Edit</button>
                    </Link>
                    <button className="btn-danger" onClick={() => handleDelete(extension.extensionId)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
