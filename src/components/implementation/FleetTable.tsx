import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
  TableFoot,
} from "@/components/tremor/Table";
import { Aircraft } from "@/app/types";

interface FleetTableProps {
  aircraftData: Aircraft[];
}

export function FleetTable({ aircraftData }: FleetTableProps) {
  return (
    <TableRoot>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Model</TableHeaderCell>
            <TableHeaderCell>Tail Number</TableHeaderCell>
            <TableHeaderCell>Location</TableHeaderCell>
            <TableHeaderCell className="text-right">
              Maintenance Due
            </TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {aircraftData.map((aircraft) => (
            <TableRow key={aircraft.plane_id}>
              <TableCell>{aircraft.status}</TableCell>
              <TableCell>{aircraft.model}</TableCell>
              <TableCell>{aircraft.tail_number}</TableCell>
              <TableCell>{aircraft.location}</TableCell>
              <TableCell className="text-right">
                {aircraft.maintenance_due_date}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFoot>
          <TableRow>
            <TableHeaderCell>
              <button className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
                Add New!
              </button>
            </TableHeaderCell>
          </TableRow>
        </TableFoot>
      </Table>
    </TableRoot>
  );
}
