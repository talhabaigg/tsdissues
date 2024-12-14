import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional Theme
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Button } from "~/components/ui/button";
import { ComboboxEditor } from "~/components/user-select-cell-editor";
import { Badge } from "~/components/ui/badge";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "~/components/ui/tooltip";
import { MessageCircle } from "lucide-react";
import ColoredBadge from "~/components/colored-badge";
import ExtendedAvatar from "~/components/user-avatar-extended";
import { useForm } from "@inertiajs/react";

const IssueTable = ({ issues, onOpenRow, mode }) => {
  const [selectedRow, setSelectedRow] = useState(null);

  console.log("mode", mode);

  const form = useForm({
    status: "",
    assigned_to: "",
    priority: "",
    title: "",
  });

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
    issueId,
    newStatus,
    newAssignee,
    newPriority,
    newTitle,
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
            <span>{params.value}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
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
      headerName: "Type",
      field: "type",
      sortable: true,
      filter: true,
      cellClass: "text-center",
      cellRenderer: (props) => {
        const value = props.value;
        const formattedValue = value.replace(/_/g, " ").toUpperCase();
        return <Badge>{formattedValue}</Badge>;
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
        handleStatusChange(issueId, status, assigned_to, newPriority);
      },
      cellRenderer: (props) => <ColoredBadge value={props.value} />,
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
        values: ["active", "resolved", "pending"],
      },
      onCellValueChanged: (event) => {
        const issueId = event.data.id; // Get the issue ID
        const newStatus = event.newValue; // Get the new status

        handleStatusChange(issueId, newStatus);
      },
      cellRenderer: (props) => <ColoredBadge value={props.value} />,
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
        const newAssignee = event.newValue; // Get the new assignee
        const newStatus = event.data.status;
        handleStatusChange(issueId, newStatus, newAssignee);
      },
      cellRenderer: (props) => <ExtendedAvatar userFullName={props.value} />,
    },
    { headerName: "Updated By", field: "updated_by", sortable: true },
    {
      headerName: "Created At",
      field: "created_at",
      sortable: true,
      cellRenderer: (props) => {
        const date = new Date(props.value);
        const options = { day: "2-digit", month: "short", year: "numeric" };
        const formattedDate = new Intl.DateTimeFormat("en-AU", options).format(
          date,
        );

        // Replacing the default separator with a hyphen and converting month to uppercase
        const [day, month, year] = formattedDate.split(" ");
        return `${day}-${month.toUpperCase()}-${year}`;
      },
    },
    {
      headerName: "Updated At",
      field: "updated_at",
      sortable: true,
      hide: true,
    },
  ];

  const rowData = issues.map((issue) => ({
    id: issue.id,
    type: issue.type,
    title: issue.title,
    priority: issue.priority,
    status: issue.status,
    description: issue.description,
    file: issue.file,
    comments: issue.comments,
    assigned_to: issue.assignee?.name || "N/A",
    created_by: issue.creator.name || "N/A",
    updated_by: issue.updater.name || "N/A",
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  }));

  return (
    <div
      className={`${mode ? "ag-theme-quartz-dark" : "ag-theme-quartz"}`}
      style={{ height: 750, width: "100%" }}
    >
      <AgGridReact
        columnDefs={columnDefs}
        rowData={rowData}
        pagination={true}
        paginationPageSize={20}
        defaultColDef={{
          flex: 1,
          minWidth: 100,
          resizable: false, // Allow resizing columns
        }}
      />
    </div>
  );
};

export default IssueTable;
