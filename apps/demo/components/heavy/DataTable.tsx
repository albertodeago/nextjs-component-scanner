"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface Column<T> {
  key: keyof T;
  header: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
}

export default function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const sortedData = sortKey
    ? [...data].sort((a, b) => {
        const aVal = String(a[sortKey]);
        const bVal = String(b[sortKey]);
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      })
    : data;

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={String(col.key)} style={{ textAlign: "left", padding: "8px", borderBottom: "2px solid #ccc" }}>
              <Button variant="secondary" onClick={() => handleSort(col.key)}>
                {col.header} {sortKey === col.key && (sortDir === "asc" ? "▲" : "▼")}
              </Button>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row, i) => (
          <tr key={i}>
            {columns.map((col) => (
              <td key={String(col.key)} style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                {String(row[col.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
