export function reportRuntimeError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  console.error("[runtime error]", error, {
    route: window.location.pathname,
    ...context,
  });
}
