interface DateLabelAgoProps {
  date?: string; // Accepting a date string
}

const DateLabelAgo = ({
  date = "2024-12-09 23:04:36", // Default date if none is provided
}: DateLabelAgoProps) => {
  // Parse the date string into a Date object
  const parsedDate = new Date(date.replace(" ", "T")); // Convert 'YYYY-MM-DD HH:MM:SS' to 'YYYY-MM-DDTHH:MM:SS'

  // Function to calculate the time ago in human-readable format
  const timeAgo = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 3600 * 24)); // Difference in days

    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  // Format the date to "24 Aug, 2024"
  const formattedDate = new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);

  return (
    <p className="text-sm text-muted-foreground">
      {formattedDate} ({timeAgo(parsedDate)})
    </p>
  );
};

export default DateLabelAgo;
