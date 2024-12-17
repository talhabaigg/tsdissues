import { useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "~/components/layouts/authenticated-layout";
import IssueTable from "~/components/issues-data-table";
import IssueFormModal from "~/components/issue-form-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { KanbanBoard } from "~/components/KanbanBoard";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { Head } from "@inertiajs/react";
import React from "react";
import { useEffect, useState } from "react";
import IssueFormQR from "~/components/issue-form-guest-qr";
import { Task } from "~/components/TaskCard";
import IssueSheetTabs from "./partials/sheet-tabs";
interface Issue {
  id: number;
  type: string;
  title: string;
  description: string;
  file: string;
  priority: string;
  status: string;
  assigned_to: string;
  created_by: string;
  creator: string;
  updated_at: string;
  updater: string;
  created_at: string;
  comments: string;
  activities: any[];
  assignee: { name: string };
}

interface IssuesProps {
  issues: {
    data: Issue[];
  };
}

export default function Dashboard() {
  const { issues } = usePage().props;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Issue | null>(null);
  const [open, setOpen] = React.useState(false);
  const moveForm = useForm({ status: "" });
  const rowData = (issue: Issue) => ({
    id: issue.id,
    type: issue.type,
    title: issue.title, // Assuming 'title' is a property in issue
    priority: issue.priority,
    status: issue.status,
    description: issue.description,
    file: issue.file, // Assuming 'file' is a property in issue
    comments: issue.comments,
    activities: issue.activities,
    assigned_to: issue.assignee?.name || "N/A", // If assignee exists, get their name, otherwise "N/A"
    created_by: issue.creator.name || "N/A", // If creator exists, get their name, otherwise "N/A"
    updated_by: issue.updater.name || "N/A", // If updater exists, get their name, otherwise "N/A"
    created_at: issue.created_at,
    updated_at: issue.updated_at,
    creator: issue.creator,
    updater: issue.updater,
  });
  const taskHandlers = {
    customMoveHandler: (task: Task, status: string) => {
      moveForm.data.status = status;
      moveForm.post(`/issues/${task.id}/update-status`);
    },

    customClickHandler: (id: any) => {
      console.log("Received task ID:", id);
      fetch(route("issue.show", id))
        .then((response) => response.json()) // Parse the JSON response
        .then((data) => {
          const formattedData = rowData(data);
          onOpenRow(formattedData);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
  };

  useEffect(() => {
    // Check if a theme is saved in localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }, []);

  const onOpenRow = (rowData) => {
    setSelectedRow(rowData);

    setOpen(true);
  };

  return (
    <AuthenticatedLayout>
      <Head title="View Submitted Issues" />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="max-w-md mx-auto shadow-lg rounded-lg p-6">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold ">
              Issue #{selectedRow?.id}
            </SheetTitle>
          </SheetHeader>
          <IssueSheetTabs selectedRow={selectedRow} />
        </SheetContent>
      </Sheet>
      <Tabs defaultValue="table" className="w-full">
        <div className="flex justify-between">
          <div>
            <TabsList className="w-full">
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="kanban">Kanban View</TabsTrigger>
            </TabsList>
          </div>
          <div className="space-x-2">
            <IssueFormQR />
            <IssueFormModal />
          </div>
        </div>
        <TabsContent value="table" className="w-full">
          <IssueTable
            // @ts-ignore
            issues={issues.data}
            onOpenRow={onOpenRow}
            mode={isDarkMode}
          />
        </TabsContent>
        <TabsContent value="kanban" className="mt-10">
          <KanbanBoard
            // @ts-ignore
            issues={issues.data}
            taskHandlers={taskHandlers}
          />
        </TabsContent>
      </Tabs>
    </AuthenticatedLayout>
  );
}
