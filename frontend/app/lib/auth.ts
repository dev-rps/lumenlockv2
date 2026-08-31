/**
 * app/lib/auth.ts
 *
 * Auth helpers: JWT signing/verification + password hashing.
 * Seed users are embedded as constants so they always work on Vercel
 * (no filesystem dependency for pre-seeded accounts).
 */

import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { readJson, appendToArray } from "./storage";

// ─── Config ─────────────────────────────────────────────────────────────────

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "lumenlock_dev_secret_change_in_production_32chars"
);
const COOKIE_NAME = "ll_auth";
const JWT_EXPIRY  = "7d";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AuthUser {
  id:            string;
  name:          string;
  email:         string;
  passwordHash:  string;
  walletAddress: string;
  city:          string;
  role:          "tester" | "user" | "admin";
  joinedAt:      string;
}

export interface JwtPayload {
  sub:   string; // user id
  email: string;
  name:  string;
  role:  string;
}

// ─── Seeded Indian Tester Accounts (always available, even on Vercel) ────────
// Passwords are bcrypt hashed (plain: "Lumen@2026")
// Generated with: bcrypt.hashSync("Lumen@2026", 10)

const SEEDED_USERS: AuthUser[] = [
  { id:"tester_001", name:"Aarav Sharma",    email:"aarav.sharma@gmail.com",    passwordHash:"$2b$10$K8HbxhcBp2iSWBN.HDsxBe4q7Bq2y0JA5H1VHtJlnYmGZaJVP9Ima", walletAddress:"GAARAVSHARMAST3LLARN3TW4LL3TADDR3SS001XXXXXXXXXXXXXXXXXX", city:"Mumbai",     role:"tester", joinedAt:"2026-08-02T09:15:00.000Z" },
  { id:"tester_002", name:"Priya Patel",     email:"priya.patel@gmail.com",     passwordHash:"$2b$10$K8HbxhcBp2iSWBN.HDsxBe4q7Bq2y0JA5H1VHtJlnYmGZaJVP9Ima", walletAddress:"GPRIYAPATELST3LL4RN3TW4LL3TADDR3SS002XXXXXXXXXXXXXXXXXX", city:"Ahmedabad",  role:"tester", joinedAt:"2026-08-03T10:30:00.000Z" },
  { id:"tester_003", name:"Rohan Verma",     email:"rohan.verma@outlook.com",   passwordHash:"$2b$10$K8HbxhcBp2iSWBN.HDsxBe4q7Bq2y0JA5H1VHtJlnYmGZaJVP9Ima", walletAddress:"GROHANVERMASTEL14RN3TW4LL3TADDR3SS003XXXXXXXXXXXXXXXXXX", city:"Delhi",      role:"tester", joinedAt:"2026-08-03T11:00:00.000Z" },
  { id:"tester_004", name:"Ananya Singh",    email:"ananya.singh@gmail.com",    passwordHash:"$2b$10$K8HbxhcBp2iSWBN.HDsxBe4q7Bq2y0JA5H1VHtJlnYmGZaJVP9Ima", walletAddress:"GANANYASINGHST3LL4RN3TW4LL3TADDR3SS004XXXXXXXXXXXXXXXXX", city:"Bangalore",  role:"tester", joinedAt:"2026-08-04T08:45:00.000Z" },
  { id:"tester_005", name:"Vikram Nair",     email:"vikram.nair@yahoo.com",     passwordHash:"$2b$10$K8HbxhcBp2iSWBN.HDsxBe4q7Bq2y0JA5H1VHtJlnYmGZaJVP9Ima", walletAddress:"GVIKRAMNAIRST3LL4RN3TW4LL3TADDR3SS005XXXXXXXXXXXXXXXXXXX", city:"Kochi",      role:"tester", joinedAt:"2026-08-04T14:20:00.000Z" },
  { id:"tester_006", name:"Sneha Gupta",     email:"sneha.gupta@gmail.com",     passwordHash:"$2b$10$K8HbxhcBp2iSWBN.HDsxBe4q7Bq2y0JA5H1VHtJlnYmGZaJVP9Ima", walletAddress:"GSNEHAGUPTAST3LL4RN3TW4LL3TADDR3SS006XXXXXXXXXXXXXXXXXXX", city:"Kolkata",    role:"tester", joinedAt:"2026-08-05T09:00:00.000Z" },
  { id:"tester_007", name:"Arjun Mehta",     email:"arjun.mehta@gmail.com",     passwordHash:"$2b$10$K8HbxhcBp2iSWBN.HDsxBe4q7Bq2y0JA5H1VHtJlnYmGZaJVP9Ima", walletAddress:"GARJUNMEHTAST3LL4RN3TW4LL3TADDR3SS007XXXXXXXXXXXXXXXXXXX", city:"Pune",       role:"tester", joinedAt:"2026-08-05T12:30:00.000Z" },
  { id:"tester_008", name:"Kavya Reddy",     email:"kavya.reddy@gmail.com",     passwordHash:"$2b$10$K8HbxhcBp2iSWBN.HDsxBe4q7Bq2y0JA5H1VHtJlnYmGZaJVP9Ima", walletAddress:"GKAVYAREDDYST3LL4RN3TW4LL3TADDR3SS008XXXXXXXXXXXXXXXXXXX", city:"Hyderabad",  role:"tester", joinedAt:"2026-08-06T10:15:00.000Z" },
  { id:"tester_009", name:"Rahul Joshi",     email:"rahul.joshi@gmail.com",     passwordHash:"$2b$10$K8HbxhcBp2iSWBN.HDsxBe4q7Bq2y0JA5H1VHtJlnYmGZaJVP9Ima", walletAddress:"GRAHULJOSHIST3LL4RN3TW4LL3TADDR3SS009XXXXXXXXXXXXXXXXXXX", city:"Jaipur",     role:"tester", joinedAt:"2026-08-06T15:00:00.000Z" },
  { id:"tester_010", name:"Deepika Agarwal", email:"deepika.agarwal@gmail.com", passwordHash:"$2b$10$K8HbxhcBp2iSWBN.HDsxBe4q7Bq2y0JA5H1VHtJlnYmGZaJVP9Ima", walletAddress:"GDEEPIKAAGRWLST3LL4RN3TW4LL3TADDR3SS010XXXXXXXXXXXXXXXXX", city:"Lucknow",    role:"tester", joinedAt:"2026-08-07T08:30:00.000Z" },
  { id:"tester_011", name:"Kunal Bhatia",    email:"kunal.bhatia@outlook.com",  passwordHash:"$2b$10$K8HbxhcBp2iSWBN.HDsxBe4q7Bq2y0JA5H1VHtJlnYmGZaJVP9Ima", walletAddress:"GKUNALBHATIAST3LL4RN3TW4LL3TADDR3SS011XXXXXXXXXXXXXXXXXX", city:"Chandigarh", role:"tester", joinedAt:"2026-08-07T11:45:00.000Z" },
  { id:"tester_012", name:"Pooja Iyer",      email:"pooja.iyer@gmail.com",      passwordHash:"$2b$10$K8HbxhcBp2iSWBN.HDsxBe4q7Bq2y0JA5H1VHtJlnYmGZaJVP9Ima", walletAddress:"GPOOJAIYER0ST3LL4RN3TW4LL3TADDR3SS012XXXXXXXXXXXXXXXXXXX", city:"Chennai",    role:"tester", joinedAt:"2026-08-08T09:30:00.000Z" },
  { id:"tester_013", name:"Siddharth Kaur",  email:"siddharth.kaur@gmail.com",  passwordHash:"$2b$10$K8HbxhcBp2iSWBN.HDsxBe4q7Bq2y0JA5H1VHtJlnYmGZaJVP9Ima", walletAddress:"GSIDDHARTHKRST3LL4RN3TW4LL3TADDR3SS013XXXXXXXXXXXXXXXXXX", city:"Amritsar",   role:"tester", joinedAt:"2026-08-09T14:00:00.000Z" },
  { id:"tester_014", name:"Riya Tiwari",     email:"riya.tiwari@gmail.com",     passwordHash:"$2b$10$K8HbxhcBp2iSWBN.HDsxBe4q7Bq2y0JA5H1VHtJlnYmGZaJVP9Ima", walletAddress:"GRIYATIWARIST3LL4RN3TW4LL3TADDR3SS014XXXXXXXXXXXXXXXXXXX", city:"Bhopal",     role:"tester", joinedAt:"2026-08-09T16:20:00.000Z" },
  { id:"tester_015", name:"Aditya Kulkarni", email:"aditya.kulkarni@gmail.com", passwordHash:"$2b$10$K8HbxhcBp2iSWBN.HDsxBe4q7Bq2y0JA5H1VHtJlnYmGZaJVP9Ima", walletAddress:"GADITYAKULKRST3LL4RN3TW4LL3TADDR3SS015XXXXXXXXXXXXXXXXXX", city:"Nagpur",     role:"tester", joinedAt:"2026-08-10T10:00:00.000Z" },
];

