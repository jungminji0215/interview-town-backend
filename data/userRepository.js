import { db } from "../db/database.js";

export async function findByUserId(userId) {
  const result = await db.execute("SELECT * FROM users WHERE user_id=?", [
    userId,
  ]);

  return result[0];
}

export async function createUser({ userId, password, nickname }) {
  const [result] = await db.execute(
    "INSERT INTO users (user_id, password, nickname) VALUES(?,?,?)",
    [userId, password, nickname]
  );

  const insertedId = result.insertId;

  const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [
    insertedId,
  ]);

  return rows[0];
}
