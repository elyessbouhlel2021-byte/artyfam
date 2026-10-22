import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/store/bits";

export const Route = createFileRoute("/faq")({
  head: () => seo("FAQ", "Questions fréquentes sur la livraison, le paiement et les retours ARTYFAM."),
  component: Faq,
});

function Faq() {
  const { t } = useStore();
  return (
    <>
      <PageHeader title={t.pages.faqTitle} />
      <div className="container-page max-w-3xl space-y-3 py-12">
        {t.pages.faq.map(([q, a]) => (
          <details key={q} className="rounded-lg border bg-card p-5">
            <summary className="cursor-pointer font-medium">{q}</summary>
            <p className="mt-3 text-sm text-muted-foreground">{a}</p>
          </details>
        ))}
      </div>
    </>
  );
}
