import AuthenticatedLayout from "~/components/layouts/authenticated-layout";
import DeleteUserForm from "./partials/delete-user-form";
import UpdatePasswordForm from "./partials/update-password-form";
import UpdateProfileInformation from "./partials/update-profile-form";
import { Head } from "@inertiajs/react";
import AppearanceToggleTab from "~/components/appearance-tabs";
import ThemeToggle from "~/components/widgets/theme-toggle";
import { Label } from "~/components/ui/label";
import { Card } from "~/components/ui/card";

export default function Edit() {
  return (
    <AuthenticatedLayout>
      <Head title="Profile" />

      <div className="space-y-6">
        <Card>
          <div className="flex items-center justify-start p-4">
            <Label>Appearance</Label>
            <ThemeToggle />
          </div>
        </Card>
        <UpdateProfileInformation />
        <UpdatePasswordForm />
        <DeleteUserForm />
      </div>
    </AuthenticatedLayout>
  );
}