// ─── User Store (seeded + runtime-added) ─────────────────────────────────────

export async function getAllUsers(): Promise<AuthUser[]> {
  const runtimeUsers = await readJson<AuthUser[]>("users.json", []);
  // Merge: runtime users override seeded ones by email
  const emailSet = new Set(runtimeUsers.map(u => u.email));
  const seeded = SEEDED_USERS.filter(u => !emailSet.has(u.email));
  return [...seeded, ...runtimeUsers];
}

export async function findUserByEmail(email: string): Promise<AuthUser | null> {
  const all = await getAllUsers();
  return all.find(u => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthUser> {
  const existing = await findUserByEmail(data.email);
  if (existing) throw new Error("Email already registered");

  const passwordHash = await bcrypt.hash(data.password, 10);
  const id = `user_${Date.now()}`;
  const user: AuthUser = {
    id,
    name:          data.name,
    email:         data.email,
    passwordHash,
    walletAddress: "",
    city:          "",
    role:          "user",
    joinedAt:      new Date().toISOString(),
  };
  await appendToArray<AuthUser>("users.json", user);
  return user;
}

export async function verifyCredentials(
  email: string,
  password: string
): Promise<AuthUser | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

// ─── JWT ─────────────────────────────────────────────────────────────────────

export async function signJwt(user: AuthUser): Promise<string> {
  return new SignJWT({ email: user.email, name: user.name, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyJwt(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}

export { COOKIE_NAME };
