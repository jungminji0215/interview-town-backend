import { db } from "../db/database.js";

export async function getAnswersByQuestionId(questionId) {
  const result = await db.execute("SELECT * FROM answers WHERE question_id=?", [
    questionId,
  ]);

  return { data: { answers: result[0] } };
}

export async function addAnswer(questionId, id, content) {
  const [result] = await db.execute(
    "INSERT INTO answers (question_id, user_id, content) VALUES(?,?,?)",
    [questionId, id, content]
  );

  const insertedId = result.insertId;

  // 새로 삽입한 답변을 조회 (필요에 따라 조회할 컬럼을 추가)
  const [rows] = await db.execute("SELECT * FROM answers WHERE id = ?", [
    insertedId,
  ]);

  return { data: { answer: rows[0] } };
}
