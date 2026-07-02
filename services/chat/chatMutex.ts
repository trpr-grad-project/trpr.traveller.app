/**
 * Lightweight per-key async mutex.
 *
 * Serializes concurrent operations on the same key by chaining promises.
 * Matches the existing promise-chain pattern used in setChatUserId and initializeChat.
 * Zero dependencies — no external mutex/lock library.
 *
 * Usage:
 *   const mutex = new PerKeyMutex();
 *   await mutex.acquire("conversation-123", async () => {
 *     // Only one caller executes this block at a time for key "conversation-123"
 *   });
 */
export class PerKeyMutex {
  private locks = new Map<string, Promise<void>>();

  async acquire(key: string, fn: () => Promise<void>): Promise<void> {
    const prev = this.locks.get(key);
    const current = (async () => {
      if (prev) await prev;
      await fn();
    })();
    this.locks.set(key, current);
    try {
      await current;
    } finally {
      if (this.locks.get(key) === current) {
        this.locks.delete(key);
      }
    }
  }
}
