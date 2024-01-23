export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      page_email_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          page_id: string
          recipient_id: string
          status: string
          updated_at: string
          valid_till: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          page_id: string
          recipient_id: string
          status: string
          updated_at?: string
          valid_till?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          page_id?: string
          recipient_id?: string
          status?: string
          updated_at?: string
          valid_till?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_email_subscribers_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          }
        ]
      }
      page_settings: {
        Row: {
          accent_color: string | null
          app_store_url: string | null
          color_scheme: Database["public"]["Enums"]["page_color_scheme"]
          cover_image: string | null
          created_at: string
          custom_domain: string | null
          email_notifications: boolean
          email_physical_address: string | null
          email_reply_to: string | null
          facebook_url: string | null
          github_url: string | null
          hide_search_engine: boolean
          instagram_url: string | null
          integration_secret_key: string
          linkedin_url: string | null
          page_id: string
          page_logo: string | null
          pinned_post_id: string | null
          play_store_url: string | null
          product_url: string | null
          replace_title_with_logo: boolean | null
          rss_notifications: boolean
          tiktok_url: string | null
          twitter_url: string | null
          updated_at: string
          user_id: string
          whitelabel: boolean
          youtube_url: string | null
        }
        Insert: {
          accent_color?: string | null
          app_store_url?: string | null
          color_scheme?: Database["public"]["Enums"]["page_color_scheme"]
          cover_image?: string | null
          created_at?: string
          custom_domain?: string | null
          email_notifications?: boolean
          email_physical_address?: string | null
          email_reply_to?: string | null
          facebook_url?: string | null
          github_url?: string | null
          hide_search_engine?: boolean
          instagram_url?: string | null
          integration_secret_key?: string
          linkedin_url?: string | null
          page_id: string
          page_logo?: string | null
          pinned_post_id?: string | null
          play_store_url?: string | null
          product_url?: string | null
          replace_title_with_logo?: boolean | null
          rss_notifications?: boolean
          tiktok_url?: string | null
          twitter_url?: string | null
          updated_at?: string
          user_id: string
          whitelabel?: boolean
          youtube_url?: string | null
        }
        Update: {
          accent_color?: string | null
          app_store_url?: string | null
          color_scheme?: Database["public"]["Enums"]["page_color_scheme"]
          cover_image?: string | null
          created_at?: string
          custom_domain?: string | null
          email_notifications?: boolean
          email_physical_address?: string | null
          email_reply_to?: string | null
          facebook_url?: string | null
          github_url?: string | null
          hide_search_engine?: boolean
          instagram_url?: string | null
          integration_secret_key?: string
          linkedin_url?: string | null
          page_id?: string
          page_logo?: string | null
          pinned_post_id?: string | null
          play_store_url?: string | null
          product_url?: string | null
          replace_title_with_logo?: boolean | null
          rss_notifications?: boolean
          tiktok_url?: string | null
          twitter_url?: string | null
          updated_at?: string
          user_id?: string
          whitelabel?: boolean
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "page_settings_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: true
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      page_views: {
        Row: {
          browser: string | null
          created_at: string
          id: string
          os: string | null
          page_id: string
          page_path: string
          referrer: string | null
          user_agent: string | null
          visitor_id: string
        }
        Insert: {
          browser?: string | null
          created_at?: string
          id?: string
          os?: string | null
          page_id: string
          page_path: string
          referrer?: string | null
          user_agent?: string | null
          visitor_id: string
        }
        Update: {
          browser?: string | null
          created_at?: string
          id?: string
          os?: string | null
          page_id?: string
          page_path?: string
          referrer?: string | null
          user_agent?: string | null
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_views_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          }
        ]
      }
      pages: {
        Row: {
          created_at: string
          description: string | null
          id: string
          title: string
          type: Database["public"]["Enums"]["page_type"]
          updated_at: string
          url_slug: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          title: string
          type: Database["public"]["Enums"]["page_type"]
          updated_at?: string
          url_slug?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          title?: string
          type?: Database["public"]["Enums"]["page_type"]
          updated_at?: string
          url_slug?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      post_reactions: {
        Row: {
          created_at: string
          heart: boolean
          id: string
          post_id: string
          rocket: boolean
          sad: boolean
          thumbs_down: boolean
          thumbs_up: boolean
          visitor_id: string
        }
        Insert: {
          created_at?: string
          heart?: boolean
          id?: string
          post_id: string
          rocket?: boolean
          sad?: boolean
          thumbs_down?: boolean
          thumbs_up?: boolean
          visitor_id: string
        }
        Update: {
          created_at?: string
          heart?: boolean
          id?: string
          post_id?: string
          rocket?: boolean
          sad?: boolean
          thumbs_down?: boolean
          thumbs_up?: boolean
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          }
        ]
      }
      posts: {
        Row: {
          allow_reactions: boolean | null
          content: string
          created_at: string
          email_notified: boolean
          id: string
          images_folder: string
          notes: string | null
          page_id: string
          publication_date: string | null
          publish_at: string | null
          status: Database["public"]["Enums"]["post_status"]
          title: string
          type: Database["public"]["Enums"]["post_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          allow_reactions?: boolean | null
          content: string
          created_at?: string
          email_notified?: boolean
          id?: string
          images_folder: string
          notes?: string | null
          page_id: string
          publication_date?: string | null
          publish_at?: string | null
          status: Database["public"]["Enums"]["post_status"]
          title: string
          type: Database["public"]["Enums"]["post_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          allow_reactions?: boolean | null
          content?: string
          created_at?: string
          email_notified?: boolean
          id?: string
          images_folder?: string
          notes?: string | null
          page_id?: string
          publication_date?: string | null
          publish_at?: string | null
          status?: Database["public"]["Enums"]["post_status"]
          title?: string
          type?: Database["public"]["Enums"]["post_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          stripe_customer_id: string | null
          stripe_subscription: Json | null
          stripe_subscription_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          stripe_customer_id?: string | null
          stripe_subscription?: Json | null
          stripe_subscription_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription?: Json | null
          stripe_subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_subscription_active: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      page_view_browsers: {
        Args: {
          pageid: string
          date: string
        }
        Returns: {
          data_name: string
          data_count: number
        }[]
      }
      page_view_os: {
        Args: {
          pageid: string
          date: string
        }
        Returns: {
          data_name: string
          data_count: number
        }[]
      }
      page_view_referrers: {
        Args: {
          pageid: string
          date: string
        }
        Returns: {
          data_name: string
          data_count: number
        }[]
      }
      page_view_stats: {
        Args: {
          pageid: string
          date: string
        }
        Returns: Record<string, unknown>
      }
      post_reactions_aggregate: {
        Args: {
          postid: string
        }
        Returns: {
          thumbs_up_count: number
          thumbs_down_count: number
          rocket_count: number
          sad_count: number
          heart_count: number
        }[]
      }
    }
    Enums: {
      page_color_scheme: "auto" | "dark" | "light"
      page_type: "changelogs" | "updates" | "releases" | "announcements"
      post_status: "draft" | "published" | "archived" | "publish_later"
      post_type: "fix" | "new" | "improvement" | "announcement" | "alert"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
