import Link from "next/link";
import { Card, CardBody, CardFooter } from "@/components/ui";

// Mock blog posts
const posts = [
  { slug: "hello-world", title: "Hello World", excerpt: "My first blog post", date: "2024-01-01" },
  { slug: "nextjs-tips", title: "Next.js Tips", excerpt: "Useful tips for Next.js", date: "2024-01-15" },
  { slug: "react-patterns", title: "React Patterns", excerpt: "Common React patterns", date: "2024-02-01" },
];

// Server component
function BlogPostCard({ post }: { post: typeof posts[0] }) {
  return (
    <Card>
      <CardBody>
        <h2>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        <p>{post.excerpt}</p>
      </CardBody>
      <CardFooter>
        <small>{post.date}</small>
      </CardFooter>
    </Card>
  );
}

export default function BlogPage() {
  return (
    <div>
      <h1>Blog</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {posts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
