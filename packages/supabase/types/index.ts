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
    PostgrestVersion: "10.2.0 (e07807d)"
  }
  public: {
    Tables: {
      github_installations: {
        Row: {
          ai_instructions: string | null
          connected_by: string | null
          created_at: string
          enabled: boolean
          id: string
          installation_id: number
          page_id: string
          repository_name: string
          repository_owner: string
          updated_at: string
        }
        Insert: {
          ai_instructions?: string | null
          connected_by?: string | null
          created_at?: string
          enabled?: boolean
          id?: string
          installation_id: number
          page_id: string
          repository_name: string
          repository_owner: string
          updated_at?: string
        }
        Update: {
          ai_instructions?: string | null
          connected_by?: string | null
          created_at?: string
          enabled?: boolean
          id?: string
          installation_id?: number
          page_id?: string
          repository_name?: string
          repository_owner?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "github_installations_connected_by_fkey"
            columns: ["connected_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "github_installations_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      github_post_references: {
        Row: {
          comment_id: number | null
          created_at: string
          generation_count: number
          installation_id: number
          post_id: string
          pr_number: number
          pr_url: string
          repository_name: string
          repository_owner: string
          updated_at: string
        }
        Insert: {
          comment_id?: number | null
          created_at?: string
          generation_count?: number
          installation_id: number
          post_id: string
          pr_number: number
          pr_url: string
          repository_name: string
          repository_owner: string
          updated_at?: string
        }
        Update: {
          comment_id?: number | null
          created_at?: string
          generation_count?: number
          installation_id?: number
          post_id?: string
          pr_number?: number
          pr_url?: string
          repository_name?: string
          repository_owner?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "github_post_references_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: true
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      page_audit_logs: {
        Row: {
          action: string
          actor_id: string
          changes: Json | null
          created_at: string
          id: string
          page_id: string
        }
        Insert: {
          action: string
          actor_id: string
          changes?: Json | null
          created_at?: string
          id?: string
          page_id: string
        }
        Update: {
          action?: string
          actor_id?: string
          changes?: Json | null
          created_at?: string
          id?: string
          page_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_audit_logs_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
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
          },
        ]
      }
      page_settings: {
        Row: {
          accent_color: string | null
          app_store_url: string | null
          color_scheme: Database["public"]["Enums"]["page_color_scheme"]
          cover_image: string | null
          created_at: string
          custom_css: string | null
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
          whitelabel: boolean
          youtube_url: string | null
        }
        Insert: {
          accent_color?: string | null
          app_store_url?: string | null
          color_scheme?: Database["public"]["Enums"]["page_color_scheme"]
          cover_image?: string | null
          created_at?: string
          custom_css?: string | null
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
          whitelabel?: boolean
          youtube_url?: string | null
        }
        Update: {
          accent_color?: string | null
          app_store_url?: string | null
          color_scheme?: Database["public"]["Enums"]["page_color_scheme"]
          cover_image?: string | null
          created_at?: string
          custom_css?: string | null
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
          },
        ]
      }
      page_visitors: {
        Row: {
          created_at: string
          email: string
          email_verified: boolean
          id: string
          updated_at: string
          verification_expires_at: string | null
          verification_token: string | null
        }
        Insert: {
          created_at?: string
          email: string
          email_verified?: boolean
          id?: string
          updated_at?: string
          verification_expires_at?: string | null
          verification_token?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          email_verified?: boolean
          id?: string
          updated_at?: string
          verification_expires_at?: string | null
          verification_token?: string | null
        }
        Relationships: []
      }
      pages: {
        Row: {
          created_at: string
          description: string | null
          id: string
          team_id: string | null
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
          team_id?: string | null
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
          team_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["page_type"]
          updated_at?: string
          url_slug?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pages_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
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
          },
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
          tags: string[]
          title: string
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
          tags?: string[]
          title: string
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
          tags?: string[]
          title?: string
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
        ]
      }
      roadmap_boards: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          page_id: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          page_id: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          page_id?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_boards_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_categories: {
        Row: {
          board_id: string
          color: string | null
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          board_id: string
          color?: string | null
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          board_id?: string
          color?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_categories_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "roadmap_boards"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_columns: {
        Row: {
          board_id: string
          created_at: string
          id: string
          name: string
          position: number
        }
        Insert: {
          board_id: string
          created_at?: string
          id?: string
          name: string
          position: number
        }
        Update: {
          board_id?: string
          created_at?: string
          id?: string
          name?: string
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_columns_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "roadmap_boards"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_items: {
        Row: {
          board_id: string
          category_id: string | null
          column_id: string
          created_at: string
          description: string | null
          id: string
          position: number
          title: string
          updated_at: string
        }
        Insert: {
          board_id: string
          category_id?: string | null
          column_id: string
          created_at?: string
          description?: string | null
          id?: string
          position: number
          title: string
          updated_at?: string
        }
        Update: {
          board_id?: string
          category_id?: string | null
          column_id?: string
          created_at?: string
          description?: string | null
          id?: string
          position?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_items_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "roadmap_boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roadmap_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "roadmap_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roadmap_items_column_id_fkey"
            columns: ["column_id"]
            isOneToOne: false
            referencedRelation: "roadmap_columns"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_triage_items: {
        Row: {
          board_id: string
          created_at: string
          description: string | null
          id: string
          title: string
          updated_at: string
          visitor_id: string
        }
        Insert: {
          board_id: string
          created_at?: string
          description?: string | null
          id?: string
          title: string
          updated_at?: string
          visitor_id: string
        }
        Update: {
          board_id?: string
          created_at?: string
          description?: string | null
          id?: string
          title?: string
          updated_at?: string
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_triage_items_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "roadmap_boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roadmap_triage_items_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "page_visitors"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_votes: {
        Row: {
          created_at: string
          id: string
          item_id: string
          visitor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          visitor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_votes_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "roadmap_items"
            referencedColumns: ["id"]
          },
        ]
      }
      team_invitations: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          inviter_id: string
          role: string
          status: string
          team_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          inviter_id: string
          role: string
          status: string
          team_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          inviter_id?: string
          role?: string
          status?: string
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_invitations_inviter_id_fkey"
            columns: ["inviter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_invitations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          created_at: string
          id: string
          role: string
          team_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          team_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          team_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          id: string
          image: string | null
          metadata: Json | null
          name: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image?: string | null
          metadata?: Json | null
          name: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          pro_gifted: boolean | null
          stripe_customer_id: string | null
          stripe_subscription: Json | null
          stripe_subscription_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          pro_gifted?: boolean | null
          stripe_customer_id?: string | null
          stripe_subscription?: Json | null
          stripe_subscription_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          pro_gifted?: boolean | null
          stripe_customer_id?: string | null
          stripe_subscription?: Json | null
          stripe_subscription_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_pages_with_inactive_subscriptions: {
        Args: never
        Returns: {
          page_created_at: string
          page_id: string
          page_title: string
          url: string
          user_id: string
        }[]
      }
      initialize_roadmap_categories: {
        Args: { board_id: string }
        Returns: undefined
      }
      initialize_roadmap_columns: {
        Args: { board_id: string }
        Returns: undefined
      }
      is_subscription_active: { Args: { user_id: string }; Returns: boolean }
      is_team_member: { Args: { tid: string; uid: string }; Returns: boolean }
      page_view_browsers: {
        Args: { date: string; pageid: string }
        Returns: {
          data_count: number
          data_name: string
        }[]
      }
      page_view_os: {
        Args: { date: string; pageid: string }
        Returns: {
          data_count: number
          data_name: string
        }[]
      }
      page_view_referrers: {
        Args: { date: string; pageid: string }
        Returns: {
          data_count: number
          data_name: string
        }[]
      }
      page_view_stats: {
        Args: { date: string; pageid: string }
        Returns: Record<string, unknown>
      }
      post_reactions_aggregate: {
        Args: { postid: string }
        Returns: {
          heart_count: number
          rocket_count: number
          sad_count: number
          thumbs_down_count: number
          thumbs_up_count: number
        }[]
      }
      update_github_changelog_draft: {
        Args: {
          p_content: string
          p_post_id: string
          p_tags: string[]
          p_title: string
        }
        Returns: number
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      page_color_scheme: ["auto", "dark", "light"],
      page_type: ["changelogs", "updates", "releases", "announcements"],
      post_status: ["draft", "published", "archived", "publish_later"],
      post_type: ["fix", "new", "improvement", "announcement", "alert"],
    },
  },
} as const
