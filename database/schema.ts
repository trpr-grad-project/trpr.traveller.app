export const CREATE_CONVERSATIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT,
    imageUrl TEXT,
    lastMessageId TEXT,
    lastMessageText TEXT,
    lastMessageSenderId TEXT,
    lastMessageSequence TEXT,
    lastMessageSentAt TEXT,
    lastReadSequence TEXT NOT NULL DEFAULT '0',
    unreadCount TEXT NOT NULL DEFAULT '0',
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  );
`;

export const CREATE_MESSAGES_TABLE = `
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY NOT NULL,
    conversationId TEXT NOT NULL,
    sequenceNumber TEXT NOT NULL,
    content TEXT NOT NULL,
    senderUserId TEXT,
    sentAtUtc TEXT NOT NULL,
    FOREIGN KEY (conversationId) REFERENCES conversations(id) ON DELETE CASCADE
  );
`;

export const CREATE_INDEX_CONVERSATION_ID = `
  CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversationId);
`;

export const CREATE_INDEX_SEQUENCE_NUMBER = `
  CREATE INDEX IF NOT EXISTS idx_messages_sequence_number ON messages(sequenceNumber);
`;

export const CREATE_INDEX_CONVERSATION_SEQUENCE = `
  CREATE INDEX IF NOT EXISTS idx_messages_conversation_sequence ON messages(conversationId, sequenceNumber);
`;

export const CREATE_PENDING_MESSAGES_TABLE = `
  CREATE TABLE IF NOT EXISTS pending_messages (
    id TEXT PRIMARY KEY NOT NULL,
    conversationId TEXT NOT NULL,
    content TEXT NOT NULL,
    senderUserId TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    retryCount INTEGER NOT NULL DEFAULT 0,
    lastError TEXT
  );
`;

export const SCHEMA_STATEMENTS = [
  CREATE_CONVERSATIONS_TABLE,
  CREATE_MESSAGES_TABLE,
  CREATE_PENDING_MESSAGES_TABLE,
  CREATE_INDEX_CONVERSATION_ID,
  CREATE_INDEX_SEQUENCE_NUMBER,
  CREATE_INDEX_CONVERSATION_SEQUENCE,
];
