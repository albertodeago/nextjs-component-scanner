import { Visitor } from "@babel/traverse";
import type { VariableDeclarator } from "@babel/types";
import { ScanContext } from "../types.js";
import { getDynamicImportSource } from "./shared/detect-dynamic-import.js";

/**
 * Visitor to identify dynamic imports (next/dynamic, React.lazy).
 * These are technically variables, but we treat them as imports.
 */
export const createDynamicImportsVisitor = (ctx: ScanContext): Visitor => ({
  VariableDeclarator(path) {
    if (path.node.id.type === "Identifier") {
      // Check for: const Component = dynamic(() => import('./source'))
      // Type cast needed: @babel/traverse and @babel/types have slightly different node types
      const importSource = getDynamicImportSource(
        path.node as VariableDeclarator,
      );

      if (importSource) {
        ctx.exactImports.set(path.node.id.name, {
          source: importSource,
          type: "default",
          importedName: "default",
        });
      }
    }
  },
});
