import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional Theme
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Button } from "~/components/ui/button";
import { ColDef } from "ag-grid-community";
import { ComboboxEditor } from "~/components/user-select-cell-editor";
import { Badge } from "~/components/ui/badge";
import { toast } from "sonner";
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

interface Issue {
  id: number;
  type: string;
  title: string;
  priority: string;
  status: string;
  description: string;
  file: string;
  comments: string;
  activities: string;
  assignee?: { name: string };
  creator: { name: string };
  updater: { name: string };
  created_at: string;
  updated_at: string;
}

interface IssueTableProps {
  issues: Issue[];
  onOpenRow: (issue: Issue) => void;
  mode: boolean;
}

const IssueTable: React.FC<IssueTableProps> = ({ issues, onOpenRow, mode }) => {
  const [selectedRow, setSelectedRow] = useState<{ id: number } | null>(null);

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
      toast.success("Issue has been updated.");
    }
  }, [form.data.status, selectedRow]);

  const handleStatusChange = (
    issueId: number,
    newStatus?: string,
    newAssignee?: string,
    newPriority?: string,
    newTitle?: string,
  ) => {
    // Set form data for both status and assigned_to
    // @ts-ignore
    form.setData({
      // @ts-ignore
      status: newStatus ?? rowData.status, // Update status
      // @ts-ignore
      assigned_to: newAssignee ?? rowData.assigned_to, // Update assigned user
      // @ts-ignore
      priority: newPriority ?? rowData.priority,
      // @ts-ignore
      title: newTitle ?? rowData.title,
    });

    // Update the selected row (optional, based on your app's logic)
    setSelectedRow({ id: issueId });
  };

  // AG Grid column definitions
  const columnDefs: ColDef<Issue>[] = [
    {
      headerName: "ID",
      field: "id",
      sortable: true,
      flex: 2,
      filter: true,
      cellRenderer: (params: {
        value:
          | string
          | number
          | boolean
          | React.ReactElement<any, string | React.JSXElementConstructor<any>>
          | Iterable<React.ReactNode>
          | React.ReactPortal
          | null
          | undefined;
        data: Issue;
      }) => {
        return (
          <div className="flex items-center justify-between  gap-2">
            <span>{params.value}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="ghost"
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

      flex: 8,
      sortable: true,
      filter: true,
      editable: true,
      singleClickEdit: true,
      onCellValueChanged: (event: any) => {
        const issueId = event.data.id; // Get the issue ID
        const newTitle = event.newValue; // Get the new title
        handleStatusChange(issueId, undefined, undefined, undefined, newTitle);
      },
    },
    {
      headerName: "Type",
      field: "type",
      sortable: true,
      filter: true,
      cellClass: "text-center",
      cellRenderer: (props: { value: string }) => {
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
      onCellValueChanged: (event: any) => {
        const issueId = event.data.id; // Get the issue ID
        // @ts-ignore
        const status = rowData.status; // Get the new status
        // @ts-ignore
        const assigned_to = rowData.assigned_to;
        const newPriority = event.newValue; // Get the new priority
        handleStatusChange(issueId, status, assigned_to, newPriority);
      },
      cellRenderer: (props: { value: string }) => (
        <ColoredBadge value={props.value} />
      ),
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
      onCellValueChanged: (event: { data: { id: any }; newValue: any }) => {
        const issueId = event.data.id; // Get the issue ID
        const newStatus = event.newValue; // Get the new status

        handleStatusChange(issueId, newStatus);
      },
      cellRenderer: (props: { value: string }) => (
        <ColoredBadge value={props.value} />
      ),
    },
    {
      headerName: "Assigned To",
      field: "assigned_to",
      sortable: true,
      cellClass: "text-center",
      singleClickEdit: true,
      editable: true,
      cellEditor: ComboboxEditor,
      onCellValueChanged: (event: {
        data: { id: any; status: any };
        newValue: any;
      }) => {
        const issueId = event.data.id; // Get the issue ID
        const newAssignee = event.newValue; // Get the new assignee
        const newStatus = event.data.status;
        handleStatusChange(issueId, newStatus, newAssignee);
      },
      cellRenderer: (props: { value: string | undefined }) => (
        <ExtendedAvatar userFullName={props.value} />
      ),
    },
    {
      headerName: "Updated By",
      // @ts-ignore
      field: "updated_by",
      sortable: true,
      cellRenderer: (props: { value: string | undefined }) => (
        <ExtendedAvatar userFullName={props.value} />
      ),
    },
    {
      headerName: "Created At",
      field: "created_at",
      sortable: true,
      cellRenderer: (props: { value: string | number | Date }) => {
        const date = new Date(props.value);

        const formattedDate = new Intl.DateTimeFormat("en-AU", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(date);

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
    activities: issue.activities,
    assigned_to: issue.assignee?.name || "N/A",
    created_by: issue.creator.name || "N/A",
    updated_by: issue.updater.name || "N/A",
    created_at: issue.created_at,
    updated_at: issue.updated_at,
    creator: issue.creator,
    updater: issue.updater,
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
          flex: 4,
          minWidth: 50,
          resizable: false, // Allow resizing columns
        }}
      />
    </div>
  );
};

export default IssueTable;
