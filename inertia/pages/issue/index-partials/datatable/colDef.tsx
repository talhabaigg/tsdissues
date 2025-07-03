import { ComboboxEditor } from "~/components/user-select-cell-editor";
import IdCellRenderer from "../../datatable/cell-renderers/id-renderer";
import ExtendedAvatar from "~/components/user-avatar-extended";
import DueDateCellRenderer from "../../datatable/cell-renderers/due-date-cell-renderer";
import PriorityCellRenderer from "../../datatable/cell-renderers/priority-cell-renderer";
import TypeCellRenderer from "../../datatable/cell-renderers/type-cell-renderer";
import CreatedAtCellRenderer from "../../datatable/cell-renderers/created-at-cell-renderer";

export const colDefs = [
  { field: "title" as const },
  {
    headerName: "Action",
    hide: false,
    maxWidth: 120,
    minWidth: 150,
    resizable: true,
    cellRenderer: (params: any) => (
      <IdCellRenderer value={params.value} data={params.data} />
    ),
  },
  {
    headerName: "Type",
    field: "type",
    filter: false,
    cellClass: "text-left",
    minWidth: 150,
    resizable: true,
    cellRenderer: TypeCellRenderer,
  },
  {
    headerName: "Priority",
    field: "priority",
    filter: false,
    minWidth: 150,
    resizable: true,
    cellClass: "text-left",
    cellEditor: "agSelectCellEditor",
    singleClickEdit: true,
    cellEditorParams: {
      values: ["critical", "normal"],
    },
  },
  {
    headerName: "Status",
    field: "status",
    hide: false,
    filter: false,
    minWidth: 150,
    resizable: true,
    cellClass: "text-left",
    cellEditor: "agSelectCellEditor",
    singleClickEdit: true,
    cellEditorParams: {
      values: ["active", "resolved", "pending"],
    },

    cellRenderer: (props: { value: string }) => <div>{props.value}</div>,
  },
  {
    headerName: "Due date",
    field: "due_date",
    minWidth: 150,
    resizable: true,
    cellClass: "text-left",
    singleClickEdit: true,
    cellEditor: "agDateCellEditor",
    cellDataType: "date",
    cellRenderer: DueDateCellRenderer,
  },
  {
    headerName: "Owner",
    field: "owner_id",
    cellClass: "text-center",
    singleClickEdit: true,
    minWidth: 150,
    resizable: true,
    editable: false,
    hide: window.innerWidth <= 768,
    cellEditor: ComboboxEditor,
    cellRenderer: (props: { value: string | undefined }) => (
      <ExtendedAvatar userFullName={props.value} />
    ),
  },
  {
    headerName: "Assigned to",
    field: "assigned_to",
    cellClass: "text-center",
    singleClickEdit: true,
    hide: window.innerWidth <= 768,
    minWidth: 150,
    resizable: true,

    cellEditor: ComboboxEditor,

    cellRenderer: (props: { value: string | undefined }) => (
      <ExtendedAvatar userFullName={props.value} />
    ),
  },
  {
    headerName: "Created by",
    field: "created_by",
    minWidth: 150,
    resizable: true,
    hide: window.innerWidth <= 768,
    cellRenderer: (props: { value: string | undefined }) => (
      <ExtendedAvatar userFullName={props.value} />
    ),
  },
  {
    headerName: "Created At",
    field: "created_at",
    minWidth: 150,
    resizable: true,
    hide: window.innerWidth <= 768,
    cellRenderer: CreatedAtCellRenderer,
  },
  {
    headerName: "Last update",
    field: "updated_at",
    minWidth: 150,
    resizable: true,

    cellRenderer: CreatedAtCellRenderer,
  },
];
