import { useState } from "react";
import { trpc } from "../trpc";

export function WorkoutHistory() {
  const [limit, setLimit] = useState(3);
  const {
    data: workouts,
    isLoading,
    isError,
    error,
  } = trpc.workouts.history.useQuery({ limit });

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm flex items-center justify-center">
        <p className="text-gray-500 animate-pulse font-medium">
          Loading heavy lifts...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        <p className="font-bold">Failed to load workouts</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Recent Workouts</h2>
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-white"
        >
          <option value={1}>Last Workout</option>
          <option value={3}>Last 3 Workouts</option>
          <option value={5}>Last 5 Workouts</option>
          <option value={10}>Last 10 Workouts</option>
        </select>
      </div>

      {workouts?.map((workout) => (
        <div
          key={workout.id}
          className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {workout.title}
              </h3>
              <p className="text-sm text-gray-500">
                {new Date(workout.start_time).toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
              {workout.exercises.length} Exercises
            </span>
          </div>

          <div className="space-y-3">
            {workout.exercises.map((exercise) => (
              <div
                key={exercise.index}
                className="flex justify-between text-sm border-b border-gray-100 pb-2 last:border-0 last:pb-0"
              >
                <span className="font-medium text-gray-700">
                  {exercise.title}
                </span>
                <span className="text-gray-500">
                  {exercise.sets.length} sets
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
