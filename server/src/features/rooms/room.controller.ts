import { Request, Response } from 'express';
import Boom from '@hapi/boom';
import { createRoomService, deleteRoomService, getRoomsService, getRoomById } from './room.service';
import { getUserFromRequest } from '../../middlewares/authMiddleware';

export const getRoomsController = async (_req: Request, res: Response) => {
  const rooms = await getRoomsService();
  return res.json(rooms);
};

export const getRoomByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const room = await getRoomById(String(id));
  return res.json(room);
};

export const createRoomController = async (req: Request, res: Response) => {
  const { name } = req.body;
  const { id: userId } = getUserFromRequest(req);

  if (!name) {
    throw Boom.badRequest('Room name is required');
  }

  const room = await createRoomService(name, userId);
  return res.status(201).json(room);
};

export const deleteRoomController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { id: userId } = getUserFromRequest(req);

  await deleteRoomService(String(id), userId);
  return res.status(204).send();
};
