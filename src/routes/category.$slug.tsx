import { createFileRoute, redirect } from "@tanstack/react-router";

// Dedicated category pages are retired. Old links go to the shop; real
// (Supabase) category ids keep their filter, the three legacy static slugs do not.
const LEGACY = new Set(["vetements", "chaussures", "sacs"]);

export const Route = createFileRoute("/category/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/shop",
      search: LEGACY.has(params.slug) ? {} : { cat: params.slug },
      replace: true,
    });
  },
});
