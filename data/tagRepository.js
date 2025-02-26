import { db } from "../db/database.js";

// TODO 이렇게 해야만 하는가..
const categoryMapping = {
  frontend: 1,
  backend: 2,
  ios: 3,
  android: 4,
};

export async function getTagsByCategory(category) {
  const categoryId = categoryMapping[category];

  const result = await db.execute("SELECT * FROM tags WHERE category_id=?", [
    categoryId,
  ]);

  return { data: { tags: result[0] } };
}
