"use server";

import { Aircraft } from "@/app/types";

export async function addAircraft(aircraft: Omit<Aircraft, "plane_id">) {
  // omit allows me to prevent from adding some components
  // Add your server-side logic here
  // e.g., database operations, validation, etc.
  // post request that adds new aircraft
  console.log("Server action called with:", aircraft);

  // Return some response
  return {
    success: true,
    message: "Aircraft added successfully",
  };
}
