"use server";

import { Aircraft } from "@/app/types";
import { revalidatePath } from "next/cache";

export async function addAircraft(
  aircraft: Omit<
    Aircraft,
    "status" | "plane_id" | "current_trip_status" | "maintenance_due_date"
  >,
) {
  // omit allows me to prevent from adding some components
  // Add your server-side logic here
  // now i just can call the endpoint with aircraft
  const response = await fetch(
    "https://ap5sqkwlfk.execute-api.us-west-2.amazonaws.com/default/aircraft-function/aircraft",
    {
      method: "POST",
      headers: {
        "x-api-key": "DUG80cCw8waYG0njpaEEH2AyEip7PalN4T1uNitk", // API key will be added here
      },
      body: JSON.stringify({
        // rememebr that fetcah can only send strings
        model: aircraft.model,
        tail_number: aircraft.tail_number,
        location: aircraft.location,
        capacity: aircraft.capacity,
      }),
    },
  ); // posts aircraft api end point
  console.log("Server action called with:", aircraft);

  if (response.ok) {
    revalidatePath("/");
    return {
      success: true,
      message: "Aircraft added successfully",
    };
  } else {
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, body: ${errorText}`,
    );
  }
}
