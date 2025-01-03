import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional Theme
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ColDef } from "ag-grid-community";
import { ComboboxEditor } from "~/components/user-select-cell-editor";
import { toast } from "sonner";
import ColoredBadge from "~/components/colored-badge";
import ExtendedAvatar from "~/components/user-avatar-extended";
import { useForm } from "@inertiajs/react";
import IdCellRenderer from "./cell-renderers/id-renderer";
import TypeCellRenderer from "./cell-renderers/type-cell-renderer";
import PriorityCellRenderer from "./cell-renderers/priority-cell-renderer";
import CreatedAtCellRenderer from "./cell-renderers/created-at-cell-renderer";

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
      flex: 2,
      filter: true,
      cellRenderer: (params: any) => (
        <IdCellRenderer
          value={params.value}
          data={params.data}
          onOpenRow={onOpenRow}
        />
      ),
    },
    {
      headerName: "Title",
      field: "title",
      flex: 8,
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
      filter: true,
      cellClass: "text-center",
      cellRenderer: TypeCellRenderer,
    },
    {
      headerName: "Priority",
      field: "priority",
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
      cellRenderer: (params: { value: string }) => (
        <PriorityCellRenderer value={params.value} />
      ),
    },
    {
      headerName: "Status",
      field: "status",

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

      cellRenderer: (props: { value: string | undefined }) => (
        <ExtendedAvatar userFullName={props.value} />
      ),
    },
    {
      headerName: "Created At",
      field: "created_at",
      cellRenderer: CreatedAtCellRenderer,
    },
    {
      headerName: "Updated At",
      field: "updated_at",
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
          resizable: false, // Allow resizing columns
        }}
      />
    </div>
  );
};

export default IssueTable;
