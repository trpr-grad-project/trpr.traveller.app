export const CREATE_CONVERSATIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT,
    imageUrl TEXT,
    tripId TEXT,
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

export const MIGRATE_ADD_TRIP_ID = `
  ALTER TABLE conversations ADD COLUMN tripId TEXT;
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

export const CREATE_NOTIFICATIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    sequenceNumber INTEGER NOT NULL
  );
`;

export const CREATE_INDEX_NOTIFICATIONS_SEQUENCE = `
  CREATE INDEX IF NOT EXISTS idx_notifications_sequence ON notifications(sequenceNumber DESC);
`;

export const CREATE_MOCK_CARD_TABLE = `
  CREATE TABLE IF NOT EXISTS mock_card (
    id TEXT PRIMARY KEY NOT NULL,
    userId TEXT NOT NULL,
    cardNumber TEXT NOT NULL,
    cardHolder TEXT NOT NULL,
    expiryDate TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  );
`;

export const CREATE_TRIP_LOCATIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS trip_locations (
    tripId TEXT NOT NULL,
    userId TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    updatedAt INTEGER NOT NULL,
    PRIMARY KEY (tripId, userId)
  );
`;

export const SCHEMA_STATEMENTS = [
  CREATE_CONVERSATIONS_TABLE,
  CREATE_MESSAGES_TABLE,
  CREATE_PENDING_MESSAGES_TABLE,
  CREATE_NOTIFICATIONS_TABLE,
  CREATE_MOCK_CARD_TABLE,
  CREATE_TRIP_LOCATIONS_TABLE,
  CREATE_INDEX_CONVERSATION_ID,
  CREATE_INDEX_SEQUENCE_NUMBER,
  CREATE_INDEX_CONVERSATION_SEQUENCE,
  CREATE_INDEX_NOTIFICATIONS_SEQUENCE,
];

export const MIGRATION_STATEMENTS = [
  MIGRATE_ADD_TRIP_ID,
];
