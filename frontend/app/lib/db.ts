/**
 * app/lib/db.ts
 *
 * Neon PostgreSQL database client connection and query pool.
 * Supports serverless connection pooling via @neondatabase/serverless or pg.
 */

import { Pool } from "@neondatabase/serverless";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_****************@ep-aged-wildflower-azcaggty-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

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
 * Includes listings and escrows tables for persistent cross-account storage.
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

    CREATE TABLE IF NOT EXISTS listings (
      id VARCHAR(64) PRIMARY KEY,
      seller VARCHAR(255) NOT NULL,
      title VARCHAR(512) NOT NULL,
      description TEXT NOT NULL,
      price VARCHAR(64) NOT NULL,
      raw_price VARCHAR(64) NOT NULL DEFAULT '0',
      asset VARCHAR(255) NOT NULL,
      asset_symbol VARCHAR(10) NOT NULL DEFAULT 'XLM',
      category VARCHAR(100) DEFAULT 'Development',
      milestone_config JSONB DEFAULT NULL,
      status VARCHAR(50) DEFAULT 'Active',
      created_at BIGINT NOT NULL,
      rating NUMERIC(3, 2) DEFAULT 5.0,
      completed_escrows INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS escrows (
      escrow_id VARCHAR(64) PRIMARY KEY,
      listing_id VARCHAR(64) NOT NULL,
      buyer VARCHAR(255) NOT NULL,
      seller VARCHAR(255) NOT NULL,
      asset VARCHAR(255) NOT NULL,
      asset_symbol VARCHAR(10) NOT NULL DEFAULT 'XLM',
      amount VARCHAR(64) NOT NULL,
      raw_amount VARCHAR(64) NOT NULL DEFAULT '0',
      state VARCHAR(50) DEFAULT 'Created',
      buyer_confirmed BOOLEAN DEFAULT FALSE,
      seller_confirmed BOOLEAN DEFAULT FALSE,
      deadline BIGINT NOT NULL,
      created_at BIGINT NOT NULL,
      milestone_percentages JSONB DEFAULT NULL,
      current_milestone_index INTEGER DEFAULT 0,
      released_amount VARCHAR(64) DEFAULT '0',
      raw_released_amount VARCHAR(64) DEFAULT '0',
      is_milestone BOOLEAN DEFAULT FALSE
    );
  `;

  try {
    await query(createTablesSql);
    globalForDb.initialized = true;
    console.log("[NeonDB] Database tables & migrations initialized successfully.");

    // Seed initial listings if the table is empty
    await seedInitialListingsIfEmpty();
    await seedInitialEscrowsIfEmpty();
  } catch (err) {
    console.error("[NeonDB] Table initialization failed:", err);
  }
}

/**
 * Seed initial demo listings into Postgres if the listings table is empty.
 */
async function seedInitialListingsIfEmpty(): Promise<void> {
  try {
    const { rowCount } = await query("SELECT 1 FROM listings LIMIT 1");
    if (rowCount > 0) return; // already seeded

    const now = Math.floor(Date.now() / 1000);
    const seeds = [
      {
        id: "1",
        seller: "GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ",
        title: "Full-Stack Soroban Smart Contract & DApp Architecture",
        description: "Production-ready smart contract audit, custom token economics, Next.js frontend integration, and zero-knowledge privacy modules for decentralized Stellar applications.",
        price: "150",
        rawPrice: "1500000000",
        asset: process.env.NEXT_PUBLIC_XLM_TOKEN_ADDRESS || "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
        assetSymbol: "XLM",
        category: "Development",
        milestoneConfig: JSON.stringify({ percentages: [30, 70], labels: ["Contract Architecture & Tests", "Frontend Deployment & Audit"] }),
        status: "Active",
        createdAt: now - 86400 * 2,
        rating: 4.95,
        completedEscrows: 18,
      },
      {
        id: "2",
        seller: "GB62XNZLHY3Q7KVTU6V7WJLZJ7PVQWY34V7R37M64BYSZ5W42JENFYH",
        title: "Brand Identity, 3D Assets & Design System for Web3",
        description: "Complete design kit including Figma tokens, SVG icons, 3D animated glTF tokens, and light/dark theme design systems tailored for fintech protocols.",
        price: "85",
        rawPrice: "850000000",
        asset: process.env.NEXT_PUBLIC_USDC_TOKEN_ADDRESS || "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA",
        assetSymbol: "USDC",
        category: "Design",
        milestoneConfig: JSON.stringify({ percentages: [50, 50], labels: ["Figma Wireframes & Moodboard", "Final 3D Render & Asset Delivery"] }),
        status: "Active",
        createdAt: now - 86400 * 1,
        rating: 5.0,
        completedEscrows: 9,
      },
      {
        id: "3",
        seller: "GD37NY4GBBJCB7HECZTGPWMTXPQE35RYXI5Q2A42JENFYHGCO6OXKDFH",
        title: "Stellar Consensus & Validator Node Deployment Script",
        description: "Automated Ansible & Docker container scripts to deploy resilient Soroban RPC nodes on AWS and Bare Metal with live Prometheus & Grafana alerting.",
        price: "45",
        rawPrice: "450000000",
        asset: process.env.NEXT_PUBLIC_XLM_TOKEN_ADDRESS || "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
        assetSymbol: "XLM",
        category: "Development",
        milestoneConfig: null,
        status: "Active",
        createdAt: now - 86400 * 3,
        rating: 4.8,
        completedEscrows: 12,
      },
      {
        id: "4",
        seller: "GDBKQ2ACDAVI54RUAI2Q6QJQOBIC7NG2P77WWY27YDYFSZMU64BYSZ5W",
        title: "Comprehensive Smart Contract Security Audit & Formal Verification",
        description: "Thorough vulnerability assessment, CEI pattern validation, storage TTL expiration mitigation, and comprehensive security report.",
        price: "320",
        rawPrice: "3200000000",
        asset: process.env.NEXT_PUBLIC_USDC_TOKEN_ADDRESS || "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA",
        assetSymbol: "USDC",
        category: "Consulting",
        milestoneConfig: JSON.stringify({ percentages: [40, 60], labels: ["Initial Threat Modeling Report", "Final Signed Audit Certificate"] }),
        status: "Active",
        createdAt: now - 86400 * 4,
        rating: 5.0,
        completedEscrows: 34,
      },
    ];

    for (const s of seeds) {
      await query(
        `INSERT INTO listings (id, seller, title, description, price, raw_price, asset, asset_symbol, category, milestone_config, status, created_at, rating, completed_escrows)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
         ON CONFLICT (id) DO NOTHING`,
        [s.id, s.seller, s.title, s.description, s.price, s.rawPrice, s.asset, s.assetSymbol, s.category, s.milestoneConfig, s.status, s.createdAt, s.rating, s.completedEscrows]
      );
    }
    console.log("[NeonDB] Seeded initial listings.");
  } catch (err) {
    console.error("[NeonDB] Seeding listings failed:", err);
  }
}

/**
 * Seed initial demo escrow into Postgres if the escrows table is empty.
 */
async function seedInitialEscrowsIfEmpty(): Promise<void> {
  try {
    const { rowCount } = await query("SELECT 1 FROM escrows LIMIT 1");
    if (rowCount > 0) return;

    const now = Math.floor(Date.now() / 1000);
    await query(
      `INSERT INTO escrows (escrow_id, listing_id, buyer, seller, asset, asset_symbol, amount, raw_amount, state, buyer_confirmed, seller_confirmed, deadline, created_at, milestone_percentages, current_milestone_index, released_amount, raw_released_amount, is_milestone)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
       ON CONFLICT (escrow_id) DO NOTHING`,
      [
        "1", "1",
        "GBV2LUMENLOCKBUYERDEMOACCOUNT77777777777777777777777777777",
        "GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ",
        process.env.NEXT_PUBLIC_XLM_TOKEN_ADDRESS || "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
        "XLM", "150", "1500000000",
        "Funded", false, false,
        now + 604800, now - 3600 * 4,
        JSON.stringify([30, 70]), 0, "0", "0", true,
      ]
    );
    console.log("[NeonDB] Seeded initial escrow.");
  } catch (err) {
    console.error("[NeonDB] Seeding escrows failed:", err);
  }
}
