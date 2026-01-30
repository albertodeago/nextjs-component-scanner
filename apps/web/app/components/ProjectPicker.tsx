"use client";

interface ProjectPickerProps {
  onSelect: (handle: FileSystemDirectoryHandle) => void;
  disabled?: boolean;
}

export function ProjectPicker({ onSelect, disabled }: ProjectPickerProps) {
  const handleClick = async () => {
    try {
      const handle = await window.showDirectoryPicker({
        mode: "read",
      });
      onSelect(handle);
    } catch (err) {
      // User cancelled the picker - this is not an error
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      throw err;
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      style={{
        padding: "12px 24px",
        fontSize: "16px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      Select Project Folder
    </button>
  );
}
