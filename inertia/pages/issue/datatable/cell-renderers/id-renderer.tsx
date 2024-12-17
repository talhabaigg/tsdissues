import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "~/components/ui/tooltip";
import { MessageCircle } from "lucide-react";

const IdCellRenderer = ({ value, data, onOpenRow }: any) => (
  <div className="flex items-center justify-between gap-2">
    <span>{value}</span>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            onClick={() => onOpenRow(data)}
          >
            <MessageCircle />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>View details</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
);
export default IdCellRenderer;
