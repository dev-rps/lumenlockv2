import { describe, it, expect } from "vitest";
import { verifyCredentials, createUser, findUserByEmail } from "@/app/lib/auth";

describe("Authentication System", () => {
  it("should authenticate demo tester accounts with password Lumen@2026", async () => {
    const user = await verifyCredentials("aarav.sharma@gmail.com", "Lumen@2026");
    expect(user).not.toBeNull();
    expect(user?.name).toBe("Aarav Sharma");
    expect(user?.email).toBe("aarav.sharma@gmail.com");
  });

  it("should authenticate demo accounts regardless of email casing", async () => {
    const user = await verifyCredentials("AARAV.SHARMA@GMAIL.COM", "Lumen@2026");
    expect(user).not.toBeNull();
    expect(user?.name).toBe("Aarav Sharma");
  });

  it("should reject invalid password for demo account", async () => {
    const user = await verifyCredentials("aarav.sharma@gmail.com", "WrongPassword123");
    expect(user).toBeNull();
  });

  it("should allow creating a new user account and logging in", async () => {
    const testEmail = `newuser_${Date.now()}@example.com`;
    const password  = "Secret123Pass!";

    const created = await createUser({
      name: "Test New User",
      email: testEmail,
      password: password,
    });

    expect(created.id).toBeDefined();
    expect(created.email).toBe(testEmail.toLowerCase());

    const found = await findUserByEmail(testEmail);
    expect(found).not.toBeNull();
    expect(found?.name).toBe("Test New User");

    const authed = await verifyCredentials(testEmail, password);
    expect(authed).not.toBeNull();
    expect(authed?.id).toBe(created.id);
  });

  it("should reject duplicate email signup", async () => {
    const testEmail = "aarav.sharma@gmail.com";
    await expect(
      createUser({ name: "Duplicate", email: testEmail, password: "Password123" })
    ).rejects.toThrow("Email already registered");
  });
});
