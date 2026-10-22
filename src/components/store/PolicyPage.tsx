import { useStore } from "@/lib/store";
import type { Dict } from "@/i18n/translations";
import { PageHeader } from "./bits";

type TitleKey = "shippingTitle" | "returnsTitle" | "privacyTitle" | "termsTitle";

export function PolicyPage({ titleKey }: { titleKey: TitleKey }) {
  const { t } = useStore();
  const title = (t.pages as Dict["pages"])[titleKey];
  return (
    <>
      <PageHeader title={title} />
      <article className="container-page max-w-3xl py-12">
        <p className="rounded-md border border-dashed bg-surface p-5 text-muted-foreground">{t.pages.policyPlaceholder}</p>
      </article>
    </>
  );
}
