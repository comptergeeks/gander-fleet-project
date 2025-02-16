import Image from "next/image";
import { FleetTable } from "@/components/implementation/FleetTable";
import { FleetMap } from "@/components/implementation/FleetMap";

/*
todo:
- build out basic page with fleet data
  - components:
    - globe
    - table of planes
    - calendar
- then create ai booking assistant
  - use opeani assistant api
    - give it function calls with data


*/

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <div className="grid grid-cols-2 w-screen dark:bg-black dark:border-white/[0.2] bg-white border border-transparent">
        <FleetMap />
        <FleetTable />
      </div>
    </div>
  );
}
