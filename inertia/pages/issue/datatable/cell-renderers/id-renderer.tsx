import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "~/components/ui/tooltip";
import { MessageCircle } from "lucide-react";
import { Link } from "@inertiajs/react";

const IdCellRenderer = ({ value, data }: any) => (
  <div className="">
    <Link
      href={route("issue.show", data.id)} // Link to the issue details page
      className=" hover:underline"
    >
      <Button size="sm" variant="outline" className="p-2">
        Open Issue
      </Button>
    </Link>
  </div>
);
export default IdCellRenderer;
