import { FleetMap } from "@/components/implementation/FleetMap";
import { FleetTable } from "@/components/implementation/FleetTable";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Aircraft } from "./types";

/*
todo:
- build out basic page with fleet data:
  - one call to feed to both component
    - maybe that lives here not sure
  - components:
    - globe
    - table of planes
    - calendar
- then create AI booking assistant using OpenAI API with function calls
*/
// request data here and pass as params to table

// can probably export this to a different component
async function fetchAircraftData(): Promise<Aircraft[]> {
  // const API_KEY = process.env.AIRCRAFT_API_KEY; // Add your API key to .env.local
  // make sure to add env local
  const response = await fetch(
    "https://ap5sqkwlfk.execute-api.us-west-2.amazonaws.com/default/aircraft-function/table",
    {
      headers: {
        "x-api-key": "DUG80cCw8waYG0njpaEEH2AyEip7PalN4T1uNitk", // API key will be added here
      },
    },
  );

  console.log("Response status:", response.status);
  console.log("Response headers:", response.headers);

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
  const aircraftData = await fetchAircraftData();
  console.log(aircraftData);
  return (
    <div className="min-h-screen bg-black">
      <BentoGrid>
        <BentoGridItem
          title="Fleet Map"
          description="Current locations of your planes"
        >
          <FleetMap />
        </BentoGridItem>
        <BentoGridItem
          title="Fleet Table"
          description="Detailed fleet information in table format."
        >
          {/* fix the data type */}
          <FleetTable aircraftData={aircraftData.data} />
        </BentoGridItem>
      </BentoGrid>
    </div>
  );
}
