import { Card, CardBody } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

// Local component defined in this file
function WelcomeMessage() {
  return <h1>Welcome to the Demo App</h1>;
}

// Another local component
function FeatureList() {
  const features = [
    "Server Components",
    "Client Components",
    "Dynamic Imports",
    "Nested Layouts",
    "Multiple Entry Points",
  ];

  return (
    <ul>
      {features.map((feature) => (
        <li key={feature}>{feature}</li>
      ))}
    </ul>
  );
}

export default function HomePage() {
  return (
    <div>
      <WelcomeMessage />
      <Card title="Features">
        <CardBody>
          <FeatureList />
        </CardBody>
      </Card>
      <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
        <Link href="/dashboard">
          <Button>Go to Dashboard</Button>
        </Link>
        <Link href="/blog">
          <Button variant="secondary">Read Blog</Button>
        </Link>
      </div>
    </div>
  );
}
