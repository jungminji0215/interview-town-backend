import { db } from "../db/database.js";

const questionDetail = {
  data: {
    question: {
      id: 1001,
      title: "React의 상태 관리 방법에는 어떤 것들이 있나요?",
      content:
        "React에서 상태 관리를 위해 사용하는 라이브러리와 그 이유에 대해 구체적으로 설명해주세요.",
      tags: [
        { id: 102, name: "react" },
        { id: 104, name: "상태관리" },
      ],
      category: { id: 1, name: "프론트엔드" },
    },
  },
};

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

export function getQuestionByCategoryId(categoryId) {
  return questionDetail;
}
