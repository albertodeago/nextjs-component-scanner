"use client";

import { Button } from "@/components/ui/Button";

interface ShareButtonsProps {
  slug: string;
  title: string;
}

export function ShareButtons({ slug, title }: ShareButtonsProps) {
  const handleShare = (platform: string) => {
    const url = `https://example.com/blog/${slug}`;
    console.log(`Sharing "${title}" on ${platform}: ${url}`);
    alert(`Shared on ${platform}!`);
  };

  return (
    <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
      <Button onClick={() => handleShare("Twitter")}>Share on Twitter</Button>
      <Button onClick={() => handleShare("Facebook")} variant="secondary">
        Share on Facebook
      </Button>
      <Button
        onClick={() => navigator.clipboard.writeText(`https://example.com/blog/${slug}`)}
        variant="secondary"
      >
        Copy Link
      </Button>
    </div>
  );
}
