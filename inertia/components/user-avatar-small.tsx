import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

interface AvatarProps {
  userFullName?: string; // Make userFullName optional
}

const SmallAvatar = ({ userFullName = "Unassigned" }: AvatarProps) => {
  // Calculate initials only when userFullName is provided
  const initials = userFullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Avatar className="w-8 h-8">
      <AvatarImage src="" alt={userFullName} />
      <AvatarFallback className="bg-gray-500 text-white font-bold">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};

export default SmallAvatar;
