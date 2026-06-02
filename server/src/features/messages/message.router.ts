import { Router } from 'express';
import { createMessageController, getMessagesController } from './message.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';

export const router = Router({ mergeParams: true });

router.use(authMiddleware);
router.get('/', getMessagesController);
router.post('/', createMessageController);
