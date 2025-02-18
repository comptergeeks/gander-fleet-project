export interface Aircraft {
  plane_id: string;
  status: string;
  model: string;
  tail_number: string;
  location: string;
  capacity: BigInt;
  maintenance_due_date: string;
  current_trip_status: string;
}
