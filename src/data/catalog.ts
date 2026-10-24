// Mock catalog data. Replace with backend queries later.
export type Lang = "fr" | "it" | "ar";
export type L10n = Record<Lang, string>;

export interface Category {
  slug: string;
  name: L10n;
  image: string | null;
  popular?: boolean;
}

export interface ColorVariant {
  key: string;
  hex: string;
  name: L10n;
  images: string[]; // real image URLs uploaded by admin; empty = placeholder
}

export type Availability = "in_stock" | "low" | "out";

export interface Product {
  slug: string;
  name: L10n;
  description: L10n;
  category: string;
  price: { TND: number; EUR: number };
  salePrice?: { TND: number; EUR: number } | undefined;
  promoLabel?: L10n | undefined;
  colors: ColorVariant[];
  sizes: string[];
  availability: Availability;
  createdAt: string;
  featured?: boolean;
}

export interface Banner {
  image: string;
  title: L10n;
  subtitle: L10n;
  ctaHref: string;
}

export interface Promotion {
  active: boolean;
  title: L10n;
  text: L10n;
  href: string;
}

export const categories: Category[] = [
  { slug: "vetements", name: { fr: "Vêtements", it: "Abbigliamento", ar: "ملابس" }, image: null, popular: true },
  { slug: "chaussures", name: { fr: "Chaussures", it: "Scarpe", ar: "أحذية" }, image: null, popular: true },
  { slug: "sacs", name: { fr: "Sacs", it: "Borse", ar: "حقائب" }, image: null, popular: true },
  { slug: "accessoires", name: { fr: "Accessoires", it: "Accessori", ar: "إكسسوارات" }, image: null },
  { slug: "maison", name: { fr: "Maison", it: "Casa", ar: "المنزل" }, image: null },
  { slug: "beaute", name: { fr: "Beauté", it: "Bellezza", ar: "الجمال" }, image: null },
];

const COLORS: Omit<ColorVariant, "images">[] = [
  { key: "noir", hex: "#101211", name: { fr: "Noir", it: "Nero", ar: "أسود" } },
  { key: "sable", hex: "#E7D4BB", name: { fr: "Sable", it: "Sabbia", ar: "رملي" } },
  { key: "olive", hex: "#29281E", name: { fr: "Olive", it: "Oliva", ar: "زيتوني" } },
  { key: "bordeaux", hex: "#48252F", name: { fr: "Bordeaux", it: "Bordeaux", ar: "عنابي" } },
  { key: "camel", hex: "#857861", name: { fr: "Camel", it: "Cammello", ar: "جملي" } },
  { key: "blanc", hex: "#F4F1EA", name: { fr: "Blanc", it: "Bianco", ar: "أبيض" } },
];

const SIZES: Record<string, string[]> = {
  vetements: ["XS", "S", "M", "L", "XL"],
  chaussures: ["36", "37", "38", "39", "40", "41", "42", "43"],
  sacs: [],
  accessoires: ["U"],
  maison: [],
  beaute: ["50 ml", "100 ml"],
};

