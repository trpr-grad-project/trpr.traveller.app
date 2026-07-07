class UserCache {
  private cache = new Map<string, { firstName: string; lastName: string }>();

  set(userId: string, firstName: string, lastName: string): void {
    this.cache.set(userId, { firstName, lastName });
  }

  get(userId: string): { firstName: string; lastName: string } | null {
    return this.cache.get(userId) ?? null;
  }

  clear(): void {
    this.cache.clear();
  }

  getDisplayName(userId: string): string | null {
    const entry = this.cache.get(userId);
    if (!entry) return null;
    return `${entry.firstName} ${entry.lastName}`.trim() || null;
  }

  has(userId: string): boolean {
    return this.cache.has(userId);
  }

  populateFromUsersList(
    users: Array<{ id: string; firstName: string; lastName: string }>,
  ): void {
    for (const user of users) {
      if (!this.cache.has(user.id)) {
        this.cache.set(user.id, {
          firstName: user.firstName,
          lastName: user.lastName,
        });
      }
    }
  }
}

export const userCache = new UserCache();
