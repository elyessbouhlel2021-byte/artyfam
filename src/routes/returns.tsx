import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { PolicyPage } from "@/components/store/PolicyPage";

export const Route = createFileRoute("/returns")({
  head: () => seo("Retours", "Conditions de retour et d'échange ARTYFAM."),
  component: () => <PolicyPage titleKey="returnsTitle" />,
});
