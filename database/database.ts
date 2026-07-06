import * as SQLite from "expo-sqlite";
import { MIGRATION_STATEMENTS, SCHEMA_STATEMENTS } from "./schema";

let _db: SQLite.SQLiteDatabase | null = null;
let _currentUserId: string | null = null;

export function setDatabaseUser(userId: string | null): void {
  if (_currentUserId === userId) return;
  if (_db) {
    _db.closeAsync();
    _db = null;
  }
  _currentUserId = userId;
}

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!_db) {
    const name = _currentUserId ? `trippr_${_currentUserId}.db` : "trippr.db";
    _db = await SQLite.openDatabaseAsync(name);
    for (const statement of SCHEMA_STATEMENTS) {
      await _db.execAsync(statement);
    }
    for (const statement of MIGRATION_STATEMENTS) {
      try { await _db.execAsync(statement); } catch { /* already migrated */ }
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


