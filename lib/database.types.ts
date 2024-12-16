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
      profiles: {
        Row: {
          id: string
          username: string
          location: string | null
          car: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          location?: string | null
          car?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          location?: string | null
          car?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      groups: {
        Row: {
          id: string
          name: string
          description: string
          destination: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          destination: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          destination?: string
          created_at?: string
        }
      }
      group_members: {
        Row: {
          group_id: string
          user_id: string
          joined_at: string
        }
        Insert: {
          group_id: string
          user_id: string
          joined_at?: string
        }
        Update: {
          group_id?: string
          user_id?: string
          joined_at?: string
        }
      }
      rides: {
        Row: {
          id: string
          driver_id: string
          status: 'driver' | 'passenger' | 'bus'
          departure_location: string
          arrival_location: string
          departure_time: string
          group_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          driver_id: string
          status: 'driver' | 'passenger' | 'bus'
          departure_location: string
          arrival_location: string
          departure_time: string
          group_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          driver_id?: string
          status?: 'driver' | 'passenger' | 'bus'
          departure_location?: string
          arrival_location?: string
          departure_time?: string
          group_id?: string | null
          created_at?: string
        }
      }
    }
  }
}