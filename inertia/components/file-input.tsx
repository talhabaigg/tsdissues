import React from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

// Reusable InputFile component
export function InputFile({ label, id, onChange, multiple = false }) {
  return (
    <div className="grid w-full  items-center gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="file"
        onChange={onChange}
        multiple={multiple} // Allows multiple file uploads if needed
      />
    </div>
  );
}