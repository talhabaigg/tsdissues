import { Badge } from "~/components/ui/badge";

const TypeCellRenderer = ({ value }: { value: string }) => {
  const formattedValue = value.replace(/_/g, " ").toUpperCase();
  return <Badge>{formattedValue}</Badge>;
};

export default TypeCellRenderer;
