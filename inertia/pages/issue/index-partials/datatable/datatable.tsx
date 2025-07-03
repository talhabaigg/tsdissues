import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional Theme
import "ag-grid-community/styles/ag-theme-quartz.css";
import "~/css/custom-ag-grid-theme.css"; // Import your custom theme
import { useState } from "react";
import { Issue, User } from "~/types/model";
import IdCellRenderer from "../../datatable/cell-renderers/id-renderer";
import { colDefs } from "./colDef";
interface IssueDataTableProps {
  issues: Issue[];
}
interface IssueRowData {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  type: string;
  due_date?: string;
  owner: string | null;
  assignee: string | null;
  creator: string | null;
  updater: string | null;
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
      owner: issue.owner?.name || "N/A",
      assignee: issue.assignee?.name || "N/A",
      creator: issue.creator?.name || "N/A",
      updater: issue.updater?.name || "N/A",
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    })),
  );

  return (
    <div className={"ag-theme-quartz"} style={{ height: 750, width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs as any}
        defaultColDef={{ editable: true }}
      />
    </div>
  );
}
