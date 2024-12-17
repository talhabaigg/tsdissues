import AuthenticatedLayout from "~/components/layouts/authenticated-layout";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Head } from "@inertiajs/react";
import LatestComments from "~/components/issue-updates-widget";
import IssueActivityBox from "~/components/issue-activity-box";
import { usePage } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";
export default function Dashboard() {
  const { existingActivities } = usePage().props as unknown as {
    existingActivities: any[];
  };

  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />
      <div className="flex flex-1 flex-col  ">
        <div className="grid auto-rows-min grid-cols-1 gap-2 md:grid-cols-2">
          <div className="aspect-video rounded-xl ">
            <Card className="shadow-lg">
              <CardHeader> Latest Comments</CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]  sm:h-[400px]  rounded-md  ">
                  <LatestComments />
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          <div className="aspect-video rounded-xl  ">
            <Card className="shadow-lg">
              <CardHeader> Latest Activites</CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]  sm:h-[400px] ">
                  <IssueActivityBox existingActivities={existingActivities} />
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* <div className="aspect-video rounded-xl bg-muted/50" /> */}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
