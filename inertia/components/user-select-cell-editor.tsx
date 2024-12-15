import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import ExtendedAvatar from "~/components/user-avatar-extended";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
// import { Avatar } from "./ui/avatar";

// Updated users array with avatars
const users = [
  {
    value: "2",
    label: "Talha Baig",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg", // Avatar URL
  },
  {
    value: "3",
    label: "Kim Flynn",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg", // Avatar URL
  },
];

// Combobox Editor Component
interface ComboboxEditorProps {
  value: string | null;
  onValueChange: (value: string | null) => void;
}

export function ComboboxEditor({ value, onValueChange }: ComboboxEditorProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (selectedValue: string) => {
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
            ? users.find((user) => user.value === value)?.label
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
                  className="flex items-center space-x-2 " // Added spacing for avatar and label
                >
                  {/* Avatar */}
                  <ExtendedAvatar userFullName={user.label} />

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
