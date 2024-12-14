import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

interface ExtendedAvatarProps {
  userFullName?: string; // Make userFullName optional
}

const ExtendedAvatar = ({
  userFullName = "Unassigned",
}: ExtendedAvatarProps) => {
  // Calculate initials only when userFullName is provided
  const initials = userFullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center">
      <Avatar className="w-8 h-8">
        <AvatarImage src="" alt={userFullName} />
        <AvatarFallback className="bg-gray-500 text-white ">
          {initials}
        </AvatarFallback>
      </Avatar>
      <span className="ml-2">{userFullName}</span>
    </div>
  );
};

export default ExtendedAvatar;
