import * as SQLite from "expo-sqlite";
import { SCHEMA_STATEMENTS } from "./schema";

let _db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!_db) {
    _db = await SQLite.openDatabaseAsync("trippr.db");
    for (const statement of SCHEMA_STATEMENTS) {
      await _db.execAsync(statement);
    }
  }
  return _db;
}

export async function clearDatabase(): Promise<void> {
  const db = await getDatabase();
  await db.execAsync("DELETE FROM pending_messages;");
  await db.execAsync("DELETE FROM messages;");
  await db.execAsync("DELETE FROM conversations;");
  await db.execAsync("DELETE FROM notifications;");
}
