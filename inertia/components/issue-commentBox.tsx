import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { FilePreview } from "~/components/comment-file-preview";
import ExtendedAvatar from "~/components/user-avatar-extended";
// You can use this for a small upload icon
import { Paperclip } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useEffect } from "react";
import DateLabelAgo from "~/components/date-label-ago";
const IssueCommentBox = ({ issueId, existingComments }) => {
  // console.log("Issue ID:", issueId);
  const [comments, setComments] = useState(existingComments);
  // console.log("Existing Comments:", existingComments);
  const form = useForm({
    issue_id: 0,
    text: "",
    file: null,
  });
  useEffect(() => {
    if (form.data.text !== "") {
      // Only run if status is not empty
      console.log("Posting comment:", form.data);

      form.post("/issue-comments");
    }
  }, [form.data.text]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  const [newComment, setNewComment] = useState("");
  const [file, setFile] = useState(null);

  const handleAddComment = () => {
    if (newComment.trim() === "") return;
    const comment = {
      id: 1,
      issue_id: issueId,
      creator: {
        id: 1,
        name: "Talha Baig",
      },
      text: newComment,
      file,
      created_at: new Date().toISOString(),
    };
    form.setData({
      issue_id: issueId, // Update issue_id
      text: newComment, // Update status
      file: file, // Update file
    });

    console.log("Comment to be added:", form.data);
    // form.post("/issue-comments");

    setComments([...comments, comment]);
    setNewComment("");
    console.log("Comment added:", comment);
    setFile(null); // Clear file after posting the comment
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const renderFilePreview = (file) => {
    if (!file) return null;

    // Define your base URL
    const BASE_URL = "http://127.0.0.1:8000/storage/";

    // Check if the file is a local File object or a server-provided path
    const isFileObject = file instanceof File;
    const fileUrl = isFileObject
      ? URL.createObjectURL(file)
      : `${BASE_URL}${file}`;

    // Determine the file type
    const fileType = isFileObject
      ? file.type.split("/")[0]
      : file.split(".").pop().toLowerCase();

    // Render preview based on file type
    if (
      fileType === "image" ||
      ["png", "jpg", "jpeg", "gif"].includes(fileType)
    ) {
      return (
        <img
          src={fileUrl}
          alt="Uploaded"
          className="w-full max-h-64 rounded-lg object-contain"
        />
      );
    }

    if (fileType === "video" || ["mp4", "avi", "mov"].includes(fileType)) {
      return (
        <video controls className="w-full max-h-64">
          <source src={fileUrl} type={`video/${fileType}`} />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (fileType === "pdf") {
      return (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500"
        >
          View PDF
        </a>
      );
    }

    return <span className="text-gray-500">Unsupported file type</span>;
  };

  return (
    <div className="relative min-h-screen  pb-2 pr-2 w-full mr-20 sm:mr-0 flex flex-col">
      <div className="sticky top-0 border-gray-200 pb-2 pr-2">
        <div className="flex flex-col gap-2">
          {/* Text Input for Comment */}
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddComment();
              }
            }}
          />

          {/* File Input with Hidden File Upload */}
          <div className="flex items-center justify-end gap-2 ">
            {/* Hidden file input */}
            <span className="w-16 h-16 flex items-center justify-center">
              {renderFilePreview(file)}
            </span>

            <label htmlFor="file-upload" className="cursor-pointer">
              <Paperclip />
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              accept="image/*,video/*,application/pdf"
              className="hidden"
            />

            {/* Upload Button */}
            <Button onClick={handleAddComment}>Post</Button>
          </div>
        </div>
      </div>
      {/* Comments List */}
      <div className="flex-1 h-3/4 ">
        <ScrollArea className="h-[600px] sm:h-[700px] xlg:h-[900px]  w-full rounded-md ">
          {comments.length > 0 ? (
            comments
              .slice()
              .reverse()
              .map((comment, index) => (
                <div className="">
                  <Card className="space-y-2 p-2 mb-2 ">
                    <ExtendedAvatar userFullName={comment.creator.name} />
                    <div className="flex items-start gap-2 pb-2">
                      <div className="flex-1 ml-10 ">
                        <p className="text-sm">{comment.text}</p>
                        {comment.file && (
                          <div className="mt-2">
                            <FilePreview file={comment.file} />
                          </div>
                        )}
                        <DateLabelAgo date={comment.created_at} />
                      </div>
                    </div>
                  </Card>
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

      {/* Sticky Comment Input */}
    </div>
  );
};

export default IssueCommentBox;
