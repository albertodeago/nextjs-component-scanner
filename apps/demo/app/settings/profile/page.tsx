"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, TextArea } from "@/components/ui/Input";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

// Form component
function ProfileForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile updated:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Input
          label="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <TextArea
          label="Bio"
          rows={4}
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        />
        <Button type="submit">Update Profile</Button>
      </div>
    </form>
  );
}

// Avatar upload component
function AvatarUpload() {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <Card>
      <CardHeader>Profile Picture</CardHeader>
      <CardBody>
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element -- blob URL preview, not optimizable
          <img src={preview} alt="Avatar preview" style={{ width: 100, height: 100, borderRadius: "50%" }} />
        )}
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </CardBody>
    </Card>
  );
}

export default function ProfileSettingsPage() {
  return (
    <div>
      <h2>Profile Settings</h2>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
        <ProfileForm />
        <AvatarUpload />
      </div>
    </div>
  );
}
