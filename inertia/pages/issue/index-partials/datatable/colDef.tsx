import { ComboboxEditor } from "~/components/user-select-cell-editor";
import IdCellRenderer from "../../datatable/cell-renderers/id-renderer";
import ExtendedAvatar from "~/components/user-avatar-extended";
import DueDateCellRenderer from "../../datatable/cell-renderers/due-date-cell-renderer";
import PriorityCellRenderer from "../../datatable/cell-renderers/priority-cell-renderer";
import TypeCellRenderer from "../../datatable/cell-renderers/type-cell-renderer";
import CreatedAtCellRenderer from "../../datatable/cell-renderers/created-at-cell-renderer";
import { ColDef } from "ag-grid-community";
import { DatePicker } from "~/components/date-picker";
import { TypeSelectEditor } from "../typeSelector";
export const getColDefs = (isAdmin: boolean): ColDef[] => [
  {
    field: "title",
    headerName: "Title",
    editable: isAdmin,
    flex: 8,
  },
  {
    headerName: "Action",
    minWidth: 150,
    cellClass: "text-center",
    cellRenderer: (params: any) => (
      <IdCellRenderer value={params.value} data={params.data} />
    ),
  },
  {
    headerName: "Type",
    field: "type",
    editable: isAdmin,
    cellEditor: TypeSelectEditor,
    cellRenderer: TypeCellRenderer,
  },
  {
    headerName: "Priority",
    field: "priority",
    minWidth: 150,
    editable: isAdmin,
    cellEditor: "agSelectCellEditor",
    singleClickEdit: true,
    cellEditorParams: {
      values: ["critical", "normal"],
    },
  },
  {
    headerName: "Status",
    field: "status",
    editable: isAdmin,
    cellEditor: "agSelectCellEditor",
    singleClickEdit: true,
    cellEditorParams: {
      values: ["active", "resolved", "pending"],
    },
  },
  {
    headerName: "Due date",
    field: "due_date",
    singleClickEdit: true,
    editable: isAdmin,
    cellDataType: "date",
    cellRenderer: DueDateCellRenderer,
    cellEditor: DatePicker,
  },
  {
    headerName: "Owner",
    field: "owner_id",
    singleClickEdit: true,
    editable: isAdmin,
    hide: window.innerWidth <= 768,
    cellEditor: ComboboxEditor,
    cellRenderer: (props: { value: string | undefined }) => (
      <ExtendedAvatar userFullName={props.value} />
    ),
  },
  {
    headerName: "Assigned to",
    field: "assigned_to",
    editable: isAdmin,
    singleClickEdit: true,
    hide: window.innerWidth <= 768,
    cellEditor: ComboboxEditor,

    cellRenderer: (props: { value: string | undefined }) => (
      <ExtendedAvatar userFullName={props.value} />
    ),
  },
  {
    headerName: "Created by",
    // @ts-ignore
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
