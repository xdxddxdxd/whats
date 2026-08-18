export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      chats: {
        Row: {
          id: string;
          owner_token: string;
          title: string;
          chat_type: 'group' | 'direct';
          total_messages: number;
          total_participants: number;
          first_message_date: string | null;
          last_message_date: string | null;
          last_message_hash: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_token: string;
          title: string;
          chat_type?: 'group' | 'direct';
          total_messages?: number;
          total_participants?: number;
          first_message_date?: string | null;
          last_message_date?: string | null;
          last_message_hash?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_token?: string;
          title?: string;
          chat_type?: 'group' | 'direct';
          total_messages?: number;
          total_participants?: number;
          first_message_date?: string | null;
          last_message_date?: string | null;
          last_message_hash?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      invites: {
        Row: {
          id: string;
          chat_id: string;
          invite_code: string;
          password_pin: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          chat_id: string;
          invite_code: string;
          password_pin: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          chat_id?: string;
          invite_code?: string;
          password_pin?: string;
          created_at?: string;
        };
      };
      guest_sessions: {
        Row: {
          id: string;
          chat_id: string;
          guest_name: string;
          session_token: string;
          is_revoked: boolean;
          created_at: string;
          last_active_at: string;
        };
        Insert: {
          id?: string;
          chat_id: string;
          guest_name: string;
          session_token: string;
          is_revoked?: boolean;
          created_at?: string;
          last_active_at?: string;
        };
        Update: {
          id?: string;
          chat_id?: string;
          guest_name?: string;
          session_token?: string;
          is_revoked?: boolean;
          created_at?: string;
          last_active_at?: string;
        };
      };
      chat_analyses: {
        Row: {
          id: string;
          chat_id: string;
          metrics: Json;
          superlatives: Json;
          wrapped_slides: Json;
          ai_summary: string | null;
          version: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          chat_id: string;
          metrics: Json;
          superlatives: Json;
          wrapped_slides: Json;
          ai_summary?: string | null;
          version?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          chat_id?: string;
          metrics?: Json;
          superlatives?: Json;
          wrapped_slides?: Json;
          ai_summary?: string | null;
          version?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
