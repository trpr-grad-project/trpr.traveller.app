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
