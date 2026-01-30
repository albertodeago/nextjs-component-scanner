import dynamic from "next/dynamic";
import React from "react";

// Dynamic import with type assertion (TSAsExpression)
const TypedDynamic = dynamic(() => import("./typed-component"), {
  ssr: false,
}) as React.ComponentType<{ name: string }>;

// React.lazy with type assertion
const TypedLazy = React.lazy(
  () => import("./typed-lazy-component")
) as React.ComponentType<{ id: number }>;

export const Component = () => (
  <div>
    <TypedDynamic name="test" />
    <TypedLazy id={1} />
  </div>
);
