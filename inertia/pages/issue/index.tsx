import AuthenticatedLayout from "~/components/layouts/authenticated-layout";
import ColoredBadge from "~/components/colored-badge";
import ExtendedAvatar from "~/components/user-avatar-extended";
import DateLabelAgo from "~/components/date-label-ago";
import IssueTable from "~/components/issues-data-table";
import IssueFormModal from "~/components/issue-form-modal";
import IssueCommentBox from "~/components/issue-commentBox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent } from "~/components/ui/card";
import { KanbanBoard } from "~/components/KanbanBoard";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { Head } from "@inertiajs/react";
import React from "react";
import { useEffect, useState } from "react";

export default function IssueIndex({ issues }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    // Check if a theme is saved in localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);

  const onOpenRow = (rowData) => {
    setSelectedRow(rowData);
    console.log(rowData);
    setOpen(true);
  };

  const handleTaskOpen = (id) => {
    console.log("Task Opened", id);
  };

  return (
    <AuthenticatedLayout>
      <Head title="View Submitted Issues" />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="max-w-md mx-auto shadow-lg rounded-lg p-6">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold ">
              Issue #{selectedRow?.id}
            </SheetTitle>
          </SheetHeader>
          <Tabs defaultValue="details" className="w-[400px]">
            <TabsList className="dark:bg-transparent">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              {selectedRow ? (
                <div className=" pb-2 pr-20 sm:pr-2 sm:w-full">
                  <Card className="p-2 mr-10 my-2 ">
                    <CardContent className="my-4 space-y-2">
                      <div className="font-bold">Title:</div>
                      <div className="text-md text-muted-foreground">
                        {" "}
                        {selectedRow.title}
                      </div>
                      <div className="font-bold">Description:</div>
                      <div className="text-md text-muted-foreground">
                        {" "}
                        {selectedRow.description}
                      </div>
                      <div className="font-bold">Priority:</div>
                      <div>
                        {" "}
                        <ColoredBadge value={selectedRow.priority} />
                      </div>
                      <div className="font-bold">Status:</div>
                      <div>
                        {" "}
                        <ColoredBadge value={selectedRow.status} />
                      </div>
                      <div className="font-bold">Assigned To:</div>
                      <ExtendedAvatar userFullName={selectedRow.assigned_to} />
                      <div className="font-bold">Submitted by:</div>
                      <ExtendedAvatar userFullName={selectedRow.created_by} />
                      <div className="font-bold">Created At:</div>
                      <div>
                        {" "}
                        <DateLabelAgo date={selectedRow.creator} />
                      </div>
                      <div className="font-bold">Last Updated At:</div>
                      <div>
                        {" "}
                        <DateLabelAgo date={selectedRow.updated_at} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <p className="mt-4 text-center text-sm text-gray-500">
                  <Card className="p-2 mr-10 my-2 ">
                    Select a row to view details{" "}
                  </Card>
                </p>
              )}
            </TabsContent>
            <TabsContent value="comments">
              <div className="min-h-screen flex items-center justify-center mr-10">
                <IssueCommentBox
                  issueId={selectedRow ? selectedRow.id : 0}
                  existingComments={selectedRow ? selectedRow.comments : []}
                />
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
      <Tabs defaultValue="table" className="w-full">
        <div className="flex justify-between">
          <div>
            <TabsList className="w-full">
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="kanban">Kanban View</TabsTrigger>
            </TabsList>
          </div>
          <div>
            <IssueFormModal />
          </div>
        </div>
        <TabsContent value="table" className="w-full">
          <IssueTable
            issues={issues.data}
            onOpenRow={onOpenRow}
            mode={isDarkMode}
          />
        </TabsContent>
        <TabsContent value="kanban" className="mt-10">
          <KanbanBoard issues={issues.data ? issues.data : []} />
        </TabsContent>
      </Tabs>
    </AuthenticatedLayout>
  );
}