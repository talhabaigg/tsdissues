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
  const [comments, setComments] = useState([]);
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
  const comments1 = [
    {
      id: 1,
      issue: {
        id: 1,
        name: "Fix the pipes before its too late",
        type: "it_hardware",
        status: "resolved",
      },
      creator: {
        id: 1,
        name: "Talha Baig",
      },
      text: "This is a comment",
      file: `https://via.placeholder.com/150`,
      created_at: "2022-01-01T00:00:00Z",
    },
  ];
  if (!comments || comments.length === 0) {
    return <div>No comments available.</div>;
  }

  return (
    <div className="p-2  rounded-lg">
      <h1 className="font-bold p-2">Latest Comments</h1>

      <ScrollArea className="h-[600px] sm:h-[700px] xlg:h-[900px]  w-full rounded-md ">
        {comments.length > 0 ? (
          comments
            .slice()
            .reverse()
            .map((comment, index) => (
              <div className="">
                <div>
                  <div className="flex justify-start space-y-2">
                    <SmallAvatar userFullName={comment.creator.name} />
                    <Card className="p-2 ml-2 w-full">
                      {comment.text}{" "}
                      {comment.file && (
                        <div className="mt-2">
                          <FilePreview file={comment.file} />
                        </div>
                      )}
                      <div className=" space-x-2">
                        <div className=" font-light text-xs">
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
                        <ColoredBadge value={comment.issue.type}></ColoredBadge>
                        <ColoredBadge
                          value={comment.issue.status}
                        ></ColoredBadge>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <Card className="p-20 ">
            No comments yet. <br />
            Be the first to comment!{" "}
          </Card>
        )}
      </ScrollArea>
    </div>
  );
};

export default LatestComments;
