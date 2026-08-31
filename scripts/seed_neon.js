#!/usr/bin/env node
/**
 * seed_neon.js
 * Connects to Neon PostgreSQL, creates table schemas, and populates initial user accounts,
 * feedback submissions, and transaction records.
 *
 * Usage: node scripts/seed_neon.js
 */

const { Client } = require("pg");
const path = require("path");
const fs = require("fs");

const CONNECTION_STRING =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_5pVoARJvdt2b@ep-aged-wildflower-azcaggty-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function main() {
  console.log("\n🚀 Initializing Neon PostgreSQL Database Migration & Seeding...\n");
  console.log(`Connecting to Neon host...`);

  const client = new Client({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log("✅ Connected to Neon PostgreSQL successfully.");

    // 1. Create Schema Tables
    console.log("\n📌 Creating database tables (users, feedback, transactions)...");
    await client.query(`
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
        feature_rating INTEGER NOT NULL,
        ux_rating INTEGER NOT NULL,
        contract_rating INTEGER NOT NULL,
        overall_rating NUMERIC(3, 1) NOT NULL,
        comment TEXT DEFAULT '',
        user_agent TEXT DEFAULT '',
        submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

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
    `);
    console.log("✅ Tables created / verified.");

    // 2. Load Seed Data from frontend/data/
    const dataDir = path.resolve(__dirname, "..", "frontend", "data");
    const usersFile = path.join(dataDir, "users.json");
    const feedbackFile = path.join(dataDir, "feedback.json");

    let seedUsers = [];
    let seedFeedback = [];

    if (fs.existsSync(usersFile)) {
      seedUsers = JSON.parse(fs.readFileSync(usersFile, "utf8"));
    }
    if (fs.existsSync(feedbackFile)) {
      seedFeedback = JSON.parse(fs.readFileSync(feedbackFile, "utf8"));
    }

    // Standard Bcrypt Hash for "Lumen@2026"
    const TESTER_HASH = "$2b$10$ZD2ASpXOwRU42o.1qIETuuPKTBuUpww8YSc6IbFae7gz5YoE4ooJC";

    console.log(`\n📥 Migrating ${seedUsers.length} user accounts into Neon...`);

    for (const u of seedUsers) {
      const hash = u.passwordHash && !u.passwordHash.includes("seed.") ? u.passwordHash : TESTER_HASH;
      await client.query(
        `
        INSERT INTO users (id, name, email, password_hash, wallet_address, city, role, joined_at, tx_count, tx_volume_xlm)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          password_hash = EXCLUDED.password_hash,
          wallet_address = EXCLUDED.wallet_address,
          city = EXCLUDED.city,
          role = EXCLUDED.role,
          tx_count = EXCLUDED.tx_count,
          tx_volume_xlm = EXCLUDED.tx_volume_xlm;
      `,
        [
          u.id,
          u.name,
          u.email.toLowerCase(),
          hash,
          u.walletAddress || "",
          u.city || "",
          u.role || "tester",
          u.joinedAt || new Date().toISOString(),
          u.txCount || 0,
          parseFloat(u.txVolumeXlm || "0"),
        ]
      );

      // Populate transactions if present
      if (Array.isArray(u.transactions)) {
        for (const tx of u.transactions) {
          await client.query(
            `
            INSERT INTO transactions (id, user_id, hash, operation, amount, asset, status, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (id) DO NOTHING;
          `,
            [
              `tx_${tx.hash.slice(0, 16)}`,
              u.id,
              tx.hash,
              tx.operation,
              parseFloat(tx.amount),
              tx.asset,
              tx.status || "success",
              tx.timestamp || new Date().toISOString(),
            ]
          );
        }
      }
    }
    console.log(`✅ Users & transactions migrated successfully.`);

    console.log(`\n📥 Migrating ${seedFeedback.length} feedback entries into Neon...`);
    for (const fb of seedFeedback) {
      await client.query(
        `
        INSERT INTO feedback (id, user_id, name, email, wallet_address, feature_rating, ux_rating, contract_rating, overall_rating, comment, submitted_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO UPDATE SET
          feature_rating = EXCLUDED.feature_rating,
          ux_rating = EXCLUDED.ux_rating,
          contract_rating = EXCLUDED.contract_rating,
          overall_rating = EXCLUDED.overall_rating,
          comment = EXCLUDED.comment;
      `,
        [
          fb.id,
          fb.userId || null,
          fb.name,
          fb.email.toLowerCase(),
          fb.walletAddress || "",
          Math.round(fb.featureRating || 5),
          Math.round(fb.uxRating || 5),
          Math.round(fb.contractRating || 5),
          Math.round(parseFloat(fb.overallRating || 5)),
          fb.comment || "",
          fb.submittedAt || new Date().toISOString(),
        ]
      );
    }
    console.log(`✅ Feedback entries migrated successfully.`);

    // 3. Verification Query
    const userRes = await client.query("SELECT COUNT(*) FROM users;");
    const fbRes = await client.query("SELECT COUNT(*) FROM feedback;");
    const txRes = await client.query("SELECT COUNT(*) FROM transactions;");

    console.log("\n📊 Neon Database Status:");
    console.log(`   - Users Table:        ${userRes.rows[0].count} records`);
    console.log(`   - Feedback Table:     ${fbRes.rows[0].count} records`);
    console.log(`   - Transactions Table: ${txRes.rows[0].count} records`);
    console.log("\n✨ Neon Database Migration Complete!\n");
  } catch (err) {
    console.error("❌ Neon Migration Failed:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
