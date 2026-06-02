import Boom from '@hapi/boom';
import { pool } from '../../config/database';
import { Room, RoomWithCreator } from './room.types';
import { supabase } from '../../config/supabase';

const getRawRoomById = async (roomId: string): Promise<Room> => {
  const result = await pool.query<Room>(
    'SELECT id, name, created_by, created_at FROM public.rooms WHERE id = $1',
    [roomId]
  );

  if (result.rows.length === 0) {
    throw Boom.notFound('Room not found');
  }

  return result.rows[0];
};

export const getRoomById = async (roomId: string): Promise<RoomWithCreator> => {
  const result = await pool.query<RoomWithCreator>(
    `SELECT r.id, r.name, r.created_at,
      json_build_object(
        'userName', p.full_name,
        'email', p.email
      ) AS created_by
    FROM public.rooms r
    JOIN public.profiles p ON p.id = r.created_by
    WHERE r.id = $1`,
    [roomId]
  );

  if (result.rows.length === 0) {
    throw Boom.notFound('Room not found');
  }

  return result.rows[0];
};

export const getRoomsService = async (): Promise<RoomWithCreator[]> => {
  const result = await pool.query<RoomWithCreator>(
    `SELECT r.id, r.name, r.created_at,
      json_build_object(
        'userName', p.full_name,
        'email', p.email
      ) AS created_by
    FROM public.rooms r
    JOIN public.profiles p ON p.id = r.created_by
    ORDER BY r.created_at DESC`
  );
  return result.rows;
};

const broadcastRoomCreated = async (room: RoomWithCreator) => {
  const channel = supabase.channel('rooms');
  await channel.httpSend('room-created', room);
  supabase.removeChannel(channel);
};

export const createRoomService = async (
  name: string,
  userId: string
): Promise<RoomWithCreator> => {
  const result = await pool.query<RoomWithCreator>(
    `WITH inserted AS (
      INSERT INTO public.rooms (name, created_by)
      VALUES ($1, $2)
      RETURNING id, name, created_by, created_at
    )
    SELECT i.id, i.name, i.created_at,
      json_build_object(
        'userName', p.full_name,
        'email', p.email
      ) AS created_by
    FROM inserted i
    JOIN public.profiles p ON p.id = i.created_by`,
    [name, userId]
  );

  const room = result.rows[0];
  broadcastRoomCreated(room);
  return room;
};

const broadcastRoomDeleted = async (roomId: string) => {
  const channel = supabase.channel(`room:${roomId}`);
  await channel.httpSend('room-deleted', {});
  supabase.removeChannel(channel);

  const globalChannel = supabase.channel('rooms');
  await globalChannel.httpSend('room-deleted', { roomId });
  supabase.removeChannel(globalChannel);
};

export const deleteRoomService = async (
  roomId: string,
  userId: string
): Promise<void> => {
  const room = await getRawRoomById(roomId);

  if (room.created_by !== userId) {
    throw Boom.forbidden('Only the room creator can delete this room');
  }

  await pool.query('DELETE FROM public.rooms WHERE id = $1', [roomId]);

  broadcastRoomDeleted(roomId);
};
