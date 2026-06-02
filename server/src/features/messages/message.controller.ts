import { Request, Response } from 'express';
import Boom from '@hapi/boom';
import { createMessageService, getMessagesService } from './message.service';
import { getUserFromRequest } from '../../middlewares/authMiddleware';

export const createMessageController = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const { content } = req.body;
  const { id: userId } = getUserFromRequest(req);

  if (!content) {
    throw Boom.badRequest('Message content is required');
  }

  const message = await createMessageService(String(roomId), content, userId);
  return res.status(201).json(message);
};

export const getMessagesController = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const messages = await getMessagesService(String(roomId));
  return res.json(messages);
};
