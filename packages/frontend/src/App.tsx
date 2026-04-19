import { useState } from "react";
import { trpc } from "./trpc";
import { useAuthStore } from "./store/useAuthStore";
import { WorkoutHistory } from "./components/WorkoutHistory";

function App() {
  const { apiKey, setApiKey, clearApiKey } = useAuthStore();

  const [apiKeyInput, setApiKeyInput] = useState("");

  const userQuery = trpc.user.info.useQuery(undefined, {
    enabled: !!apiKey,
  });

  const handleSaveApiKey = () => {
    if (!apiKeyInput) return;
    setApiKey(apiKeyInput);
  };

  const handleDisconnect = () => {
    clearApiKey();
    setApiKeyInput("");
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

      {userQuery.isLoading && (
        <div className="mb-12 bg-white border border-gray-200 rounded-xl p-8 shadow-sm flex items-center justify-center">
          <p className="text-gray-500 animate-pulse font-medium">
            Fetching profile from Hevy...
          </p>
        </div>
      )}

      {userQuery.isError && (
        <div className="mb-12 bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          <p className="font-bold">Failed to load profile</p>
          <p className="text-sm">{userQuery.error.message}</p>
        </div>
      )}

      {userQuery.data && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Hevy Profile Info
          </h2>

          <div className="bg-gray-100 p-4 md:p-6 rounded-lg border border-gray-200 shadow-inner overflow-x-auto">
            <p className="text-green-600 font-bold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span>Connected Successfully</span>
            </p>
            <pre className="text-sm text-gray-700 m-0">
              {JSON.stringify(userQuery.data, null, 2)}
            </pre>
          </div>
        </section>
      )}

      <section>
        <WorkoutHistory />
      </section>
    </div>
  );
}

export default App;
