import { Badge } from "~/components/ui/badge";

// Combobox Editor Component
export default function ColoredBadge({ value }: { value: string }) {
  const colorMap: Record<string, string> = {
    high: "bg-red-500",
    medium: "bg-yellow-500 text-black",
    active: "bg-yellow-500 text-black",
    resolved: "bg-green-500",
  };

  const normalizedValue = value.toLowerCase();
  const displayLabel =
    normalizedValue.charAt(0).toUpperCase() + normalizedValue.slice(1);
  const badgeColor = colorMap[normalizedValue] || "bg-gray-500";

  return <Badge className={`text-white ${badgeColor}`}>{displayLabel}</Badge>;
}
