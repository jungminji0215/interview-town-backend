import { db } from "../db/database.js";

export async function getAllCategories() {
  const result = await db.execute("SELECT * FROM categories");
  return { data: { categories: result[0] } };
}
