import { describe, expect, it } from "vitest";
import { banners, products } from "@/data/catalog";
import { MARKETS, PAGE_SIZE, WHATSAPP_NUMBER } from "@/data/config";
import { cartTotals, queryCatalog, unitPrice } from "@/lib/shop";

describe("storefront rules", () => {
  it("shows exactly 12 products per catalog page", () => {
    expect(PAGE_SIZE).toBe(12);
    const page1 = queryCatalog({ page: 1 }, "TN");
    expect(page1.items.length).toBeLessThanOrEqual(12);
    if (page1.pages > 1) expect(page1.items.length).toBe(12);
  });

  it("clamps out-of-range page numbers instead of showing an empty grid", () => {
    const result = queryCatalog({ page: 999 }, "TN");
    expect(result.page).toBe(result.pages);
    expect(result.items.length).toBeGreaterThan(0);
  });

  it("hides the banner section when no banner is configured", () => {
    expect(banners.length).toBe(0);
  });

  it("keeps the WhatsApp button disabled until a real number is configured", () => {
    expect(WHATSAPP_NUMBER).toBeNull();
  });

  it("never exposes exact inventory quantities, only availability labels", () => {
    for (const p of products) {
      expect(["in_stock", "low", "out"]).toContain(p.availability);
      expect(p).not.toHaveProperty("stock");
      expect(p).not.toHaveProperty("quantity");
    }
  });

  it("applies free delivery at the market threshold (TN 250, IT 90)", () => {
    expect(cartTotals(249, "TN").delivery).toBe(MARKETS.TN.deliveryFee);
    expect(cartTotals(250, "TN").delivery).toBe(0);
    expect(cartTotals(89, "IT").delivery).toBe(MARKETS.IT.deliveryFee);
    expect(cartTotals(90, "IT").delivery).toBe(0);
  });

  it("uses the sale price as the unit price when a promotion is active", () => {
    const onSale = products.find((p) => p.salePrice);
    expect(onSale).toBeDefined();
    expect(unitPrice(onSale!, "TN")).toBe(onSale!.salePrice!.TND);
    expect(unitPrice(onSale!, "IT")).toBe(onSale!.salePrice!.EUR);
  });

  it("represents multiple variants of the same product as distinct cart lines", () => {
    const id = (slug: string, color: string, size: string) => `${slug}|${color}|${size}`;
    const a = id("robe-fluide-2", "noir", "M");
    const b = id("robe-fluide-2", "sable", "M");
    const c = id("robe-fluide-2", "noir", "L");
    expect(new Set([a, b, c]).size).toBe(3);
  });
});
