// @ts-nocheck
import AuthenticatedLayout from "~/components/layouts/authenticated-layout";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardHeader,
} from "~/components/ui/card";
import { Head } from "@inertiajs/react";
import IssueForm from "~/components/issue-form";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "~/components/ui/table";
import { FilePreview } from "~/components/comment-file-preview";
import IssueSheetTabs from "./partials/sheet-tabs";
import IssueCommentBox from "~/components/issue-comment-box";
export default function show({ issue }) {
  return (
    <AuthenticatedLayout>
      <Head title={issue.title} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="">
          <CardHeader>
            <CardTitle>{issue.title}</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableHead className="">Description</TableHead>
                  <TableCell className="font-medium">
                    {issue.description}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className="">Type</TableHead>
                  <TableCell className="font-medium">{issue.type}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className="">Status</TableHead>
                  <TableCell className="font-medium">{issue.status}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className="">Priority</TableHead>
                  <TableCell className="font-medium">
                    {issue.priority}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className="">Creator</TableHead>
                  <TableCell className="font-medium">
                    {issue.creator.name}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className="">Owner</TableHead>
                  <TableCell className="font-medium">
                    {issue.owner?.name || "Unassigned"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className="">Assigned to</TableHead>
                  <TableCell className="font-medium">
                    {issue.assignee?.name || "Unassigned"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className="">File</TableHead>
                  <TableCell className="font-medium">

                    {issue.file ? (
                     <FilePreview file={issue.file} />
                    ) : (
                      "No file attached"
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="grid col-span-2">
          <CardHeader>Comments</CardHeader>
          <CardContent>
            <IssueCommentBox
              issueId={issue ? issue.id : 0}
              // @ts-ignore
              existingComments={issue ? issue.comments : []}
            />
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
