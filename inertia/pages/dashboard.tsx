import AuthenticatedLayout from "~/components/layouts/authenticated-layout";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Head } from "@inertiajs/react";
import LatestComments from "~/components/widgets/issue-comments-widget";
import IssueActivityBox from "~/components/issue-activity-box";
import { usePage } from "@inertiajs/react";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import IssueSheetTabs from "./issue/partials/sheet-tabs";
import { useState, useEffect } from "react";
import React from "react";
import { LoadingSpinner } from "~/components/ui/spinner";
import IssueWidgetByDepartment from "~/components/widgets/issue-widget-by-department";
import IssueAssignedWidget from "~/components/widgets/issue-assigned-widget";
import { IssueAssignedUsersChart } from "~/components/widgets/issue-assigned-chart";
import { IssueDepartmentChart } from "~/components/widgets/issue-department-chart";
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
  creator: { name: string };
  updated_at: string;
  updater: { name: string };
  created_at: string;
  comments: string;
  activities: any[];
  assignee: { name: string };
}

export default function Dashboard() {
  const [selectedRow, setSelectedRow] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(false);
  const { existingActivities } = usePage().props as unknown as {
    existingActivities: any[];
  };

  const [open, setOpen] = React.useState(false);
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
  const commentClickHandler = (id: any) => {
    console.log("Received comment ID:", id);
    setLoading(true);
    setOpen(true);
    fetch(route("issue.show", id))
      .then((response) => response.json()) // Parse the JSON response
      .then((data) => {
        console.log(data);
        if (data) {
          setSelectedRow(rowData(data));
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        // Set loading state to false after the fetch is complete
        setLoading(false);
      });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />
      <div className="flex flex-1 flex-col  ">
        <div className="grid auto-rows-min grid-cols-1 gap-2 md:grid-cols-3">
          <div className="aspect-video rounded-xl ">
            {" "}
            <IssueAssignedUsersChart />
          </div>
          <div className="aspect-video rounded-xl ">
            {" "}
            <IssueDepartmentChart />
          </div>

          <div className="aspect-video rounded-xl ">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetContent className="max-w-md mx-auto shadow-lg rounded-lg p-6">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <LoadingSpinner size={24} className="text-primary-500" />
                  </div>
                ) : (
                  <>
                    <SheetHeader>
                      <SheetTitle className="text-xl font-bold ">
                        Issue #{selectedRow?.id}
                      </SheetTitle>
                    </SheetHeader>
                    <IssueSheetTabs selectedRow={selectedRow} />
                  </>
                )}
              </SheetContent>
            </Sheet>
            <Card className="shadow-lg">
              <CardHeader> Latest Comments</CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]  sm:h-[400px]  rounded-md  ">
                  <LatestComments commentClickHandler={commentClickHandler} />
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <div className="aspect-video rounded-xl  ">
            <Card className="shadow-lg">
              <CardHeader> Latest Activites</CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]  sm:h-[400px] ">
                  <IssueActivityBox
                    existingActivities={existingActivities}
                    commentClickHandler={commentClickHandler}
                  />
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          <div className="aspect-video rounded-xl ">
            {" "}
            <Card className="shadow-lg">
              <CardHeader> Open Issues by Department</CardHeader>
              <ScrollArea className="h-[300px]  sm:h-[400px] ">
                <CardContent>
                  <IssueWidgetByDepartment />
                </CardContent>
              </ScrollArea>
            </Card>
          </div>
          <div className="aspect-video rounded-xl ">
            {" "}
            <Card className="shadow-lg">
              <CardHeader> Assigned issues by User</CardHeader>
              <ScrollArea className="h-[300px]  sm:h-[400px] ">
                <CardContent>
                  <IssueAssignedWidget />
                </CardContent>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
