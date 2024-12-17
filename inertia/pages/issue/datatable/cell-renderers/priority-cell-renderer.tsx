import ColoredBadge from "~/components/colored-badge";
const PriorityCellRenderer = ({ value }: { value: string }) => (
  <ColoredBadge value={value} />
);
export default PriorityCellRenderer;
