"use client";

import { Button, IconButton } from "@/components/ui/Button";

interface UserActionsProps {
  userId: number;
}

export function UserActions({ userId }: UserActionsProps) {
  const handleEdit = () => {
    console.log("Edit user", userId);
  };

  const handleDelete = () => {
    if (confirm("Are you sure?")) {
      console.log("Delete user", userId);
    }
  };

  return (
    <div style={{ display: "flex", gap: "4px" }}>
      <Button onClick={handleEdit} variant="secondary">
        Edit
      </Button>
      <IconButton onClick={handleDelete} variant="danger">
        X
      </IconButton>
    </div>
  );
}
