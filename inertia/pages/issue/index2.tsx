import { Head, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "~/components/layouts/authenticated-layout";
import IssueDataTable from "./index-partials/datatable/datatable";
import { useEffect, useMemo, useState } from "react";
import { Issue } from "~/types/model";
import { Button } from "~/components/ui/button";
import { MultiSelect } from "~/components/multi-select";
import { SearchSelect } from "~/components/search-select";
import { Input } from "~/components/ui/input";
import { Search } from "lucide-react";
import IssueFormQR from "~/components/issue-form-guest-qr";
import IssueFormModal from "~/components/issue-form-modal";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";

interface IssueIndexProps {
  issues: {
    data: Issue[];
  };
  withTrashed?: boolean;
  issue_types: IssueCategory[];
}

const statusList = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "resolved", label: "Resolved" },
];
interface IssueCategory {
  id: number;
  name: string;
}

export default function IssueIndex({ issues, issue_types }: IssueIndexProps) {
  const [filters, setFilters] = useState({
    selectedTitle: "",
    selectedType: [] as string[],
    selectedPriority: "",
    selectedStatus: [] as string[],
    selectedCreator: "",
    selectedAssignee: "",
    selectedOwner: "",
  });
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
  const typeList = issue_types.map((type: IssueCategory) => ({
    value: type.name,
    label: type.name,
  }));
  useEffect(() => {
    try {
      const saved = localStorage.getItem("issueTableFilters");
      if (saved) {
        setFilters((prev) => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch {
      console.warn("Invalid issue filter JSON in localStorage");
    }
    setLoadingFilters(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("issueTableFilters", JSON.stringify(filters));
  }, [filters]);

  const filteredIssues = useMemo(() => {
    return issues.data.filter((issue) => {
      const titleMatch = issue.title
        .toLowerCase()
        .includes(filters.selectedTitle.toLowerCase());
      const typeMatch =
        filters.selectedType.length === 0 ||
        filters.selectedType.includes(issue.type);
      const statusMatch =
        filters.selectedStatus.length === 0 ||
        filters.selectedStatus.includes(issue.status);
      const priorityMatch =
        !filters.selectedPriority ||
        issue.priority === filters.selectedPriority;
      const creatorMatch =
        !filters.selectedCreator ||
        issue.creator?.name === filters.selectedCreator;
      const assigneeMatch =
        !filters.selectedAssignee ||
        issue.assignee?.name === filters.selectedAssignee;
      const ownerMatch =
        !filters.selectedOwner || issue.owner?.name === filters.selectedOwner;

      return (
        titleMatch &&
        typeMatch &&
        statusMatch &&
        priorityMatch &&
        creatorMatch &&
        assigneeMatch &&
        ownerMatch
      );
    });
  }, [issues.data, filters]);

  const resetArrangements = () => {
    localStorage.removeItem("gridState");
    window.location.reload();
  };

  const clearFilters = () => {
    setFilters({
      selectedTitle: "",
      selectedType: [],
      selectedPriority: "",
      selectedStatus: [],
      selectedCreator: "",
      selectedAssignee: "",
      selectedOwner: "",
    });
  };
  const { auth } = usePage().props as any;
  const isAdmin = auth?.user?.isAdmin;

  return (
    <AuthenticatedLayout>
      <Head title="View Issues" />
      <div className="flex justify-between flex-col sm:flex-row items-center mb-4">
        <div className="flex flex-col space-y-1">
          <div className="flex flex-col sm:flex-row max-w-2xl min-w-96 sm:min-w-none sm:space-x-2 space-y-1 sm:space-y-0">
            {!loadingFilters && (
              <>
                <MultiSelect
                  options={typeList}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, selectedType: value }))
                  }
                  defaultValue={filters.selectedType}
                  placeholder="Filter by type"
                  variant="inverted"
                  animation={2}
                  maxCount={2}
                  className="col-span-1 sm:col-span-2"
                />
                <MultiSelect
                  options={statusList}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, selectedStatus: value }))
                  }
                  defaultValue={filters.selectedStatus}
                  placeholder="Filter by status"
                  variant="inverted"
                  animation={2}
                  maxCount={2}
                  className="col-span-1 sm:col-span-2"
                />
              </>
            )}
          </div>
          <div className="flex flex-col sm:flex-row max-w-2xl sm:space-x-2 space-y-1 sm:space-y-0">
            <SearchSelect
              options={[
                { value: "critical", label: "Critical" },
                { value: "normal", label: "Normal" },
              ]}
              optionName="Priority"
              selectedOption={filters.selectedPriority}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, selectedPriority: value }))
              }
            />
            <SearchSelect
              options={[
                ...new Set(
                  issues.data
                    .map((issue: Issue) => issue?.creator?.name)
                    .filter(
                      (name: string | undefined): name is string => !!name,
                    ),
                ),
              ].map((creatorName) => ({
                value: String(creatorName),
                label: String(creatorName),
              }))}
              optionName="Creator"
              selectedOption={filters.selectedCreator}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, selectedCreator: value }))
              }
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
              selectedOption={filters.selectedOwner}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, selectedOwner: value }))
              }
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
              selectedOption={filters.selectedAssignee}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, selectedAssignee: value }))
              }
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:max-w-2xl items-center sm:space-x-2 space-y-1 sm:space-y-0 min-w-96 sm:min-w-none ">
            <div className="relative w-full">
              <Search
                className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                type="text"
                placeholder="Search by name"
                value={filters.selectedTitle}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    selectedTitle: e.target.value,
                  }))
                } // Update search query on input change
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="mr-auto sm:mr-0 w-full sm:w-auto"
            >
              Clear filters
            </Button>
            <Button
              variant="outline"
              onClick={resetArrangements}
              className="mr-auto sm:mr-0 w-full sm:w-auto"
            >
              Reset Settings
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
        </div>
        <div className="flex flex-col sm:flex-row mt-2 sm:mt-0 gap-2 min-w-96 sm:min-w-0">
          {<IssueFormQR />}
          <IssueFormModal />
        </div>
      </div>
      <div className="max-w-96 mx-auto sm:max-w-full sm:mx-0">
        {" "}
        <IssueDataTable issues={filteredIssues} isAdmin={isAdmin} />
      </div>
    </AuthenticatedLayout>
  );
}
