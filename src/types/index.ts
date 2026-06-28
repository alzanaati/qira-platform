export type UserRole = 'user' | 'teacher' | 'admin';
export type StreamStatus = 'scheduled' | 'live' | 'ended';
export type StreamCategory = 'educational' | 'training' | 'discussion' | 'social' | 'business' | 'entertainment';
export type ParticipantRole = 'host' | 'speaker' | 'viewer';
export type ClapType = 'bronze' | 'silver' | 'gold' | 'diamond';
export type ContentType = 'none' | 'pdf' | 'ppt' | 'image' | 'screen';
export type FileType = 'pdf' | 'ppt' | 'image';
export type SpeakerRequestStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string; email: string; username: string; full_name: string;
  avatar_url?: string; bio?: string; role: UserRole; is_verified: boolean;
  is_active: boolean; created_at: string; updated_at: string;
}
export interface Wallet {
  id: string; user_id: string; balance: number; total_earned: number;
  total_spent: number; created_at: string; updated_at: string;
}
export interface Follow {
  id: string; follower_id: string; following_id: string; created_at: string;
}
export interface LiveStream {
  id: string; user_id: string; title: string; description?: string;
  category: StreamCategory; status: StreamStatus; viewer_count: number;
  clap_count: number; allow_screen_share: boolean; allow_file_share: boolean;
  livekit_room_name?: string; started_at: string; ended_at?: string;
  created_at: string; users?: User;
}
export interface StreamParticipant {
  id: string; stream_id: string; user_id: string; role: ParticipantRole;
  joined_at: string; left_at?: string; users?: User;
}
export interface SpeakerRequest {
  id: string; stream_id: string; user_id: string; status: SpeakerRequestStatus;
  created_at: string; responded_at?: string; users?: User;
}
export interface StreamFile {
  id: string; stream_id: string; uploader_id: string; file_name: string;
  file_url: string; file_type: FileType; file_size: number;
  page_count: number; created_at: string;
}
export interface StreamContentState {
  stream_id: string; content_type: ContentType; file_id?: string;
  current_page: number; zoom_level: number; screen_share_active: boolean;
  screen_share_user_id?: string; updated_at: string; stream_files?: StreamFile;
}
export interface LiveMessage {
  id: string; stream_id: string; user_id: string; content: string;
  message_type: 'text' | 'system' | 'clap'; created_at: string; users?: User;
}
export interface Clap {
  id: string; stream_id: string; sender_id: string; receiver_id: string;
  clap_type: ClapType; amount: number; platform_cut: number; creator_cut: number;
  created_at: string; sender?: User; receiver?: User; stream?: LiveStream;
}
export const CLAP_PRICES: Record<ClapType, number> = { bronze:10, silver:20, gold:50, diamond:100 };
export const CLAP_EMOJIS: Record<ClapType, string> = { bronze:'ð¥', silver:'ð¥', gold:'ð¥', diamond:'ð' };
export const STREAM_CATEGORIES: Record<StreamCategory, string> = {
  educational:'ð ØªØ¹ÙÙÙÙ', training:'ð¯ ØªØ¯Ø±ÙØ¨Ù', discussion:'ð¬ ÙÙØ§Ø´Ù',
  social:'ð Ø§Ø¬ØªÙØ§Ø¹Ù', business:'ð¼ Ø£Ø¹ÙØ§Ù', entertainment:'ð­ ØªØ±ÙÙÙÙ',
};
