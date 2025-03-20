export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          name: string | null
          avatar_url: string | null
          phone_number: string | null
          country: string | null
          user_type: "jobseeker" | "entrepreneur" | "mentor" | null
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          name?: string | null
          avatar_url?: string | null
          phone_number?: string | null
          country?: string | null
          user_type?: "jobseeker" | "entrepreneur" | "mentor" | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          phone_number?: string | null
          country?: string | null
          user_type?: "jobseeker" | "entrepreneur" | "mentor" | null
        }
      }
      jobs: {
        Row: {
          id: string
          created_at: string
          title: string
          company: string
          logo: string | null
          location: string
          type: string
          category: string
          salary: string | null
          description: string
          featured: boolean
          user_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          company: string
          logo?: string | null
          location: string
          type: string
          category: string
          salary?: string | null
          description: string
          featured?: boolean
          user_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          company?: string
          logo?: string | null
          location?: string
          type?: string
          category?: string
          salary?: string | null
          description?: string
          featured?: boolean
          user_id?: string | null
        }
      }
      courses: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          image: string | null
          category: string
          level: string
          duration: string
          enrolled: number
          isFeatured: boolean
          user_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          image?: string | null
          category: string
          level: string
          duration: string
          enrolled?: number
          isFeatured?: boolean
          user_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          image?: string | null
          category?: string
          level?: string
          duration?: string
          enrolled?: number
          isFeatured?: boolean
          user_id?: string | null
        }
      }
      funding_opportunities: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          image: string | null
          amount: string
          deadline: string
          category: string
          eligibility: string
          provider: string
          applicants: number
          featured: boolean
          user_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          image?: string | null
          amount: string
          deadline: string
          category: string
          eligibility: string
          provider: string
          applicants?: number
          featured?: boolean
          user_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          image?: string | null
          amount?: string
          deadline?: string
          category?: string
          eligibility?: string
          provider?: string
          applicants?: number
          featured?: boolean
          user_id?: string | null
        }
      }
      workshops: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          image: string | null
          date: string
          time: string
          host: string
          hostTitle: string
          attendees: number
          category: string
          recording: boolean
          user_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          image?: string | null
          date: string
          time: string
          host: string
          hostTitle: string
          attendees?: number
          category: string
          recording?: boolean
          user_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          image?: string | null
          date?: string
          time?: string
          host?: string
          hostTitle?: string
          attendees?: number
          category?: string
          recording?: boolean
          user_id?: string | null
        }
      }
      discussions: {
        Row: {
          id: string
          created_at: string
          title: string
          category: string
          author_id: string
          replies: number
          views: number
          likes: number
          last_activity: string
          isPopular: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          category: string
          author_id: string
          replies?: number
          views?: number
          likes?: number
          last_activity?: string
          isPopular?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          category?: string
          author_id?: string
          replies?: number
          views?: number
          likes?: number
          last_activity?: string
          isPopular?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

