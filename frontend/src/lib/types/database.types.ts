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
      challenges: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          category: string
          points: number
          time_limit: number | null
          creator_id: string
          image_url: string | null
          likes_count: number
          completions_count: number
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          category: string
          points: number
          time_limit?: number | null
          creator_id: string
          image_url?: string | null
          likes_count?: number
          completions_count?: number
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          category?: string
          points?: number
          time_limit?: number | null
          creator_id?: string
          image_url?: string | null
          likes_count?: number
          completions_count?: number
        }
      }
      challenge_completions: {
        Row: {
          id: string
          created_at: string
          challenge_id: string
          user_id: string
          proof_url: string
          status: 'pending' | 'approved' | 'rejected'
          rating: number | null
          reviewer_comment: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          challenge_id: string
          user_id: string
          proof_url: string
          status?: 'pending' | 'approved' | 'rejected'
          rating?: number | null
          reviewer_comment?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          challenge_id?: string
          user_id?: string
          proof_url?: string
          status?: 'pending' | 'approved' | 'rejected'
          rating?: number | null
          reviewer_comment?: string | null
        }
      }
      challenge_likes: {
        Row: {
          id: string
          created_at: string
          challenge_id: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          challenge_id: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          challenge_id?: string
          user_id?: string
        }
      }
      challenge_comments: {
        Row: {
          id: string
          created_at: string
          challenge_id: string
          user_id: string
          content: string
        }
        Insert: {
          id?: string
          created_at?: string
          challenge_id: string
          user_id: string
          content: string
        }
        Update: {
          id?: string
          created_at?: string
          challenge_id?: string
          user_id?: string
          content?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          points: number
          created_at: string
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          points?: number
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          points?: number
          created_at?: string
        }
      }
      user_follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          following_id?: string
          created_at?: string
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
  }
} 