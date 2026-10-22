import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { PolicyPage } from "@/components/store/PolicyPage";

export const Route = createFileRoute("/privacy")({
  head: () => seo("Confidentialité", "Politique de confidentialité ARTYFAM."),
  component: () => <PolicyPage titleKey="privacyTitle" />,
});
