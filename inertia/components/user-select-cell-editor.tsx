// user-select-cell-editor.tsx

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

// This could be your options array for a select-like combobox
const users = [
  {
    value: "1",
    label: "Talha Baig",
  },
  {
    value: "2",
    label: "Kim Flynn",
  },
];

// Combobox Editor Component
export function ComboboxEditor({ value, onValueChange }) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (selectedValue) => {
    // When a selection is made, update the value and close the dropdown
    onValueChange(selectedValue === value ? null : selectedValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? users.find((users) => users.value === value)?.label
            : "Select user..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search user..." className="h-9" />
          <CommandList>
            <CommandEmpty>No user found.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.value}
                  value={user.label}
                  onSelect={() => handleSelect(user.value)}
                >
                  {user.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === user.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
