"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { Card, CardBody } from "@/components/ui/Card";

// Toggle switch component
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span>{label}</span>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: "48px",
          height: "24px",
          borderRadius: "12px",
          background: checked ? "#4caf50" : "#ccc",
          border: "none",
          cursor: "pointer",
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "2px",
            left: checked ? "26px" : "2px",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "white",
            transition: "left 0.2s",
          }}
        />
      </button>
    </div>
  );
}

// Notification settings group
function NotificationGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardBody>
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>{children}</div>
      </CardBody>
    </Card>
  );
}

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState({
    emailNewsletter: true,
    emailUpdates: false,
    pushNotifications: true,
    pushMarketing: false,
    smsAlerts: false,
  });

  const updateSetting = (key: keyof typeof settings) => (value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <h2>Notification Settings</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <NotificationGroup title="Email Notifications">
          <Toggle label="Newsletter" checked={settings.emailNewsletter} onChange={updateSetting("emailNewsletter")} />
          <Toggle label="Product Updates" checked={settings.emailUpdates} onChange={updateSetting("emailUpdates")} />
        </NotificationGroup>
        <NotificationGroup title="Push Notifications">
          <Toggle label="Enable Push" checked={settings.pushNotifications} onChange={updateSetting("pushNotifications")} />
          <Toggle label="Marketing" checked={settings.pushMarketing} onChange={updateSetting("pushMarketing")} />
        </NotificationGroup>
        <NotificationGroup title="SMS">
          <Toggle label="SMS Alerts" checked={settings.smsAlerts} onChange={updateSetting("smsAlerts")} />
        </NotificationGroup>
        <Button>Save Preferences</Button>
      </div>
    </div>
  );
}
