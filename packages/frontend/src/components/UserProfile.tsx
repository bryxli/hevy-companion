import { trpc } from "../trpc";

export function UserProfile() {
  const {
    data: userInfo,
    isLoading,
    isError,
    error,
  } = trpc.user.info.useQuery();

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm flex items-center justify-center">
        <p className="text-gray-500 animate-pulse font-medium">
          Fetching profile from Hevy...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
        <p className="font-bold">Failed to load profile</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Hevy Profile Info</h2>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm overflow-x-auto">
        <p className="text-green-600 font-bold mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span>Connected Successfully</span>
        </p>
        <pre className="text-sm text-gray-700 m-0">
          {JSON.stringify(userInfo, null, 2)}
        </pre>
      </div>
    </div>
  );
}
