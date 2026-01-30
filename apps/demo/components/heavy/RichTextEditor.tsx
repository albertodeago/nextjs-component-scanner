"use client";

import { useState } from "react";

interface RichTextEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
}

export default function RichTextEditor({ initialValue = "", onChange }: RichTextEditorProps) {
  const [content, setContent] = useState(initialValue);

  const handleChange = (value: string) => {
    setContent(value);
    onChange?.(value);
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "8px" }}>
      <div style={{ borderBottom: "1px solid #eee", paddingBottom: "8px", marginBottom: "8px" }}>
        <button onClick={() => handleChange(content + "**bold**")}>B</button>
        <button onClick={() => handleChange(content + "_italic_")}>I</button>
        <button onClick={() => handleChange(content + "[link](url)")}>Link</button>
      </div>
      <textarea
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        style={{ width: "100%", minHeight: "200px", border: "none", resize: "vertical" }}
      />
    </div>
  );
}
