/**
 * tests/__mocks__/app/lib/db.ts
 *
 * Vitest mock for the Neon database module.
 * Returns empty rows instantly so auth.ts falls through to its
 * built-in SEEDED_USERS / MEMORY_USERS fallback — no real DB needed in CI.
 */

export const pool = {
  query: async () => ({ rows: [], rowCount: 0 }),
  end: async () => {},
};

export async function query<T = unknown>(): Promise<{ rows: T[]; rowCount: number }> {
  return { rows: [], rowCount: 0 };
}

export async function initDatabase(): Promise<void> {
  // no-op in test environment
}
