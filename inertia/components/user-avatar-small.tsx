import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { CalendarIcon } from "lucide-react";
import ReactDOM from "react-dom";

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
    <HoverCard>
      <HoverCardTrigger>
        <Avatar className="w-8 h-8">
          <AvatarImage src="" alt={userFullName} />
          <AvatarFallback className="bg-gray-500 text-white font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </HoverCardTrigger>
      {/* Use a React Portal to render HoverCardContent outside the grid */}
      {ReactDOM.createPortal(
        <HoverCardContent className="w-full z-[1050]">
          <div className="flex justify-between space-x-4">
            <Avatar>
              <AvatarFallback className="bg-gray-500 text-white font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">{userFullName}</h4>
              <p className="text-sm">Business Systems Analyst</p>
              <a
                className="text-xs font-light"
                href="mailto:iamtalhabaig@gmail.com"
              >
                iamtalhabaig@gmail.com
              </a>
              <div className="flex items-center pt-2">
                <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                <span className="text-xs text-muted-foreground">
                  Joined December 2021
                </span>
              </div>
            </div>
          </div>
        </HoverCardContent>,
        document.body, // Mount HoverCardContent to the document body
      )}
    </HoverCard>
  );
};

export default SmallAvatar;
