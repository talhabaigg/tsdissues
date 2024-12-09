import AuthenticatedLayout from "~/components/layouts/authenticated-layout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { MessageCircle } from "lucide-react";
import { ComboboxEditor } from "~/components/user-select-cell-editor";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import IssueCommentBox from "~/components/issue-commentBox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"; // Ensure you've installed Shadcn and imported Avatar components
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardHeader,
} from "~/components/ui/card";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import IssueForm from "~/components/issue-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Head } from "@inertiajs/react";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional Theme
import React from "react";
import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { on } from "events";
import { title } from "process";
export default function IssueIndex({ issues }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [open, setOpen] = React.useState(false);
  const form = useForm({
    status: "",
    assigned_to: "",
    priority: "",
    title: "",
  });

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
  // Effect to handle status change when form data updates
  useEffect(() => {
    if (
      form.data.status !== "" ||
      form.data.assigned_to !== "" ||
      form.data.priority !== "" ||
      form.data.title !== ""
    ) {
      // Only run if status is not empty
      const issueId = selectedRow?.id; // Assume selectedRow contains the issueId

      form.post(`/issues/${issueId}/update-status`);
    }
  }, [form.data.status, selectedRow]);

  const handleStatusChange = (
    issueId: number,
    newStatus: string,
    newAssignee: string,
    newPriority: string,
    newTitle: string,
  ) => {
    // Set form data for both status and assigned_to
    form.setData({
      status: newStatus ?? rowData.status, // Update status
      assigned_to: newAssignee ?? rowData.assigned_to, // Update assigned user
      priority: newPriority ?? rowData.priority,
      title: newTitle ?? rowData.title,
    });

    // Update the selected row (optional, based on your app's logic)
    setSelectedRow({ id: issueId });
  };
  const onRowClicked = (event) => {
    // Check if the event was triggered by an editable cell
    // Proceed with row selection logic
    // setSelectedRow(event.data);
    // setOpen(true);
  };
  const onOpenRow = (rowData) => {
    setSelectedRow(rowData);
    // console.log(selectedRow);
    setOpen(true);
  };
  // AG Grid column definitions
  const columnDefs = [
    {
      headerName: "ID",
      field: "id",
      sortable: true,
      filter: true,
      cellRenderer: (params) => {
        return (
          <div className="flex items-center justify-between gap-2">
            {" "}
            {/* Flex container with gap */}
            <span>{params.value}</span> {/* Display ID */}
            <div className="">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    {" "}
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => onOpenRow(params.data)}
                    >
                      <MessageCircle />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>View details</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        );
      },
    },

    {
      headerName: "Title",
      field: "title",
      sortable: true,
      filter: true,
      editable: true,
      singleClickEdit: true,
      onCellValueChanged: (event) => {
        const issueId = event.data.id; // Get the issue ID
        const newTitle = event.newValue; // Get the new title
        handleStatusChange(issueId, null, null, null, newTitle);
      },
    },
    {
      headerName: "Description",
      field: "description",
      sortable: true,
      filter: true,
      hide: true,

      singleClickEdit: true,
    },
    {
      headerName: "Type",
      field: "type",
      sortable: true,
      filter: true,
      cellClass: "text-center",
      cellRenderer: (props) => {
        // Access the 'type' value from props.value
        const value = props.value;
        const formattedValue = value
          .replace(/_/g, " ") // Replace underscores with spaces
          .toUpperCase();
        return (
          <>
            <Badge>{formattedValue}</Badge>
          </>
        );
      },
    },

    {
      headerName: "Priority",
      field: "priority",
      sortable: true,
      filter: true,
      editable: true,
      cellClass: "text-center",
      cellEditor: "agSelectCellEditor",
      singleClickEdit: true,
      cellEditorParams: {
        values: ["high", "medium", "low"],
      },
      onCellValueChanged: (event) => {
        const issueId = event.data.id; // Get the issue ID
        const status = rowData.status; // Get the new status
        const assigned_to = rowData.assigned_to;
        const newPriority = event.newValue; // Get the new priority
        console.log(newPriority);
        handleStatusChange(issueId, status, assigned_to, newPriority);
      },
      cellRenderer: (props) => {
        const priority = props.value;
        let badgeColor = "bg-gray-500"; // Default to grey if no match

        if (priority === "high") {
          badgeColor = "bg-red-500"; // Green for resolved
        } else if (priority === "medium") {
          badgeColor = "bg-yellow-500 text-black"; // Yellow for working on it
        } else if (priority === "low") {
          badgeColor = "bg-gray-500"; // Grey for pending
        }

        return (
          <Badge className={`text-white ${badgeColor}`}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}{" "}
            {/* Capitalize first letter */}
          </Badge>
        );
      },
    },
    {
      headerName: "Status",
      field: "status",
      sortable: true,
      filter: true,
      editable: true,
      cellClass: "text-center",
      cellEditor: "agSelectCellEditor",
      singleClickEdit: true,

      cellEditorParams: {
        values: ["working on it", "resolved", "pending"],
      },
      onCellValueChanged: (event) => {
        const issueId = event.data.id; // Get the issue ID
        const newStatus = event.newValue; // Get the new status

        handleStatusChange(issueId, newStatus);
      },
      cellRenderer: (props) => {
        const status = props.value;
        let badgeColor = "bg-gray-500"; // Default to grey if no match

        if (status === "resolved") {
          badgeColor = "bg-green-500"; // Green for resolved
        } else if (status === "working on it") {
          badgeColor = "bg-yellow-500"; // Yellow for working on it
        } else if (status === "pending") {
          badgeColor = "bg-gray-500"; // Grey for pending
        }

        return (
          <Badge className={`text-white ${badgeColor}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}{" "}
            {/* Capitalize first letter */}
          </Badge>
        );
      },
    },
    {
      headerName: "Assigned To",
      field: "assigned_to",
      sortable: true,
      cellClass: "text-center",
      singleClickEdit: true,

      editable: true,
      cellEditor: ComboboxEditor,
      onCellValueChanged: (event) => {
        const issueId = event.data.id; // Get the issue ID
        const newAssignee = event.newValue; // Get the new status
        console.log(newAssignee);
        const newStatus = event.data.status;
        handleStatusChange(issueId, newStatus, newAssignee);
      },
      cellRenderer: (props) => {
        const assignedUser = props.value;
        const initial = assignedUser
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase(); // Ensure initials are uppercase

        return (
          <div className="flex items-center">
            <Avatar className="w-8 h-8">
              {assignedUser.avatar ? (
                <img src={assignedUser.avatar} alt="User Avatar" />
              ) : (
                <AvatarFallback>{initial}</AvatarFallback>
              )}
            </Avatar>
            <span className="ml-2">{assignedUser || "Unassigned"}</span>
          </div>
        );
      },
    },
    { headerName: "Updated By", field: "updated_by", sortable: true },
    { headerName: "Created At", field: "created_at", sortable: true },
    {
      headerName: "Updated At",
      field: "updated_at",
      sortable: true,
      hide: true,
    },
  ];

  // Format data for AG Grid
  const rowData = issues.data.map((issue) => ({
    id: issue.id,
    type: issue.type,
    title: issue.title,
    priority: issue.priority,
    status: issue.status,
    description: issue.description,
    comments: issue.comments,
    assigned_to:
      issue.assignee && issue.assignee.name ? issue.assignee.name : "N/A",
    updated_by: issue.updater.name || "N/A",
    created_at: new Date(issue.created_at).toLocaleString(), // Format date
    updated_at: new Date(issue.updated_at).toLocaleString(),
  }));

  return (
    <AuthenticatedLayout>
      <Head title="View Submitted Issues" />
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Issues</CardTitle>
          <CardDescription>
            This table displays all the issues submitted by users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Report new</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <IssueForm />
            </DialogContent>
          </Dialog>
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
                      <Card className="p-2 mr-10 my-2 space-y-2">
                        <div className="font-bold">Title:</div>
                        <div> {selectedRow.title}</div>
                        <div className="font-bold">Description:</div>
                        <div> {selectedRow.description}</div>
                        <div className="font-bold">Priority:</div>
                        <div>
                          {" "}
                          <Badge variant="outline">
                            {selectedRow.priority}
                          </Badge>
                        </div>
                        <div className="font-bold">Status:</div>
                        <div>
                          {" "}
                          <Badge variant="outline">{selectedRow.status}</Badge>
                        </div>
                        <div className="font-bold">Assigned To:</div>
                        <div> {selectedRow.assigned_to}</div>
                      </Card>
                    </div>
                  ) : (
                    <p className="mt-4 text-center text-sm text-gray-500">
                      Select a row to view details
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
          {/* <p className="mb-4">
            This table displays all the issues submitted by users.
          </p> */}
        </CardContent>
      </Card>
      <div
        className={`${isDarkMode ? "ag-theme-alpine-dark" : "ag-theme-alpine"}`}
        style={{ height: "750px", width: "100%" }}
      >
        <AgGridReact
          columnDefs={columnDefs} // Define columns
          rowData={rowData} // Provide row data
          pagination={true} // Enable pagination
          onRowClicked={onRowClicked} // Handle row click event
          paginationPageSize={20} // Items per page
          defaultColDef={{
            flex: 1,
            minWidth: 100,
            resizable: true, // Allow resizing columns
          }}
          // rowHeight={55}
        />
      </div>
    </AuthenticatedLayout>
  );
}
