// Type declarations for File System Access API
interface ShowDirectoryPickerOptions {
  id?: string;
  mode?: "read" | "readwrite";
  startIn?:
    | FileSystemHandle
    | "desktop"
    | "documents"
    | "downloads"
    | "music"
    | "pictures"
    | "videos";
}

interface Window {
  showDirectoryPicker(
    options?: ShowDirectoryPickerOptions
  ): Promise<FileSystemDirectoryHandle>;
}
