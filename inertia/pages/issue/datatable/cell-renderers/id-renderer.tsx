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
  <div className="flex items-center justify-between gap-2">
    <span>{value}</span>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Link
            href={route("issue.show", data.id)} // Link to the issue details page
            className=" hover:underline"
          >
            <Button size="sm" variant="link" className="p-2">
              Open
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>View details</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
);
export default IdCellRenderer;
