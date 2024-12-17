import ColoredBadge from "~/components/colored-badge";
import ExtendedAvatar from "~/components/user-avatar-extended";
import DateLabelAgo from "~/components/date-label-ago";
import { Card, CardContent } from "~/components/ui/card";
import { FilePreview } from "~/components/comment-file-preview";

const IssueDetailsTab = ({ selectedRow }) => {
  return selectedRow ? (
    <div className="pb-2 pr-20 sm:pr-2 sm:w-full">
      <Card className="p-2 mr-10 my-2">
        <CardContent className="my-4 space-y-2">
          <div className="font-bold">Title:</div>
          <div className="text-md text-muted-foreground">
            {selectedRow.title}
          </div>
          <div className="font-bold">Description:</div>
          <div className="text-md text-muted-foreground">
            {selectedRow.description}
          </div>
          <div className="font-bold">Uploaded evidence:</div>
          <FilePreview file={selectedRow.file} />
          <div className="font-bold">Priority:</div>
          <div>
            <ColoredBadge value={selectedRow.priority} />
          </div>
          <div className="font-bold">Status:</div>
          <div>
            <ColoredBadge value={selectedRow.status} />
          </div>
          <div className="font-bold">Assigned To:</div>
          <ExtendedAvatar userFullName={selectedRow.assigned_to} />
          <div className="font-bold">Submitted by:</div>
          <ExtendedAvatar userFullName={selectedRow.created_by} />
          <div className="font-bold">Created At:</div>
          <div>
            <DateLabelAgo date={selectedRow.created_at} />
          </div>
          <div className="font-bold">Last Updated At:</div>
          <div>
            <DateLabelAgo date={selectedRow.updated_at} />
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <p className="mt-4 text-center text-sm text-gray-500">
      <Card className="p-2 mr-10 my-2">Select a row to view details</Card>
    </p>
  );
};

export default IssueDetailsTab;
