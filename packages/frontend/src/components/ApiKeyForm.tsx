import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

export function ApiKeyForm() {
  const { setApiKey } = useAuthStore();
  const [apiKeyInput, setApiKeyInput] = useState("");

  const handleSaveApiKey = () => {
    if (!apiKeyInput) return;
    setApiKey(apiKeyInput);
  };

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
