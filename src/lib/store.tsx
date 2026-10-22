import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { translations, type Dict } from "@/i18n/translations";
import type { Lang } from "@/data/catalog";
import { MARKETS, type MarketCode } from "@/data/config";

export interface CartLine {
  id: string; // slug|color|size
  slug: string;
  color: string;
  size: string;
  qty: number;
}

interface Store {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
  dir: "ltr" | "rtl";
  market: MarketCode;
  marketChosen: boolean;
  setMarket: (m: MarketCode) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  cart: CartLine[];
  addToCart: (l: Omit<CartLine, "id">) => void;
  setQty: (id: string, qty: number) => void;
  removeLine: (id: string) => void;
  cartCount: number;
  hydrated: boolean;
}

const Ctx = createContext<Store | null>(null);
const K = { lang: "artyfam.lang", market: "artyfam.market", theme: "artyfam.theme", cart: "artyfam.cart" };

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");
  const [market, setMarketState] = useState<MarketCode>("TN");
  const [marketChosen, setMarketChosen] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const l = localStorage.getItem(K.lang) as Lang | null;
    if (l && l in translations) setLangState(l);
    const m = localStorage.getItem(K.market) as MarketCode | null;
    if (m && m in MARKETS) setMarketState(m);
    else setMarketChosen(false);
    const th = localStorage.getItem(K.theme);
    if (th === "dark" || th === "light") setTheme(th);
    try {
      const c = JSON.parse(localStorage.getItem(K.cart) || "[]");
      if (Array.isArray(c)) setCart(c);
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(K.cart, JSON.stringify(cart));
  }, [cart, hydrated]);

  const setLang = useCallback((l: Lang) => { setLangState(l); localStorage.setItem(K.lang, l); }, []);
  const setMarket = useCallback((m: MarketCode) => {
    setMarketState(m); setMarketChosen(true); localStorage.setItem(K.market, m);
  }, []);
  const toggleTheme = useCallback(() => setTheme((p) => {
    const n = p === "dark" ? "light" : "dark"; localStorage.setItem(K.theme, n); return n;
  }), []);

  const addToCart = useCallback((l: Omit<CartLine, "id">) => {
    const id = `${l.slug}|${l.color}|${l.size}`;
    setCart((c) => {
      const ex = c.find((x) => x.id === id);
      if (ex) return c.map((x) => (x.id === id ? { ...x, qty: Math.min(99, x.qty + l.qty) } : x));
      return [...c, { ...l, id }];
    });
  }, []);
  const setQty = useCallback((id: string, qty: number) =>
    setCart((c) => c.map((x) => (x.id === id ? { ...x, qty: Math.max(1, Math.min(99, qty)) } : x))), []);
  const removeLine = useCallback((id: string) => setCart((c) => c.filter((x) => x.id !== id)), []);

  const value = useMemo<Store>(() => ({
    lang, setLang, t: translations[lang], dir: lang === "ar" ? "rtl" : "ltr",
    market, marketChosen, setMarket, theme, toggleTheme,
    cart, addToCart, setQty, removeLine, cartCount: cart.reduce((s, l) => s + l.qty, 0), hydrated,
  }), [lang, setLang, market, marketChosen, setMarket, theme, toggleTheme, cart, addToCart, setQty, removeLine, hydrated]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be inside StoreProvider");
  return s;
}
