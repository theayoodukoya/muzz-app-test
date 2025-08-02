import express from 'express';
import { MessageStore } from '../models/Message.js';

const router = express.Router();
const messageStore = new MessageStore();

// Get all messages
router.get('/', (req, res) => {
  res.json(messageStore.getMessages());
});

// Get conversation between two users
router.get('/conversation/:userId1/:userId2', (req, res) => {
  const userId1 = Number.parseInt(req.params.userId1);
  const userId2 = Number.parseInt(req.params.userId2);
  const messages = messageStore.getConversation(userId1, userId2);
  res.json(messages);
});

// Send a message
router.post('/', (req, res) => {
  const { senderId, recipientId, content } = req.body;

  if (!senderId || !recipientId || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const message = messageStore.addMessage({ senderId, recipientId, content });
  res.status(201).json(message);
});

export default router;
