import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "~/components/layouts/authenticated-layout";
import IssueTable from "./datatable/issues-data-table";
import { useEffect, useState } from "react";
import IssueDataTable from "./index-partials/datatable/datatable";
import { Issue } from "~/types/model";

interface IssueIndexProps {
  issues: {
    data: Issue[];
  };
  withTrashed?: boolean;
}
export default function IssueIndex({ issues, withTrashed }: IssueIndexProps) {
  return (
    <AuthenticatedLayout>
      <Head title="View Issues" />
      <IssueDataTable issues={issues.data} />
    </AuthenticatedLayout>
  );
}
