"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { addAircraft } from "../../actions/aircraft";
import { Aircraft } from "@/app/types";

type AircraftStatus = "active" | "maintenance" | "grounded";

// omit statss, id, location, and current trip status, all this will be set later
// server will send post request
type NewAircraftFormData = Omit<Aircraft, "plane_id">;

export function AddAircraftDialog() {
  const [newAircraft, setNewAircraft] = useState<Partial<NewAircraftFormData>>(
    {},
  );
  const [open, setOpen] = useState(false);

  const handleInputChange = (
    field: keyof NewAircraftFormData,
    value: string,
  ) => {
    setNewAircraft((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Ensure all required fields are filled
      if (
        !newAircraft.model ||
        !newAircraft.tail_number ||
        !newAircraft.status ||
        !newAircraft.location ||
        !newAircraft.maintenance_due_date
      ) {
        throw new Error("Please fill in all required fields");
      }

      const result = await addAircraft(newAircraft as NewAircraftFormData);

      if (result.success) {
        // Clear form and close dialog
        setNewAircraft({});
        setOpen(false);
      }
    } catch (error) {
      console.error("Error adding aircraft:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
          Add New!
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Aircraft</DialogTitle>
          <DialogDescription>
            Enter the details of the new aircraft to add to your fleet.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model" className="text-right">
                Model
              </Label>
              <Input
                id="model"
                placeholder="Aircraft model"
                className="col-span-3"
                value={newAircraft.model || ""}
                onChange={(e) => handleInputChange("model", e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tail_number" className="text-right">
                Tail Number
              </Label>
              <Input
                id="tail_number"
                placeholder="N12345"
                className="col-span-3"
                value={newAircraft.tail_number || ""}
                onChange={(e) =>
                  handleInputChange("tail_number", e.target.value)
                }
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                placeholder="Airport code"
                className="col-span-3"
                value={newAircraft.location || ""}
                onChange={(e) => handleInputChange("location", e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maintenance_due" className="text-right">
                Maintenance Due
              </Label>
              <Input
                id="maintenance_due"
                type="date"
                className="col-span-3"
                value={newAircraft.maintenance_due_date || ""}
                onChange={(e) =>
                  handleInputChange("maintenance_due_date", e.target.value)
                }
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Aircraft</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
