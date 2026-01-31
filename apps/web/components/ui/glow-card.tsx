"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function GlowCard({ className, children, ...props }: React.ComponentProps<"div">) {
  const cardRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--glow-x", `${x}px`);
    cardRef.current.style.setProperty("--glow-y", `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      data-slot="card"
      onMouseMove={handleMouseMove}
      className={cn(
        "glow-card bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-border py-6 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { GlowCard };
