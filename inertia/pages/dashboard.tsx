import AuthenticatedLayout from "~/components/layouts/authenticated-layout";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Head } from "@inertiajs/react";
import LatestComments from "~/components/issue-updates-widget";
import IssueActivityBox from "~/components/issue-activity-box";
import { usePage } from "@inertiajs/react";
import React, { useState, useEffect } from "react";

export default function Dashboard() {
  const { existingActivities } = usePage().props as unknown as {
    existingActivities: any[];
  };

  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <div className="aspect-videooverflow-auto rounded-xl bg-muted/50">
            <LatestComments />
          </div>
          <div className="aspect-video rounded-xl bg-muted/50">
            <Card>
              <CardHeader>
                {" "}
                <h1 className="font-bold p-2">Latest Activites</h1>
              </CardHeader>
              <CardContent>
                <IssueActivityBox existingActivities={existingActivities} />
              </CardContent>
            </Card>
          </div>
          {/* <div className="aspect-video rounded-xl bg-muted/50" /> */}
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </AuthenticatedLayout>
  );
}
