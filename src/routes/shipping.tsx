import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { PolicyPage } from "@/components/store/PolicyPage";

export const Route = createFileRoute("/shipping")({
  head: () => seo("Livraison", "Informations de livraison ARTYFAM en Tunisie et en Italie."),
  component: () => <PolicyPage titleKey="shippingTitle" />,
});
