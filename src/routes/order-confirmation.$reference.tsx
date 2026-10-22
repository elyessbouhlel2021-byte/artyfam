import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/order-confirmation/$reference")({
  head: () => ({ meta: [{ title: "Confirmation | ARTYFAM" }, { name: "description", content: "Aperçu de confirmation de commande ARTYFAM." }, { property: "og:title", content: "Confirmation | ARTYFAM" }, { property: "og:description", content: "Aperçu de confirmation de commande ARTYFAM." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: Confirmation,
});

function Confirmation() {
  const { t } = useStore();
  const { reference } = Route.useParams();
  return (
    <div className="container-page flex justify-center py-20">
      <div className="max-w-lg rounded-xl border bg-card p-10 text-center shadow-soft">
        <CheckCircle2 className="mx-auto h-12 w-12 text-gold" />
        <h1 className="mt-6 text-4xl">{t.confirmation.title}</h1>
        <p className="mt-4 text-sm text-muted-foreground">{t.confirmation.text}</p>
        <p className="mt-6 eyebrow">{t.confirmation.reference}</p>
        <p className="mt-1 font-mono text-sm" dir="ltr">{reference}</p>
        <Link to="/shop" className="mt-8 inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground">{t.confirmation.back}</Link>
      </div>
    </div>
  );
}
