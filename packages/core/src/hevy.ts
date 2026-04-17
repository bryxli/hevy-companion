import { HevyUserInfoResponse, HevyWorkoutHistoryResponse } from "./schemas";

export async function fetchUserInfo(apiKey: string) {
  const response = await fetch("https://api.hevyapp.com/v1/user/info", {
    headers: {
      "api-key": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Hevy API Error: ${response.status} ${response.statusText}`,
    );
  }

  const rawData = await response.json();
  return HevyUserInfoResponse.parse(rawData);
}

export async function fetchWorkoutHistory(
  apiKey: string,
  numberOfWorkouts = 1,
) {
  const response = await fetch(
    `https://api.hevyapp.com/v1/workouts?pageSize=${numberOfWorkouts}`,
    {
      headers: {
        "api-key": apiKey,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Hevy API Error: ${response.status} ${response.statusText}`,
    );
  }

  const rawData = await response.json();
  return HevyWorkoutHistoryResponse.parse(rawData);
}
