/**
 * app/lib/db.ts
 *
 * Neon PostgreSQL database client connection and query pool.
 * Supports serverless connection pooling via @neondatabase/serverless or pg.
 */

import { Pool } from "@neondatabase/serverless";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_5pVoARJvdt2b@ep-aged-wildflower-azcaggty-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

// Global singleton pool to prevent connection exhaustion in serverless Next.js route handlers
const globalForDb = globalThis as unknown as {
  pool: Pool | undefined;
  initialized: boolean | undefined;
};

export const pool =
  globalForDb.pool ??
  new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = pool;
}

/**
 * Execute a parameterised SQL query against Neon Postgres.
 */
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<{ rows: T[]; rowCount: number }> {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === "development") {
      console.log(`[NeonDB Query] ${text.slice(0, 80)}... executed in ${duration}ms (${res.rowCount} rows)`);
    }
    return { rows: res.rows as T[], rowCount: res.rowCount ?? 0 };
  } catch (error) {
    console.error("[NeonDB Error]", error);
    throw error;
  }
}

/**
 * Auto-initialize and migrate database tables if they do not exist.
 */
export async function initDatabase(): Promise<void> {
  if (globalForDb.initialized) return;

  const createTablesSql = `
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      wallet_address VARCHAR(255) DEFAULT '',
      city VARCHAR(255) DEFAULT '',
      role VARCHAR(50) DEFAULT 'user',
      joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      tx_count INTEGER DEFAULT 0,
      tx_volume_xlm NUMERIC(14, 2) DEFAULT 0.00
    );

    CREATE TABLE IF NOT EXISTS feedback (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      wallet_address VARCHAR(255) DEFAULT '',
      network VARCHAR(100) DEFAULT 'Stellar Testnet',
      bugs_reported TEXT DEFAULT 'N/A',
      improvements TEXT DEFAULT '',
      recommend VARCHAR(20) DEFAULT 'Yes',
      overall_rating NUMERIC(3, 1) NOT NULL DEFAULT 5,
      feature_rating INTEGER DEFAULT 5,
      ux_rating INTEGER DEFAULT 5,
      contract_rating INTEGER DEFAULT 5,
      comment TEXT DEFAULT '',
      user_agent TEXT DEFAULT '',
      submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    ALTER TABLE feedback ADD COLUMN IF NOT EXISTS network VARCHAR(100) DEFAULT 'Stellar Testnet';
    ALTER TABLE feedback ADD COLUMN IF NOT EXISTS bugs_reported TEXT DEFAULT 'N/A';
    ALTER TABLE feedback ADD COLUMN IF NOT EXISTS improvements TEXT DEFAULT '';
    ALTER TABLE feedback ADD COLUMN IF NOT EXISTS recommend VARCHAR(20) DEFAULT 'Yes';

    CREATE TABLE IF NOT EXISTS transactions (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
      hash VARCHAR(128) NOT NULL,
      operation VARCHAR(100) NOT NULL,
      amount NUMERIC(16, 7) NOT NULL,
      asset VARCHAR(20) NOT NULL,
      status VARCHAR(50) DEFAULT 'success',
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await query(createTablesSql);
    globalForDb.initialized = true;
    console.log("[NeonDB] Database tables & migrations initialized successfully.");
  } catch (err) {
    console.error("[NeonDB] Table initialization failed:", err);
  }
}
