export type UnitPref = "kg" | "lbs";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          height_cm: number | null;
          goal_weight: number | null;
          unit_pref: UnitPref;
          accent_color: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          height_cm?: number | null;
          goal_weight?: number | null;
          unit_pref?: UnitPref;
          accent_color?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          height_cm?: number | null;
          goal_weight?: number | null;
          unit_pref?: UnitPref;
          accent_color?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      weight_entries: {
        Row: {
          id: string;
          user_id: string;
          weight: number;
          logged_at: string;
          note: string | null;
          body_fat: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          weight: number;
          logged_at?: string;
          note?: string | null;
          body_fat?: number | null;
          created_at?: string;
        };
        Update: {
          weight?: number;
          logged_at?: string;
          note?: string | null;
          body_fat?: number | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type WeightEntry = Database["public"]["Tables"]["weight_entries"]["Row"];
export type WeightEntryInsert = Database["public"]["Tables"]["weight_entries"]["Insert"];
