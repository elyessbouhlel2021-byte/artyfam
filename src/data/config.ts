// Mock storefront configuration. Replace with backend settings later.
export type MarketCode = "TN" | "IT";
export type Currency = "TND" | "EUR";

export interface MarketConfig {
  code: MarketCode;
  currency: Currency;
  deliveryFee: number;
  freeDeliveryThreshold: number | null;
  regions: string[];
}

export const MARKETS: Record<MarketCode, MarketConfig> = {
  TN: {
    code: "TN",
    currency: "TND",
    deliveryFee: 8,
    freeDeliveryThreshold: 250,
    regions: [
      "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Bizerte", "Sousse",
      "Monastir", "Mahdia", "Sfax", "Kairouan", "Gabès", "Médenine", "Gafsa", "Béja", "Jendouba",
    ],
  },
  IT: {
    code: "IT",
    currency: "EUR",
    deliveryFee: 6.9,
    freeDeliveryThreshold: 90,
    regions: [
      "Milano", "Roma", "Torino", "Napoli", "Firenze", "Bologna", "Venezia", "Genova",
      "Palermo", "Bari", "Verona", "Brescia",
    ],
  },
};

/**
 * Official logo. Place the original ARTYFAM logo file at
 * public/brand/artyfam-logo.png and set this to "/brand/artyfam-logo.png".
 * While null, a neutral text wordmark is shown instead.
 */
export const LOGO_URL: string | null = null;

/** WhatsApp number in international format (e.g. "216XXXXXXXX"). Null = button disabled. */
export const WHATSAPP_NUMBER: string | null = null;

export const CONTACT = {
  email: null as string | null,
  phone: null as string | null,
  address: null as string | null,
};

export const PAGE_SIZE = 12;
