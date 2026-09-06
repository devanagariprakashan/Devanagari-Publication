export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; email: string; role: string; full_name: string | null; phone: string | null; is_active: boolean; created_at: string }
        Insert: { id: string; email: string; role?: string; full_name?: string | null; phone?: string | null; is_active?: boolean; created_at?: string }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      categories: {
        Row: { id: string; name: string; slug: string; description: string | null; image_url: string | null; is_active: boolean; created_at: string }
        Insert: { id: string; name: string; slug: string; description?: string | null; image_url?: string | null; is_active?: boolean; created_at?: string }
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      books: {
        Row: { id: string; slug: string; title: string; hindi_title: string | null; subtitle: string | null; author: string | null; category_id: string | null; isbn: string | null; edition: string | null; language: string | null; exam: string | null; format: string | null; price: number; original_price: number | null; discount_percent: number; rating: number; reviews_count: number; badge: string | null; badge_color: string | null; image_url: string | null; description: string | null; highlights: Json | null; pages: number | null; publication: string | null; binding: string | null; in_stock: boolean; is_bestseller: boolean; is_new_release: boolean; is_featured: boolean; show_in_hero: boolean; is_active: boolean; created_at: string }
        Insert: { id: string; slug: string; title: string; hindi_title?: string | null; subtitle?: string | null; author?: string | null; category_id?: string | null; isbn?: string | null; edition?: string | null; language?: string | null; exam?: string | null; format?: string | null; price: number; original_price?: number | null; discount_percent?: number; rating?: number; reviews_count?: number; badge?: string | null; badge_color?: string | null; image_url?: string | null; description?: string | null; highlights?: Json | null; pages?: number | null; publication?: string | null; binding?: string | null; in_stock?: boolean; is_bestseller?: boolean; is_new_release?: boolean; is_featured?: boolean; show_in_hero?: boolean; is_active?: boolean; created_at?: string }
        Update: Partial<Database['public']['Tables']['books']['Insert']>
      }
      authors: {
        Row: { id: string; name: string; role: string | null; short_role: string | null; bio: string | null; image_url: string | null; is_active: boolean; created_at: string }
        Insert: { id: string; name: string; role?: string | null; short_role?: string | null; bio?: string | null; image_url?: string | null; is_active?: boolean; created_at?: string }
        Update: Partial<Database['public']['Tables']['authors']['Insert']>
      }
      orders: {
        Row: { id: string; order_number: string; customer_name: string | null; customer_email: string | null; customer_phone: string | null; total_amount: number; order_status: string; payment_status: string; created_at: string; cancelled_at: string | null }
        Insert: { id: string; order_number: string; customer_name?: string | null; customer_email?: string | null; customer_phone?: string | null; total_amount: number; order_status?: string; payment_status?: string; created_at?: string; cancelled_at?: string | null }
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
      reviews: {
        Row: { id: string; book_id: string | null; user_id: string | null; rating: number | null; comment: string | null; is_approved: boolean; created_at: string }
        Insert: { id: string; book_id?: string | null; user_id?: string | null; rating?: number | null; comment?: string | null; is_approved?: boolean; created_at?: string }
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
      }
      inquiries: {
        Row: { id: string; name: string; email: string | null; phone: string | null; message: string; status: string; created_at: string }
        Insert: { id: string; name: string; email?: string | null; phone?: string | null; message: string; status?: string; created_at?: string }
        Update: Partial<Database['public']['Tables']['inquiries']['Insert']>
      }
      announcements: {
        Row: { id: string; text: string; is_active: boolean; created_at: string }
        Insert: { id: string; text: string; is_active?: boolean; created_at?: string }
        Update: Partial<Database['public']['Tables']['announcements']['Insert']>
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
