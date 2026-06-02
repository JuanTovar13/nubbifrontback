import { Creator } from '../../shared/types/creator';

export type { Creator };

export interface Room {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
}

export interface RoomWithCreator {
  id: string;
  name: string;
  created_at: string;
  created_by: Creator;
}

