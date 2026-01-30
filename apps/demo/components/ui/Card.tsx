interface CardProps {
  children: React.ReactNode;
  title?: string;
}

export function Card({ children, title }: CardProps) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "16px", borderRadius: "8px" }}>
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div style={{ borderBottom: "1px solid #eee", paddingBottom: "8px" }}>{children}</div>;
}

export function CardBody({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: "16px 0" }}>{children}</div>;
}

export function CardFooter({ children }: { children: React.ReactNode }) {
  return <div style={{ borderTop: "1px solid #eee", paddingTop: "8px" }}>{children}</div>;
}
