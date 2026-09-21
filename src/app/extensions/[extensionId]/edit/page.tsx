"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditExtension() {
  const params = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/extensions")
      .then((response) => response.json())
      .then((data) => {
        const extensions = data.data?.fetchAllExtensions?.extension || [];

        const extension = extensions.find(
          (item: any) => item.extensionId === params.extensionId,
        );

        if (extension) {
          setName(extension.user.name);
        }
      });
    setLoading(false);
  }, [params.extensionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/extensions", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        extensionId: params.extensionId,
        name,
        email,
        ...(secret && { extPassword: secret }),
      }),
    });

    const result = await response.json();

    console.log(result);

    if (result.success) {
      alert(result.message);
      router.push("/extensions");
    } else {
      alert(result.message || "Failed to update extension");
    }
  };

  return (
    <main>
      <div className="page-header">
        <h2>Edit Extension</h2>
      </div>

      <p style={{ color: "var(--text-muted)", marginBottom: "24px", fontSize: "15px" }}>
        Extension: <span style={{ color: "var(--accent)", fontWeight: 600 }}>{params.extensionId}</span>
      </p>

      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading extension...</p>
      ) : (
        <div className="form-card">
          <form onSubmit={handleSubmit}>
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

            <div>
              <label htmlFor="secret">Secret (SIP Password)</label>
              <input
                id="secret"
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Leave empty to keep current"
                autoComplete="new-password"
              />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
              <button type="submit" className="btn-primary">Save Changes</button>
              <button type="button" className="btn-secondary" onClick={() => router.push("/extensions")}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
