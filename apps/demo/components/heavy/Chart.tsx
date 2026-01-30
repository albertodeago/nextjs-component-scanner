"use client";

interface ChartProps {
  data: number[];
  title: string;
}

export default function Chart({ data, title }: ChartProps) {
  const max = Math.max(...data);

  return (
    <div style={{ padding: "16px", border: "1px solid #ccc" }}>
      <h3>{title}</h3>
      <div style={{ display: "flex", alignItems: "flex-end", height: "200px", gap: "4px" }}>
        {data.map((value, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${(value / max) * 100}%`,
              background: "#4caf50",
            }}
          />
        ))}
      </div>
    </div>
  );
}
