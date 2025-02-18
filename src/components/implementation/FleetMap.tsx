"use client";
import { WorldMap } from "@/components/ui/world-map";

interface MapData {
  available: {
    plane_id: string;
    model: string;
    tail_number: string;
    location_lat: string;
    locaton_long: string;
  }[];
  in_air: {
    plane_id: string;
    model: string;
    tail_number: string;
    origin_lat: string;
    origin_long: string;
    dest_lat: string;
    dest_long: string;
    origin: string;
    destination: string;
  }[];
}

interface FleetMapProps {
  mapData: MapData;
}

export function FleetMap({ mapData }: FleetMapProps) {
  console.log(JSON.stringify(mapData));
  const apiDots = [
    // Add in-air aircraft with their routes
    ...(mapData.in_air?.map((aircraft) => ({
      start: {
        lat: parseFloat(aircraft.origin_lat),
        lng: parseFloat(aircraft.origin_long),
        label: `${aircraft.model} (${aircraft.tail_number})`,
      },
      end: {
        lat: parseFloat(aircraft.dest_lat),
        lng: parseFloat(aircraft.dest_long),
        label: `${aircraft.model} (${aircraft.tail_number})`,
      },
      details: {
        model: aircraft.model,
        plane_id: aircraft.plane_id,
        tail_number: aircraft.tail_number,
        origin: aircraft.origin,
        destination: aircraft.destination,
      },
    })) || []),
    // Add available aircraft as points
    ...(mapData.available?.map((aircraft) => ({
      start: {
        lat: parseFloat(aircraft.locaton_long),
        lng: parseFloat(aircraft.location_lat),
        label: `${aircraft.model} (${aircraft.tail_number})`,
      },
      end: {
        lat: parseFloat(aircraft.locaton_long),
        lng: parseFloat(aircraft.location_lat),
        label: `${aircraft.model} (${aircraft.tail_number})`,
      },
      details: {
        model: aircraft.model,
        plane_id: aircraft.plane_id,
        tail_number: aircraft.tail_number,
        location: "placeholder", // Placeholder until API returns location
      },
    })) || []),
  ];

  return (
    <div className="dark:bg-black bg-white w-full">
      <WorldMap dots={apiDots} lineColor="#0ea5e9" />
    </div>
  );
}
