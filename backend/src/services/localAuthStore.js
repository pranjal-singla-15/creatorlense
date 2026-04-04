import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storePath = path.join(__dirname, "..", "data", "localUsers.json");

async function ensureStore() {
  await fs.mkdir(path.dirname(storePath), { recursive: true });

  try {
    await fs.access(storePath);
  } catch (_error) {
    await fs.writeFile(storePath, "[]", "utf8");
  }
}

async function readUsers() {
  await ensureStore();
  const raw = await fs.readFile(storePath, "utf8");

  try {
    const users = JSON.parse(raw);
    return Array.isArray(users) ? users : [];
  } catch (_error) {
    return [];
  }
}

async function writeUsers(users) {
  await ensureStore();
  await fs.writeFile(storePath, JSON.stringify(users, null, 2), "utf8");
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function buildLocalUserRecord(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    passwordHash: user.passwordHash,
    brandName: user.brandName || "",
    brandDescription: user.brandDescription || "",
    brandWebsite: user.brandWebsite || "",
    brandIndustry: user.brandIndustry || "",
    brandLocation: user.brandLocation || "",
    brandProfileCompleted: Boolean(user.brandProfileCompleted),
    createdAt: user.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function serializeLocalUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    brandName: user.brandName || "",
    brandDescription: user.brandDescription || "",
    brandWebsite: user.brandWebsite || "",
    brandIndustry: user.brandIndustry || "",
    brandLocation: user.brandLocation || "",
    brandProfileCompleted: Boolean(user.brandProfileCompleted),
  };
}

export function serializeLocalAuthUser(user) {
  return serializeLocalUser(user);
}

export async function findLocalUserByEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  const users = await readUsers();
  return users.find((user) => user.email === normalizedEmail) || null;
}

export async function findLocalUserById(userId) {
  const users = await readUsers();
  return users.find((user) => user._id === userId) || null;
}

export async function verifyLocalPassword(user, enteredPassword) {
  if (!user?.passwordHash) {
    return false;
  }

  return bcrypt.compare(enteredPassword, user.passwordHash);
}

export async function createLocalUser({ name, email, password }) {
  const normalizedEmail = normalizeEmail(email);
  const users = await readUsers();
  const existingUser = users.find((user) => user.email === normalizedEmail);

  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  const now = new Date().toISOString();
  const record = buildLocalUserRecord({
    _id: randomUUID(),
    name: String(name || normalizedEmail.split("@")[0] || "User").trim(),
    email: normalizedEmail,
    passwordHash: await bcrypt.hash(password, 10),
    createdAt: now,
    updatedAt: now,
  });

  users.push(record);
  await writeUsers(users);
  return record;
}

export async function updateLocalUser(userId, updates) {
  const users = await readUsers();
  const index = users.findIndex((user) => user._id === userId);

  if (index === -1) {
    return null;
  }

  users[index] = buildLocalUserRecord({
    ...users[index],
    ...updates,
    _id: users[index]._id,
    email: users[index].email,
    passwordHash: users[index].passwordHash,
  });

  await writeUsers(users);
  return users[index];
}
