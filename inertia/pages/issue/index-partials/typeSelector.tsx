import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import ExtendedAvatar from "~/components/user-avatar-extended";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Label } from "~/components/ui/label";

interface ComboboxEditorProps {
  value: string | null;
  onValueChange: (value: string | null) => void;
}

export function TypeSelectEditor({
  value,
  onValueChange,
}: ComboboxEditorProps) {
  const [open, setOpen] = React.useState(false);
  const [types, setTypes] = React.useState<{ value: string; label: string }[]>(
    [],
  );

  React.useEffect(() => {
    fetch(route("issue-categories.retrieve"))
      .then((response) => response.json()) // Parse the JSON response
      .then((data) => {
        const transformedTypes = data.map((type: any) => ({
          value: type.id.toString(),
          label: type.name,
        }));
        setTypes(transformedTypes);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // Empty dependency array means this effect runs once on mount
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
          {value && value !== ""
            ? types.find((type) => type.label === value)?.label ||
              "Select type..."
            : "Select type..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search type..." className="h-9" />
          <CommandList>
            <CommandEmpty>No type found.</CommandEmpty>
            <CommandGroup>
              {types.map((type) => (
                <CommandItem
                  key={type.value}
                  value={type.label}
                  onSelect={() => handleSelect(type.label)}
                  className="flex items-center space-x-2 " // Added spacing for avatar and label
                >
                  {/* Avatar */}
                  {type.label}

                  <Check
                    className={cn(
                      "ml-auto",
                      value === type.value ? "opacity-100" : "opacity-0",
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
