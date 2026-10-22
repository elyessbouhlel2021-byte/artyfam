import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { PolicyPage } from "@/components/store/PolicyPage";

export const Route = createFileRoute("/terms")({
  head: () => seo("Conditions générales", "Conditions générales de vente ARTYFAM."),
  component: () => <PolicyPage titleKey="termsTitle" />,
});
