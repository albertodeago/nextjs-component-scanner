// Helpers to identify specific AST patterns
import type { VariableDeclarator, CallExpression } from "@babel/types";

export const getDynamicImportSource = (
  node: VariableDeclarator,
): string | null => {
  // Check for const Lazy = dynamic(() => import('./foo'))
  // or const Lazy = React.lazy(() => import('./foo'))
  if (
    node.init?.type === "CallExpression" &&
    (node.init.callee?.type === "Identifier" || // dynamic(...)
      node.init.callee?.type === "MemberExpression") // React.lazy(...)
  ) {
    const callee = node.init.callee;
    const isDynamic = callee.type === "Identifier" && callee.name === "dynamic";
    const isReactLazy =
      callee.type === "MemberExpression" &&
      callee.object?.type === "Identifier" &&
      callee.object?.name === "React" &&
      callee.property?.type === "Identifier" &&
      callee.property?.name === "lazy";

    if (isDynamic || isReactLazy) {
      // Traverse the first argument to find import()
      const arg = node.init.arguments?.[0];
      if (arg) {
        const getLocationFromImportCall = (
          n: CallExpression | undefined,
        ): string | null => {
          if (n?.type === "CallExpression" && n.callee?.type === "Import") {
            const firstArg = n.arguments?.[0];
            if (firstArg?.type === "StringLiteral" && firstArg.value) {
              return firstArg.value;
            }
          }
          return null;
        };

        if (
          arg.type === "ArrowFunctionExpression" ||
          arg.type === "FunctionExpression"
        ) {
          if (arg.body?.type === "CallExpression") {
            return getLocationFromImportCall(arg.body as CallExpression);
          } else if (arg.body?.type === "BlockStatement") {
            // () => { return import('./foo') }
            const returnStmt = arg.body.body?.find(
              (stmt) => stmt.type === "ReturnStatement",
            );
            if (returnStmt?.argument?.type === "CallExpression") {
              return getLocationFromImportCall(
                returnStmt.argument as CallExpression,
              );
            }
          }
        }
      }
    }
  }
  return null;
};
