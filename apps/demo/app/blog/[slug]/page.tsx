import Link from "next/link";
import { Card, CardBody } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { ShareButtons } from "./ShareButtons";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Server component for post content
function PostContent({ content }: { content: string }) {
  return (
    <article>
      <p>{content}</p>
    </article>
  );
}

// Server component for author info
function AuthorInfo({ name, bio }: { name: string; bio: string }) {
  return (
    <Card title="About the Author">
      <CardBody>
        <strong>{name}</strong>
        <p>{bio}</p>
      </CardBody>
    </Card>
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  // Mock data based on slug
  const post = {
    title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    content: `This is the content for the blog post "${slug}". Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    author: { name: "John Doe", bio: "A passionate developer and writer." },
  };

  return (
    <div>
      <Link href="/blog">
        <Button variant="secondary">&larr; Back to Blog</Button>
      </Link>
      <h1>{post.title}</h1>
      <PostContent content={post.content} />
      {/* Client component for interactivity */}
      <ShareButtons slug={slug} title={post.title} />
      <div style={{ marginTop: "32px" }}>
        <AuthorInfo name={post.author.name} bio={post.author.bio} />
      </div>
    </div>
  );
}
