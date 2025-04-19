import { db } from "../db/database.js";

// export async function getAllCategories() {
//   const result = await db.execute("SELECT * FROM categories");
//   return { data: { categories: result[0] } };
// }

export async function getAllCategories() {
  const [rows] = await db.execute(`
    SELECT 
      c.id AS category_id,
      c.name AS category_name,
      t.id AS tag_id,
      t.name AS tag_name
    FROM categories c
    LEFT JOIN tags t ON c.id = t.category_id
    ORDER BY c.id, t.id
  `);

  const categoriesMap = new Map();

  rows.forEach((row) => {
    const { category_id, category_name, tag_id, tag_name } = row;

    if (!categoriesMap.has(category_id)) {
      categoriesMap.set(category_id, {
        id: category_id,
        name: category_name,
        tags: [],
      });
    }

    if (tag_id && tag_name) {
      categoriesMap.get(category_id).tags.push({
        id: tag_id,
        name: tag_name,
      });
    }
  });

  return { data: { categories: Array.from(categoriesMap.values()) } };
}