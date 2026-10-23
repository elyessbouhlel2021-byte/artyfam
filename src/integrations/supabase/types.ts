export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          address: string
          country: string
          created_at: string
          first_name: string | null
          id: string
          is_default: boolean
          label: string | null
          last_name: string | null
          phone: string | null
          region: string | null
          user_id: string
        }
        Insert: {
          address: string
          country: string
          created_at?: string
          first_name?: string | null
          id?: string
          is_default?: boolean
          label?: string | null
          last_name?: string | null
          phone?: string | null
          region?: string | null
          user_id: string
        }
        Update: {
          address?: string
          country?: string
          created_at?: string
          first_name?: string | null
          id?: string
          is_default?: boolean
          label?: string | null
          last_name?: string | null
          phone?: string | null
          region?: string | null
          user_id?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          cart_id: string
          created_at: string
          id: string
          qty: number
          variant_id: string
        }
        Insert: {
          cart_id: string
          created_at?: string
          id?: string
          qty: number
          variant_id: string
        }
        Update: {
          cart_id?: string
          created_at?: string
          id?: string
          qty?: number
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          image: string | null
          name: Json
          popular: boolean
          position: number
          slug: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          image?: string | null
          name: Json
          popular?: boolean
          position?: number
          slug: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          image?: string | null
          name?: Json
          popular?: boolean
          position?: number
          slug?: string
          status?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          active: boolean
          code: string
          created_at: string
          currency: string | null
          expires_at: string | null
          kind: string
          min_subtotal: number | null
          starts_at: string | null
          usage_limit: number | null
          used_count: number
          value: number
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          currency?: string | null
          expires_at?: string | null
          kind: string
          min_subtotal?: number | null
          starts_at?: string | null
          usage_limit?: number | null
          used_count?: number
          value: number
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          currency?: string | null
          expires_at?: string | null
          kind?: string
          min_subtotal?: number | null
          starts_at?: string | null
          usage_limit?: number | null
          used_count?: number
          value?: number
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          line_total: number
          order_id: string
          product_name: Json
          qty: number
          sku: string | null
          unit_price: number
          variant_id: string | null
          variant_label: Json | null
        }
        Insert: {
          id?: string
          line_total: number
          order_id: string
          product_name: Json
          qty: number
          sku?: string | null
          unit_price: number
          variant_id?: string | null
          variant_label?: Json | null
        }
        Update: {
          id?: string
          line_total?: number
          order_id?: string
          product_name?: Json
          qty?: number
          sku?: string | null
          unit_price?: number
          variant_id?: string | null
          variant_label?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          coupon_code: string | null
          created_at: string
          currency: string
          discount: number
          email: string | null
          id: string
          idempotency_key: string | null
          market: string
          payment_method: string
          phone: string | null
          reference: string
          shipping: Json
          shipping_fee: number
          status: string
          subtotal: number
          total: number
          user_id: string | null
        }
        Insert: {
          coupon_code?: string | null
          created_at?: string
          currency: string
          discount?: number
          email?: string | null
          id?: string
          idempotency_key?: string | null
          market: string
          payment_method: string
          phone?: string | null
          reference: string
          shipping: Json
          shipping_fee?: number
          status?: string
          subtotal: number
          total: number
          user_id?: string | null
        }
        Update: {
          coupon_code?: string | null
          created_at?: string
          currency?: string
          discount?: number
          email?: string | null
          id?: string
          idempotency_key?: string | null
          market?: string
          payment_method?: string
          phone?: string | null
          reference?: string
          shipping?: Json
          shipping_fee?: number
          status?: string
          subtotal?: number
          total?: number
          user_id?: string | null
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          active: boolean
          description: Json | null
          id: string
          key: string
          market: string
          name: Json
          position: number
        }
        Insert: {
          active?: boolean
          description?: Json | null
          id?: string
          key: string
          market: string
          name: Json
          position?: number
        }
        Update: {
          active?: boolean
          description?: Json | null
          id?: string
          key?: string
          market?: string
          name?: Json
          position?: number
        }
        Relationships: []
      }
      product_images: {
        Row: {
          alt: Json | null
          id: string
          position: number
          product_id: string
          url: string
          variant_id: string | null
        }
        Insert: {
          alt?: Json | null
          id?: string
          position?: number
          product_id: string
          url: string
          variant_id?: string | null
        }
        Update: {
          alt?: Json | null
          id?: string
          position?: number
          product_id?: string
          url?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_option_values: {
        Row: {
          hex: string | null
          id: string
          key: string
          name: Json
          option_id: string
          position: number
        }
        Insert: {
          hex?: string | null
          id?: string
          key: string
          name: Json
          option_id: string
          position?: number
        }
        Update: {
          hex?: string | null
          id?: string
          key?: string
          name?: Json
          option_id?: string
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_option_values_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "product_options"
            referencedColumns: ["id"]
          },
        ]
      }
      product_options: {
        Row: {
          id: string
          key: string
          name: Json
          position: number
          product_id: string
        }
        Insert: {
          id?: string
          key: string
          name: Json
          position?: number
          product_id: string
        }
        Update: {
          id?: string
          key?: string
          name?: Json
          position?: number
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_options_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          active: boolean
          created_at: string
          id: string
          image: string | null
          option_value_ids: string[]
          price_eur: number
          price_tnd: number
          product_id: string
          sale_price_eur: number | null
          sale_price_tnd: number | null
          sku: string | null
          stock: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          image?: string | null
          option_value_ids?: string[]
          price_eur: number
          price_tnd: number
          product_id: string
          sale_price_eur?: number | null
          sale_price_tnd?: number | null
          sku?: string | null
          stock?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          image?: string | null
          option_value_ids?: string[]
          price_eur?: number
          price_tnd?: number
          product_id?: string
          sale_price_eur?: number | null
          sale_price_tnd?: number | null
          sku?: string | null
          stock?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string
          created_at: string
          description: Json
          featured: boolean
          id: string
          name: Json
          promo_label: Json | null
          slug: string
          status: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: Json
          featured?: boolean
          id?: string
          name: Json
          promo_label?: Json | null
          slug: string
          status?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: Json
          featured?: boolean
          id?: string
          name?: Json
          promo_label?: Json | null
          slug?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      shipping_methods: {
        Row: {
          active: boolean
          fee: number
          free_over: number | null
          id: string
          market: string
          name: Json
          position: number
        }
        Insert: {
          active?: boolean
          fee?: number
          free_over?: number | null
          id?: string
          market: string
          name: Json
          position?: number
        }
        Update: {
          active?: boolean
          fee?: number
          free_over?: number | null
          id?: string
          market?: string
          name?: Json
          position?: number
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      place_order: { Args: { payload: Json }; Returns: Json }
      validate_coupon: {
        Args: { _code: string; _market: string; _subtotal: number }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
