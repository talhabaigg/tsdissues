import React from "react";
import { Card } from "~/components/ui/card";
import { FilePreview } from "~/components/comment-file-preview";
import ExtendedAvatar from "~/components/user-avatar-extended";
import DateLabelAgo from "~/components/date-label-ago";
import { formatDistanceToNow } from "date-fns";
import SmallAvatar from "~/components/user-avatar-small";
type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
};

type Comment = {
  id: number;
  issue_id: number;
  text: string;
  file: string | null;
  created_at: string;
  creator: User;
};

const CommentCard = ({ comment }: { comment: Comment }) => {
  const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
  });

  return (
    <Card className="space-y-2 p-2 mb-2">
      {/* Avatar */}
      <div className="flex items-center gap-2">
        <SmallAvatar user={comment.creator} />
        <div>
          <p>{comment.creator.name}</p>
          <p className="text-[10px] -mt-1 font-light">{timeAgo}</p>
        </div>
      </div>

      <div className="flex items-start gap-2 pb-2">
        <div className="flex-1 ml-10">
          {/* Comment Text */}
          <p>{comment.text}</p>
          {/* File Preview (if file exists) */}
          {comment.file && (
            <div className="mt-2">
              <FilePreview file={comment.file} />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CommentCard;
