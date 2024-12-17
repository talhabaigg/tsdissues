const CreatedAtCellRenderer = ({
  value,
}: {
  value: string | number | Date;
}) => {
  const date = new Date(value);
  const formattedDate = new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);

  const [day, month, year] = formattedDate.split(" ");
  return `${day}-${month.toUpperCase()}-${year}`;
};
export default CreatedAtCellRenderer;
