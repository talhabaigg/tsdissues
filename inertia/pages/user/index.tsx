import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional Theme
import "ag-grid-community/styles/ag-theme-quartz.css";
import "~/css/custom-ag-grid-theme.css"; // Import your custom theme
import { ColDef } from "ag-grid-community";
import AuthenticatedLayout from "~/components/layouts/authenticated-layout";
import { Head, Link } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
interface Role {
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  roles: Role[]; // Changed to roles (array of Role objects)
  created_at: string;
  updated_at: string;
}

interface UserTableProps {
  users: User[];
  roles: any; // Adjust the type of roles based on how you pass them
}

const UsersTable: React.FC<UserTableProps> = ({ users, roles }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setIsDarkMode(savedTheme === "dark");
  }, []);

  const form = useForm({
    id: 0,
    role: "",
  });
  useEffect(() => {
    if (form.data.id !== 0 && form.data.role && form.data.role !== "") {
      // Ensure that the form data includes a valid role
      form.post("update-role");
      toast.success("Role updated successfully");
    }
  }, [form.data.role]); // Only watch for changes to the role

  const handleRoleUpdate = (userId: number, newRole: string) => {
    form.setData({
      id: userId,
      role: newRole,
    });
  };

  const columnDefs: ColDef<User>[] = [
    {
      headerName: "Name",
      field: "name",
      flex: 8,
    },
    {
      headerName: "Email",
      field: "email",
      flex: 8,
    },
    {
      headerName: "Role", // Plural roles
      field: "roles", // Accessing 'roles' as an array
      flex: 8,
      singleClickEdit: true,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: roles.map((role: any) => role.name), // Extract role names
      },

      onCellValueChanged: (params) => {
        const selectedRole = params.newValue; // The role selected from the dropdown
        handleRoleUpdate(params.data.id, selectedRole); // Update the role in the grid
      },
    },
  ];

  const rowData = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    roles: user.roles.length > 0 ? user.roles[0].name : "N/A", // Display 'N/A' if no roles
    created_at: user.created_at,
    updated_at: user.updated_at,
  }));

  return (
    <AuthenticatedLayout>
      <Head title="View Users" />
      <div className="flex justify-end items-center mb-2">
        <Link href="/users/create">
          <Button variant="outline">Add user</Button>
        </Link>
      </div>

      <div
        className={`${isDarkMode ? "ag-theme-quartz-dark" : "ag-theme-quartz"}`}
        style={{ height: 750, width: "100%" }}
      >
        <AgGridReact
          suppressAutoSize={true}
          columnDefs={columnDefs}
          rowData={rowData}
          pagination={false}
          defaultColDef={{
            flex: 4,
            resizable: false, // Allow resizing columns
          }}
        />
      </div>
    </AuthenticatedLayout>
  );
};

export default UsersTable;
