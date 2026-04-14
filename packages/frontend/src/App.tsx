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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🏋️ Hevy Companion
          </h1>
          <p className="text-gray-600 mb-6">
            Please enter your Hevy Developer API Key to continue:
          </p>

          <input
            type="password"
            placeholder="Enter API Key..."
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleSaveApiKey}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Save Key
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-4 mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 m-0">
          🏋️ Hevy Companion
        </h1>
        <button
          onClick={handleDisconnect}
          className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 rounded-lg transition-colors"
        >
          Disconnect Key
        </button>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Backend Connection Test
      </h3>

      {healthQuery.isLoading && (
        <p className="text-gray-500 animate-pulse">
          Sending request to backend...
        </p>
      )}

      {healthQuery.isError && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          Error: {healthQuery.error.message}
        </div>
      )}

      {healthQuery.data && (
        <div className="bg-gray-100 p-4 md:p-6 rounded-lg border border-gray-200 shadow-inner overflow-x-auto">
          <p className="text-green-600 font-bold mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Connected
          </p>
          <pre className="text-sm text-gray-700 m-0">
            {JSON.stringify(healthQuery.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;
