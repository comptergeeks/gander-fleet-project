import { FleetMap } from "@/components/implementation/FleetMap";
import { FleetTable } from "@/components/implementation/FleetTable";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Aircraft } from "./types";

// MOVE ALL API KEYS TO .env -- this is just for the prototype
async function fetchAircraftData(): Promise<Aircraft[]> {
  const response = await fetch(
    "https://ap5sqkwlfk.execute-api.us-west-2.amazonaws.com/default/aircraft-function/table",
    {
      headers: {
        "x-api-key": "DUG80cCw8waYG0njpaEEH2AyEip7PalN4T1uNitk",
      },
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error response:", errorText);
    throw new Error(
      `HTTP error! status: ${response.status}, body: ${errorText}`,
    );
  }
  return response.json();
}

// add set timemout here for other pieces
async function fetchMapData(): Promise<any> {
  const response = await fetch(
    "https://ap5sqkwlfk.execute-api.us-west-2.amazonaws.com/default/aircraft-function/map",
    {
      headers: {
        "x-api-key": "DUG80cCw8waYG0njpaEEH2AyEip7PalN4T1uNitk",
      },
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error response:", errorText);
    throw new Error(
      `HTTP error! status: ${response.status}, body: ${errorText}`,
    );
  }
  return response.json();
}

export default async function Home() {
  const [aircraftData, mapData] = await Promise.all([
    fetchAircraftData(),
    fetchMapData(),
  ]);

  return (
    <div className="min-h-screen bg-black">
      <BentoGrid>
        <BentoGridItem
          title="Fleet Map"
          description="Current locations of your planes"
        >
          <FleetMap mapData={mapData.data} />
        </BentoGridItem>
        <BentoGridItem
          title="Fleet Table"
          description="Detailed fleet information in table format."
        >
          <FleetTable aircraftData={aircraftData.data} />
        </BentoGridItem>
      </BentoGrid>
    </div>
  );
}
