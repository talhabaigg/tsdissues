import AuthenticatedLayout from "~/components/layouts/authenticated-layout";
import { Card, CardContent } from "~/components/ui/card";
import { Head } from "@inertiajs/react";
import LatestComments from "~/components/issue-updates-widget";

export default function Dashboard() {
  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-videooverflow-auto rounded-xl bg-muted/50">
            <LatestComments />
          </div>
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </AuthenticatedLayout>
  );
}
