import { Header } from "@/components/layout";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Demo App",
  description: "Testing Next.js Component Scanner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1, padding: "16px" }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
