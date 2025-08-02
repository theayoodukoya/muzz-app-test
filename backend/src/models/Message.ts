export interface Message {
  id: number;
  senderId: number;
  recipientId: number;
  content: string;
  timestamp: string;
}

export interface MessageInput {
  senderId: number;
  recipientId: number;
  content: string;
}

export class MessageStore {
  private messages: Message[] = [];
  private nextId = 1;

  addMessage(input: MessageInput): Message {
    const message: Message = {
      id: this.nextId++,
      senderId: input.senderId,
      recipientId: input.recipientId,
      content: input.content,
      timestamp: new Date().toISOString(),
    };
    this.messages.push(message);
    return message;
  }

  getMessages(): Message[] {
    return this.messages;
  }

  getConversation(userId1: number, userId2: number): Message[] {
    return this.messages.filter(
      (msg) =>
        (msg.senderId === userId1 && msg.recipientId === userId2) ||
        (msg.senderId === userId2 && msg.recipientId === userId1)
    );
  }
}
