import { db } from "../db/database.js";

/**
 * 질문 목록
 * @param {string} category
 * @param {number} page
 * @param {number} pageSize
 * @returns
 */
export async function getQuestionsByCategory(
  category,
  page = 1,
  pageSize = 10
) {
  const offset = (page - 1) * pageSize;

  const query = `
    SELECT 
      q.id,
      q.title,
      JSON_OBJECT('id', t.id, 'name', t.name) AS tag
    FROM questions AS q
    INNER JOIN categories AS c ON q.category_id = c.id
    INNER JOIN tags AS t ON q.tag_id = t.id
    WHERE c.name = ?
    LIMIT ${pageSize} OFFSET ${offset};
  `;

  const [questions] = await db.execute(query, [category]);

  const [[{ totalCount }]] = await db.execute(
    `
    SELECT COUNT(*) as totalCount
    FROM questions AS q
    INNER JOIN categories AS c ON q.category_id = c.id
    WHERE c.name = ?;
    `,
    [category]
  );

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    data: { questions },
    pagination: {
      currentPage: page,
      pageSize: pageSize,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      previousPage: page > 1 ? page - 1 : null,
    },
  };
}

export async function getQuestionById(questionId) {
  const [result] = await db.execute(
    `
    SELECT 
      q.id,
      q.title,
      JSON_OBJECT('id', t.id, 'name', t.name) AS tag,
      JSON_OBJECT('id', c.id, 'name', c.name) AS category
    FROM questions AS q
    INNER JOIN categories AS c ON q.category_id = c.id
    INNER JOIN tags AS t ON q.tag_id = t.id
    WHERE q.id = ?;
    `,
    [questionId]
  );

  return { data: { question: result[0] } };
}
