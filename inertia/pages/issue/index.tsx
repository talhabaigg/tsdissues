import { useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "~/components/layouts/authenticated-layout";
import IssueTable from "~/pages/issue/datatable/issues-data-table";
import IssueFormModal from "~/components/issue-form-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { KanbanBoard } from "~/components/KanbanBoard";
import { MultiSelect } from "~/components/multi-select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { Head } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import IssueFormQR from "~/components/issue-form-guest-qr";
import { Task } from "~/components/TaskCard";
import IssueSheetTabs from "./partials/sheet-tabs";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { SearchSelect } from "~/components/search-select";
import { useMemo } from "react";
import { PageProps } from "~/types";
import { router } from "@inertiajs/react";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { Trash } from "lucide-react";

interface Issue {
  id: number;
  type: string;
  title: string;
  description: string;
  file: string;
  priority: string;
  status: string;
  due_date: string;
  assigned_to: string;
  created_by: string;
  creator: { name: string };
  updated_at: string;
  updater: { name: string };
  created_at: string;
  comments: string;
  activities: any[];
  assignee: { name: string };
  owner?: { name: string };
}
interface User {
  id: number;
  name: string;
  isAdmin?: boolean;
}

declare module "@inertiajs/react" {
  interface PageProps {
    auth: {
      user: User | null;
    };
    issues: {
      data: Issue[];
      meta: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
      };
    };
  }
}
export default function Dashboard() {
  const { auth } = usePage().props as PageProps;
  const issues = usePage().props.issues;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Issue | null>(null);
  const [open, setOpen] = React.useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedCreator, setSelectedCreator] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [selectedOwner, setSelectedOwner] = useState("");
  // const [filteredIssues, setFilteredIssues] = useState<Issue[]>(issues.data);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const moveForm = useForm<{ status: string }>({ status: "" });
  const isAdmin = auth.user?.isAdmin;
  const [withTrashed, setWithTrashed] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("withTrashed");
    if (saved === "true") setWithTrashed(true);
  }, []);

  const toggleWithTrashed = () => {
    const newVal = !withTrashed;
    setWithTrashed(newVal);
    localStorage.setItem("withTrashed", newVal.toString());
    fetchIssues(newVal);
  };
  const fetchIssues = (includeTrashed = withTrashed) => {
    router.visit(route("issue.index"), {
      preserveScroll: true,
      preserveState: true,
      replace: true,
      only: ["issues"],
      data: {
        with_trashed: includeTrashed ? "true" : undefined,
      },
    });
  };
  const [loadingFilters, setLoadingFilters] = useState(true);
  useEffect(() => {
    const savedFilters = localStorage.getItem("issueTableFilters");
    if (savedFilters) {
      const {
        selectedTitle,
        selectedType,
        selectedPriority,
        selectedStatus,
        selectedCreator,
        selectedAssignee,
        selectedOwner,
      } = JSON.parse(savedFilters);

      if (selectedTitle) setSelectedTitle(selectedTitle);
      if (selectedType) setSelectedType(selectedType);
      if (selectedPriority) setSelectedPriority(selectedPriority);
      if (selectedStatus) setSelectedStatus(selectedStatus);
      if (selectedCreator) setSelectedCreator(selectedCreator);
      if (selectedAssignee) setSelectedAssignee(selectedAssignee);
      if (selectedOwner) setSelectedOwner(selectedOwner);
    }
    setLoadingFilters(false);
  }, []);

  useEffect(() => {
    const filters = {
      selectedTitle,
      selectedType,
      selectedPriority,
      selectedStatus,
      selectedCreator,
      selectedAssignee,
      selectedOwner,
    };

    localStorage.setItem("issueTableFilters", JSON.stringify(filters));
  }, [
    selectedTitle,
    selectedType,
    selectedPriority,
    selectedStatus,
    selectedCreator,
    selectedAssignee,
    selectedOwner,
  ]);

  const typeList = [
    { value: "it_hardware", label: "IT Hardware" },
    { value: "product_quality", label: "Product Quality" },
    { value: "it_applications", label: "IT Applications" },
    { value: "warehouse_operations", label: "Warehouse Operations" },
    { value: "safety", label: "Safety" },
  ];
  const statusList = [
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "resolved", label: "Resolved" },
  ];
  // Fetch and filter issues based on selected filters and search query
  const filteredIssues: Issue[] = useMemo(() => {
    return issues.data.filter((issue: Issue) => {
      return (
        issue.title.toLowerCase().includes(selectedTitle.toLowerCase()) &&
        (selectedType.length === 0 || selectedType.includes(issue.type)) &&
        (selectedStatus.length === 0 ||
          selectedStatus.includes(issue.status)) &&
        (!selectedPriority || issue.priority === selectedPriority) &&
        (!selectedCreator || issue.creator?.name === selectedCreator) &&
        (!selectedAssignee || issue.assignee?.name === selectedAssignee) &&
        (!selectedOwner || issue.owner?.name === selectedOwner)
      );
    });
  }, [
    issues.data,
    selectedTitle,
    selectedType,
    selectedPriority,
    selectedStatus,
    selectedCreator,
    selectedAssignee,
    selectedOwner,
  ]);

  const clearFilters = () => {
    setSelectedTitle("");
    setSelectedType([]);
    setSelectedPriority("");
    setSelectedStatus([]);
    setSelectedCreator("");
    setSelectedAssignee("");
    setSelectedOwner("");
    setSearchQuery(""); // Clear search query
    fetchIssues(); // Refetch issues to reset filters
    localStorage.removeItem("issueTableFilters");
  };
  const resetArrangements = () => {
    localStorage.removeItem("gridState");
    window.location.reload();
  };
  const rowData = (issue: Issue) => ({
    id: issue.id,
    type: issue.type,
    title: issue.title,
    priority: issue.priority,
    status: issue.status,
    due_date: issue.due_date,
    description: issue.description,
    file: issue.file,
    comments: issue.comments,
    activities: issue.activities,
    assigned_to: issue.assignee?.name || "N/A",
    created_by: issue.creator?.name || "N/A",
    updated_by: issue.updater?.name || "N/A",
    created_at: issue.created_at,
    updated_at: issue.updated_at,
    creator: issue.creator,
    updater: issue.updater,
    assignee: issue.assignee, // Add this line to include the assignee property
    owner: issue.owner, // Optionally include owner if needed by Issue type
  });

  const taskHandlers = {
    customMoveHandler: (task: Task, status: string) => {
      moveForm.data.status = status;
      moveForm.post(`/issues/${task.id}/update-status`);
    },

    customClickHandler: (id: number) => {
      fetch(route("issue.show", id))
        .then((response) => response.json())
        .then((data: Issue) => {
          const formattedData = rowData(data);
          onOpenRow(formattedData);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setIsDarkMode(savedTheme === "dark");
  }, []);

  const onOpenRow = (rowData: Issue) => {
    setSelectedRow(rowData);
    setOpen(true);
  };

  return (
    <AuthenticatedLayout>
      <Head title="View Issues" />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="max-w-md mx-auto shadow-lg rounded-lg p-6">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold">
              Issue #{selectedRow?.id}
            </SheetTitle>
          </SheetHeader>
          <IssueSheetTabs selectedRow={selectedRow} />
        </SheetContent>
      </Sheet>
      <Tabs defaultValue="table" className="w-full">
        <div className="flex justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xlg:grid-cols-8  gap-2">
            {!loadingFilters && (
              <MultiSelect
                options={typeList}
                onValueChange={setSelectedType}
                defaultValue={selectedType}
                placeholder="Filter by type"
                variant="inverted"
                animation={2}
                maxCount={2}
                className="col-span-1 sm:col-span-2"
              />
            )}
            {!loadingFilters && (
              <MultiSelect
                options={statusList}
                onValueChange={setSelectedStatus}
                defaultValue={selectedStatus}
                placeholder="Filter by status"
                variant="inverted"
                animation={2}
                maxCount={2}
                className="col-span-1 sm:col-span-2"
              />
            )}

            <SearchSelect
              options={[
                { value: "critical", label: "Critical" },
                { value: "normal", label: "Normal" },
              ]}
              optionName="Priority"
              selectedOption={selectedPriority}
              onValueChange={setSelectedPriority}
            />

            <SearchSelect
              options={[
                ...new Set(
                  issues.data
                    .map((issue: Issue) => issue?.creator?.name)
                    .filter((name: string): name is string => !!name),
                ),
              ].map((creatorName) => ({
                value: String(creatorName),
                label: String(creatorName),
              }))}
              optionName="Creator"
              selectedOption={selectedCreator}
              onValueChange={setSelectedCreator}
            />

            <SearchSelect
              options={[
                ...new Set(
                  issues.data
                    .map((issue) => issue?.owner?.name)
                    .filter((name): name is string => !!name),
                ),
              ].map((ownerName) => ({
                value: String(ownerName),
                label: String(ownerName),
              }))}
              optionName="Owner"
              selectedOption={selectedOwner}
              onValueChange={setSelectedOwner}
            />
            <SearchSelect
              options={[
                ...new Set(
                  issues.data
                    .map((issue) => issue?.assignee?.name)
                    .filter((name): name is string => !!name),
                ),
              ].map((assigneeName) => ({
                value: String(assigneeName),
                label: String(assigneeName),
              }))}
              optionName="Assignee"
              selectedOption={selectedAssignee}
              onValueChange={setSelectedAssignee}
            />
          </div>

          <div className="flex flex-col sm:flex-row  gap-2">
            {isAdmin && <IssueFormQR />}
            <IssueFormModal loggedIn={true} />
          </div>
        </div>
        <div className="flex gap-2 items-center flex-col sm:flex-row ">
          <Input
            type="text"
            placeholder="Search by title"
            className="sm:w-64 my-2 w-full"
            value={selectedTitle} // Set input value to searchQuery state
            onChange={(e) => setSelectedTitle(e.target.value)} // Update search query on input change
          />
          <Button
            variant="link"
            onClick={clearFilters}
            className="mr-auto sm:mr-0"
          >
            Clear filters
          </Button>
          <Button
            variant="link"
            onClick={resetArrangements}
            className="mr-auto sm:mr-0"
          >
            Reset Column Settings
          </Button>
          <Button variant="outline" className="mr-auto sm:ml-auto sm:mr-0">
            <Checkbox
              id="withTrashed"
              checked={withTrashed}
              onCheckedChange={toggleWithTrashed}
            />
            <Label htmlFor="withTrashed">Show archived</Label>
          </Button>
        </div>
        <TabsContent value="table" className="w-full">
          <IssueTable
            issues={filteredIssues} // Use filtered issues
            onOpenRow={onOpenRow}
            isAdmin={isAdmin}
            mode={isDarkMode}
          />
        </TabsContent>
        <TabsContent value="kanban" className="mt-10">
          <KanbanBoard
            issues={filteredIssues} // Use filtered issues
            taskHandlers={taskHandlers}
          />
        </TabsContent>
      </Tabs>
    </AuthenticatedLayout>
  );
}
