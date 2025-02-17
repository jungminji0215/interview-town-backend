import express from "express";

const questions = {
  questions: [
    {
      id: 1001,
      title: "React의 상태 관리 방법에는 어떤 것들이 있나요?",
      tags: [
        { id: 102, name: "react" },
        { id: 104, name: "상태관리" },
      ],
      createdAt: "2025-02-10T12:34:56Z",
    },
    {
      id: 1002,
      title: "자바스크립트의 클로저(Closure)에 대해 설명해주세요.",
      tags: [
        { id: 101, name: "javascript" },
        { id: 105, name: "클로저" },
      ],
      createdAt: "2025-02-11T08:22:33Z",
    },
  ],
  pagination: {
    page: 1,
    limit: 10,
    total: 25,
  },
};

const questionDetail = {
  question: {
    id: 1001,
    title: "React의 상태 관리 방법에는 어떤 것들이 있나요?",
    content: "React에서 상태 관리를 위해 사용하는 라이브러리와 그 이유에 대해 구체적으로 설명해주세요.",
    tags: [
      { id: 102, name: "react" },
      { id: 104, name: "상태관리" },
    ],
    category: { id: 1, name: "프론트엔드" },
    createdAt: "2025-02-10T12:34:56Z",
    updatedAt: "2025-02-11T09:10:00Z",
  },
};

const answers = {
  answers: [
    {
      id: "a1",
      content: "Redux를 사용하면 복잡한 상태 관리를 효과적으로 할 수 있습니다.",
      userName: "user123",
      createdAt: "2025-02-11T10:15:00Z",
    },
    {
      id: "a2",
      content: "Context API도 간단한 프로젝트에서는 충분히 좋은 선택입니다.",
      userName: "user456",
      createdAt: "2025-02-11T11:00:00Z",
    },
  ],
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 1,
    totalCount: 2,
  },
};

const router = express.Router();

/**
 * GET /questions
 * 질문 목록을 조회한다
 */
router.get("/", (req, res, next) => {
  const data = questions;
  res.status(200).json(data);
});

/**
 * GET /questions/{questionId}
 * 질문 상세를 조회한다
 */
router.get("/:questionId", (req, res, next) => {
  const data = questionDetail;
  res.status(200).json(data);
});

/**
 * GET /questions/{questionId}/answers
 * 답변 목록 조회
 */
router.get("/:questionId/answers", (req, res, next) => {
  const data = answers;
  res.status(200).json(data);
});

/**
 * POST /questions/{questionId}/answers
 * 답변 등록
 */
// router.post("/:questionId/answers", (req, res, next) => {
//   const { content, userId } = req.body;
//   const newAnswer = {
//     id: Date.now().toString(),
//     content,
//     userName: "익명의 지원자",
//     createdAt: new Date(),
//   };
// });

export default router;
