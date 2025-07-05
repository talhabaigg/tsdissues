import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional Theme
import "ag-grid-community/styles/ag-theme-quartz.css";
import "~/css/custom-ag-grid-theme.css"; // Import your custom theme
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Issue } from "~/types/model";
import { colDefs } from "./colDef";
import { useForm } from "@inertiajs/react";
interface IssueDataTableProps {
  issues: Issue[];
}
declare let window: any;
interface IssueRowData {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  type: string;
  due_date?: string;
  owner_id: string | null;
  assigned_to: string | null;
  updated_by: string | null;
  created_by: string | null;
  created_at?: string;
  updated_at?: string;
}
export default function IssueDataTable({ issues }: IssueDataTableProps) {
  const [rowData, setRowData] = useState<IssueRowData[]>(
    issues.map((issue) => ({
      id: issue.id,
      title: issue.title,
      description: issue.description,
      status: issue.status,
      priority: issue.priority,
      type: issue.type,
      due_date: issue.due_date,
      owner_id: issue.owner?.name || "N/A",
      assigned_to: issue.assignee?.name || "N/A",
      updated_by: issue.updater?.name || "N/A",
      created_by: issue.creator?.name || "N/A",
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    })),
  );
  useEffect(() => {
    setRowData(
      issues.map((issue) => ({
        id: issue.id,
        title: issue.title,
        description: issue.description,
        status: issue.status,
        priority: issue.priority,
        type: issue.type,
        due_date: issue.due_date,
        owner_id: issue.owner?.name || "N/A",
        assigned_to: issue.assignee?.name || "N/A",
        updated_by: issue.updater?.name || "N/A",
        created_by: issue.creator?.name || "N/A",
        created_at: issue.created_at,
        updated_at: issue.updated_at,
      })),
    );
  }, [issues]);
  interface IssueUpdateForm {
    id: number;
    title: string;
    status: string;
    priority: string;
    assigned_to: string;
    due_date: string;
  }
  const { data, setData, put, processing, errors } = useForm<IssueUpdateForm>();
  const gridRef = useRef<AgGridReact>(null);

  const onGridReady = useCallback(() => {
    const savedState = window.localStorage.getItem("gridState");
    window.colState = savedState
      ? JSON.parse(savedState)
      : gridRef.current!.api.getColumnState();

    gridRef.current!.api.applyColumnState({
      state: window.colState,
      applyOrder: true,
    });
  }, []);

  const saveMovedState = useCallback(() => {
    if (gridRef.current) {
      window.colState = gridRef.current.api.getColumnState();
      window.localStorage.setItem("gridState", JSON.stringify(window.colState));
    }
  }, []);
  const defaultColDef = useMemo(
    () => ({
      editable: true,
      sortable: true,
      resizable: true,
      minWidth: 150,
      filter: true,
    }),
    [],
  );
  const onCellValueChanged = useCallback((event: any) => {
    const updatedRow = event.data;
    const updatedIssue: IssueUpdateForm = {
      id: updatedRow.id,
      title: updatedRow.title,
      status: updatedRow.status,
      priority: updatedRow.priority,
      assigned_to: updatedRow.assigned_to || "",
      due_date: updatedRow.due_date || "",
    };
    console.log("Updated Issue:", updatedIssue);
    setData({
      id: updatedIssue.id,
      title: updatedIssue.title,
      status: updatedIssue.status,
      priority: updatedIssue.priority,
      assigned_to: updatedIssue.assigned_to,
      due_date: updatedIssue.due_date,
    });
  }, []);

  useEffect(() => {
    if (data.id) {
      console.log("Submitting data:", data);
      put(route("issue.update", { issue: data.id.toString() }), {
        preserveScroll: true,
        onSuccess: () => {
          setData({
            id: 0,
            title: "",
            status: "",
            priority: "",
            assigned_to: "",
            due_date: "",
          });
        },
        onError: (errors) => {
          console.error("Error updating issue:", errors);
        },
      });
    }
  }, [data]);

  return (
    <div className={"ag-theme-quartz"} style={{ height: 750, width: "100%" }}>
      <AgGridReact
        ref={gridRef}
        suppressAutoSize={true}
        columnDefs={colDefs}
        rowData={rowData}
        pagination={true}
        paginationPageSize={20}
        defaultColDef={defaultColDef}
        onGridReady={onGridReady}
        onColumnMoved={saveMovedState}
        onColumnResized={saveMovedState}
        onCellValueChanged={onCellValueChanged}
      />
    </div>
  );
}
