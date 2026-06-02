import { Creator } from '../../shared/types/creator';

export interface Message {
  id: string;
  content: string;
  room_id: string;
  created_by: string;
  created_at: string;
}

export interface MessageWithCreator {
  id: string;
  content: string;
  room_id: string;
  created_at: string;
  created_by: Creator;
}
