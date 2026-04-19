import { useAuthStore } from "../store/useAuthStore";

export function Header() {
  const { clearApiKey } = useAuthStore();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-4 mb-8 gap-4">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 m-0">
        🏋️ Hevy Companion
      </h1>
      <button
        onClick={clearApiKey}
        className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 rounded-lg transition-colors"
      >
        Disconnect Key
      </button>
    </div>
  );
}
