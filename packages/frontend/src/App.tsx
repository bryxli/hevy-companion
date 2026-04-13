import { useState } from "react";
import { trpc } from "./trpc";

function App() {
  const apiKey = localStorage.getItem("hevy-api-key");

  const [apiKeyInput, setApiKeyInput] = useState("");

  const healthQuery = trpc.health.useQuery();

  const handleSaveApiKey = () => {
    if (!apiKeyInput) return;
    localStorage.setItem("hevy-api-key", apiKeyInput);
    window.location.reload();
  };

  const handleDisconnect = () => {
    localStorage.removeItem("hevy-api-key");
    window.location.reload();
  };

  if (!apiKey) {
    return (
      <div
        style={{ padding: "2rem", maxWidth: "400px", fontFamily: "sans-serif" }}
      >
        <h1>🏋️ Hevy Companion</h1>
        <p>Please enter your Hevy Developer API Key to continue:</p>

        <input
          type="password"
          placeholder="Enter API Key..."
          value={apiKeyInput}
          onChange={(e) => setApiKeyInput(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "1rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={handleSaveApiKey}
          style={{
            padding: "8px 16px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Save Key
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #eee",
          paddingBottom: "1rem",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ margin: 0 }}>🏋️ Hevy Companion</h1>
        <button
          onClick={handleDisconnect}
          style={{
            padding: "6px 12px",
            background: "transparent",
            color: "#dc2626",
            border: "1px solid #dc2626",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Disconnect Key
        </button>
      </div>

      <h3>Backend Connection Test</h3>

      {healthQuery.isLoading && <p>Sending request to backend...</p>}

      {healthQuery.isError && (
        <p style={{ color: "#dc2626" }}>Error: {healthQuery.error.message}</p>
      )}

      {healthQuery.data && (
        <div
          style={{
            background: "#f3f4f6",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          <p
            style={{
              margin: "0 0 8px 0",
              color: "#16a34a",
              fontWeight: "bold",
            }}
          >
            ✅ Connected
          </p>
          <pre style={{ margin: 0 }}>
            {JSON.stringify(healthQuery.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;