const BASE: { cat: string; n: L10n }[] = [
  { cat: "vetements", n: { fr: "Chemise en lin", it: "Camicia di lino", ar: "قميص كتان" } },
  { cat: "vetements", n: { fr: "Robe fluide", it: "Abito fluido", ar: "فستان انسيابي" } },
  { cat: "vetements", n: { fr: "Veste structurée", it: "Giacca strutturata", ar: "سترة مهيكلة" } },
  { cat: "vetements", n: { fr: "Pantalon droit", it: "Pantalone dritto", ar: "بنطال مستقيم" } },
  { cat: "vetements", n: { fr: "Pull en maille", it: "Maglione in maglia", ar: "كنزة صوف" } },
  { cat: "vetements", n: { fr: "T-shirt coton", it: "T-shirt in cotone", ar: "تيشيرت قطني" } },
  { cat: "chaussures", n: { fr: "Mocassin cuir", it: "Mocassino in pelle", ar: "حذاء جلدي" } },
  { cat: "chaussures", n: { fr: "Sneaker minimal", it: "Sneaker minimal", ar: "حذاء رياضي بسيط" } },
  { cat: "chaussures", n: { fr: "Sandale tressée", it: "Sandalo intrecciato", ar: "صندل مضفور" } },
  { cat: "chaussures", n: { fr: "Bottine daim", it: "Stivaletto scamosciato", ar: "حذاء جلد مدبوغ" } },
  { cat: "sacs", n: { fr: "Cabas en toile", it: "Shopper in tela", ar: "حقيبة قماشية" } },
  { cat: "sacs", n: { fr: "Sac bandoulière", it: "Borsa a tracolla", ar: "حقيبة كتف" } },
  { cat: "sacs", n: { fr: "Pochette soirée", it: "Pochette da sera", ar: "حقيبة سهرة" } },
  { cat: "sacs", n: { fr: "Sac à dos urbain", it: "Zaino urbano", ar: "حقيبة ظهر" } },
  { cat: "accessoires", n: { fr: "Ceinture cuir", it: "Cintura in pelle", ar: "حزام جلدي" } },
  { cat: "accessoires", n: { fr: "Foulard soie", it: "Foulard di seta", ar: "وشاح حرير" } },
  { cat: "accessoires", n: { fr: "Lunettes de soleil", it: "Occhiali da sole", ar: "نظارات شمسية" } },
  { cat: "accessoires", n: { fr: "Portefeuille", it: "Portafoglio", ar: "محفظة" } },
  { cat: "maison", n: { fr: "Bougie parfumée", it: "Candela profumata", ar: "شمعة معطرة" } },
  { cat: "maison", n: { fr: "Plaid en laine", it: "Plaid in lana", ar: "بطانية صوف" } },
  { cat: "maison", n: { fr: "Vase céramique", it: "Vaso in ceramica", ar: "مزهرية خزفية" } },
  { cat: "maison", n: { fr: "Coussin brodé", it: "Cuscino ricamato", ar: "وسادة مطرزة" } },
  { cat: "beaute", n: { fr: "Eau de parfum", it: "Eau de parfum", ar: "عطر" } },
  { cat: "beaute", n: { fr: "Huile corporelle", it: "Olio corpo", ar: "زيت الجسم" } },
  { cat: "beaute", n: { fr: "Crème mains", it: "Crema mani", ar: "كريم اليدين" } },
  { cat: "vetements", n: { fr: "Blazer oversize", it: "Blazer oversize", ar: "بليزر واسع" } },
  { cat: "vetements", n: { fr: "Jupe plissée", it: "Gonna plissettata", ar: "تنورة مطوية" } },
  { cat: "chaussures", n: { fr: "Escarpin", it: "Décolleté", ar: "حذاء كعب" } },
  { cat: "sacs", n: { fr: "Mini sac", it: "Mini borsa", ar: "حقيبة صغيرة" } },
  { cat: "accessoires", n: { fr: "Bracelet doré", it: "Bracciale dorato", ar: "سوار ذهبي" } },
  { cat: "maison", n: { fr: "Plateau en bois", it: "Vassoio in legno", ar: "صينية خشبية" } },
  { cat: "beaute", n: { fr: "Brume cheveux", it: "Bruma capelli", ar: "رذاذ الشعر" } },
];

const slugify = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function buildProducts(): Product[] {
  return BASE.map((b, i) => {
    const tnd = 45 + ((i * 37) % 260);
    const eur = Math.round((tnd / 3.3) * 10) / 10 + 0.9;
    const onSale = i % 5 === 1;
    const colorCount = 2 + (i % 3);
    const colors = Array.from({ length: colorCount }, (_, k) => ({
      ...COLORS[(i + k) % COLORS.length]!,
      images: [] as string[],
    }));
    const day = String(28 - (i % 28)).padStart(2, "0");
    const month = i < 10 ? "10" : i < 22 ? "09" : "08";
    return {
      slug: slugify(b.n.fr) + "-" + (i + 1),
      name: b.n,
      category: b.cat,
      description: {
        fr: `${b.n.fr} conçu avec soin, aux finitions soignées et aux lignes intemporelles. Description à remplacer par le texte réel du produit.`,
        it: `${b.n.it} realizzato con cura, finiture accurate e linee senza tempo. Descrizione da sostituire con il testo reale del prodotto.`,
        ar: `${b.n.ar} مصمم بعناية بلمسات راقية وخطوط خالدة. وصف مؤقت يُستبدل بالنص الحقيقي للمنتج.`,
      },
      price: { TND: tnd, EUR: eur },
      salePrice: onSale ? { TND: Math.round(tnd * 0.8), EUR: Math.round(eur * 0.8 * 10) / 10 } : undefined,
      promoLabel: onSale ? { fr: "-20%", it: "-20%", ar: "-20%" } : undefined,
      colors,
      sizes: SIZES[b.cat] ?? [],
      availability: i % 11 === 4 ? "out" : i % 7 === 3 ? "low" : "in_stock",
      createdAt: `2026-${month}-${day}`,
      featured: i % 6 === 0,
    } satisfies Product;
  });
}

export const products: Product[] = buildProducts();

// Admin-managed hero banners. Empty array = the banner section is hidden.
export const banners: Banner[] = [];

export const promotions: Promotion[] = [
  {
    active: true,
    title: { fr: "Sélection de saison", it: "Selezione di stagione", ar: "تشكيلة الموسم" },
    text: {
      fr: "Jusqu'à -20% sur une sélection d'articles, dans la limite des stocks disponibles.",
      it: "Fino al -20% su una selezione di articoli, fino a esaurimento scorte.",
      ar: "خصم يصل إلى 20% على تشكيلة مختارة، في حدود الكمية المتوفرة.",
    },
    href: "/shop?promo=1",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const ALL_SIZES = Array.from(new Set(products.flatMap((p) => p.sizes)));
export const ALL_COLORS = COLORS;
