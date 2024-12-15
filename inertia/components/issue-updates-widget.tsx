import React from "react";
import { usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import ExtendedAvatar from "./user-avatar-extended";
import DateLabelAgo from "./date-label-ago";
import { FilePreview } from "./comment-file-preview";
import { ScrollArea } from "./ui/scroll-area";
import SmallAvatar from "./user-avatar-small";
import { useEffect, useState } from "react";
import ColoredBadge from "./colored-badge";
const LatestComments = () => {
  const { props } = usePage();
  interface Comment {
    id: number;
    issue: {
      id: number;
      name: string;
      type: string;
      status: string;
    };
    creator: {
      id: number;
      name: string;
    };
    text: string;
    file?: string;
    created_at: string;
  }

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the latest comments from the backend
  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/latest-comments");
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await response.json();
      console.log(data);
      setComments(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  if (loading) return <div>Loading comments...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!comments || comments.length === 0) {
    return <div>No comments available.</div>;
  }

  return (
    <>
      <div className="space-y-2">
        {comments.length > 0 ? (
          comments.slice().map((comment, index) => (
            <div>
              <div className="flex justify-start space-y-2">
                <Card className="p-2 ml-2  w-full flex items-center space-x-4">
                  <div className="">
                    <SmallAvatar userFullName={comment.creator.name} />
                  </div>
                  <div>
                    {comment.text}{" "}
                    {comment.file && (
                      <div className="mt-2">
                        <FilePreview file={comment.file} />
                      </div>
                    )}
                    <div className="space-x-2 ">
                      <div className="flex items-center justify-between  font-light text-xs">
                        <div className="space-x-1">
                          <span>
                            Commented on "issue #{comment.issue.id}-
                            {comment.issue.name}" on{" "}
                          </span>
                          <span>
                            {new Date(comment.created_at).toLocaleDateString(
                              "en-AU",
                            )}
                          </span>
                        </div>
                        {/* <div className="ml-1 space-x-1">
                          <ColoredBadge value={comment.issue.type} />
                          <ColoredBadge value={comment.issue.status} />
                        </div> */}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ))
        ) : (
          <Card className="p-20 ">
            No comments yet. <br />
            Be the first to comment!{" "}
          </Card>
        )}
      </div>
    </>
  );
};

export default LatestComments;
