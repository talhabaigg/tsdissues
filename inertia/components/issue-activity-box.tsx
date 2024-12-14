import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Avatar } from "~/components/ui/avatar";
import DateLabelAgo from "~/components/date-label-ago";
import { ArrowRight } from "lucide-react";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import SmallAvatar from "~/components/user-avatar-small";
import ColoredBadge from "./colored-badge";
interface IssueActivityBoxProps {
  issueId: number;
  existingActivities: any[];
}
const isJson = (value: string) => {
  try {
    JSON.parse(value);
    return true;
  } catch (e) {
    return false;
  }
};

const formatJson = (json: string) => {
  try {
    const parsed = JSON.parse(json);
    return JSON.stringify(parsed, null, 2); // pretty print with 2 spaces of indentation
  } catch (e) {
    return json; // If it's not valid JSON, just return the raw value
  }
};
const IssueActivityBox: React.FC<IssueActivityBoxProps> = ({
  issueId,
  existingActivities,
}) => {
  const [activity, setActivity] = useState(existingActivities.reverse());

  return (
    <ScrollArea className="h-[600px] sm:h-[700px] 2xl:h-[900px]  w-full rounded-md ">
      {activity.map((act) => (
        <Card className="mb-2">
          <CardHeader>
            {" "}
            <SmallAvatar userFullName={act.user.name} />
            {act.action}
            <div className="space-x-1 flex flex-box">
              <div className="break-words overflow-hidden text-ellipsis max-w-full">
                {!isJson(act.old_value) ? (
                  <ColoredBadge value={act.old_value ?? ""}></ColoredBadge>
                ) : (
                  <p className="break-words overflow-hidden text-ellipsis max-w-full">
                    {act.old_value}
                  </p>
                )}
              </div>

              <div> {act.action === "created" ? "" : <ArrowRight />}</div>
              <div className="break-words overflow-hidden text-ellipsis max-w-full">
                {!isJson(act.new_value) ? (
                  <ColoredBadge value={act.new_value ?? ""}></ColoredBadge>
                ) : (
                  <pre className="max-w-full p-2  rounded">
                    {formatJson(act.new_value)}
                  </pre> // Display raw value if JSON
                )}
              </div>
            </div>
            <div className="text-xs font-light-">{act.created_at}</div>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      ))}
    </ScrollArea>
  );
};

export default IssueActivityBox;
