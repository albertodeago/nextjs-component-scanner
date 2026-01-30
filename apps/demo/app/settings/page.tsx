"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

// Local client component
function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  return (
    <div>
      <label>Theme: </label>
      <Button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        variant={theme === "dark" ? "secondary" : "primary"}
      >
        {theme === "light" ? "Light" : "Dark"}
      </Button>
    </div>
  );
}

// Another local component
function LanguageSelector() {
  const [language, setLanguage] = useState("en");

  return (
    <div>
      <label>Language: </label>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
      </select>
    </div>
  );
}

export default function GeneralSettingsPage() {
  return (
    <div>
      <h2>General Settings</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <ThemeToggle />
        <LanguageSelector />
        <Input label="Site Name" placeholder="My Website" />
        <Input label="Tagline" placeholder="A great website" />
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
