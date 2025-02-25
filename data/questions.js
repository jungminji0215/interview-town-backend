const frontQuestions = {
  data: {
    questions: [
      {
        id: 1001,
        title: "React의 상태 관리 방법에는 어떤 것들이 있나요?",
        tag: { id: 102, name: "react" },
      },
      {
        id: 1002,
        title: "자바스크립트의 클로저(Closure)에 대해 설명해주세요.",
        tag: { id: 101, name: "javascript" },
      },
      {
        id: 1003,
        title: "자바스크립트의 클로저(Closure)에 대해 설명해주세요.",
        tag: { id: 101, name: "javascript" },
      },
      {
        id: 1004,
        title: "자바스크립트의 클로저(Closure)에 대해 설명해주세요.",
        tag: { id: 101, name: "javascript" },
      },
      {
        id: 1005,
        title: "자바스크립트의 클로저(Closure)에 대해 설명해주세요.",
        tag: { id: 101, name: "javascript" },
      },
      {
        id: 1006,
        title: "리액트 왜 사용하세요?",
        tag: { id: 101, name: "react" },
      },
      {
        id: 1007,
        title: "자바스크립트의 클로저(Closure)에 대해 설명해주세요.",
        tag: { id: 101, name: "javascript" },
      },
      {
        id: 1008,
        title: "자바스크립트의 클로저(Closure)에 대해 설명해주세요.",
        tag: { id: 101, name: "javascript" },
      },
      {
        id: 1009,
        title: "자바스크립트의 클로저(Closure)에 대해 설명해주세요.",
        tag: { id: 101, name: "javascript" },
      },
      {
        id: 1010,
        title: "자바스크립트의 클로저(Closure)에 대해 설명해주세요.",
        tag: { id: 101, name: "javascript" },
      },
      {
        id: 1011,
        title: "자바스크립트의 클로저(Closure)에 대해 설명해주세요.",
        tag: { id: 101, name: "javascript" },
      },
      {
        id: 1012,
        title: "자바스크립트의 클로저(Closure)에 대해 설명해주세요.",
        tag: { id: 101, name: "javascript" },
      },
      {
        id: 1013,
        title: "자바스크립트의 클로저(Closure)에 대해 설명해주세요.",
        tag: { id: 101, name: "javascript" },
      },
      {
        id: 1014,
        title: "자바스크립트의 클로저(Closure)에 대해 설명해주세요.",
        tag: { id: 101, name: "javascript" },
      },
      {
        id: 1015,
        title: "자바스크립트의 클로저(Closure)에 대해 설명해주세요.",
        tag: { id: 101, name: "javascript" },
      },
      {
        id: 1016,
        title: "자바스크립트의 클로저(Closure)에 대해 설명해주세요.",
        tag: { id: 101, name: "javascript" },
      },
      {
        id: 1017,
        title: "자바스크립트의 클로저(Closure)에 대해 설명해주세요.",
        tag: { id: 101, name: "javascript" },
      },
    ],
  },

  pagination: {
    page: 1,
    limit: 10,
    total: 25,
  },
};

const backendQuestions = {
  data: {
    questions: [
      {
        id: 1004,
        title: "스프링 동작 방식에 대해서 설명 부탁",
        tag: { id: 201, name: "spring" },
      },
      {
        id: 1005,
        title: "자바 특징에 대해서 설명 부탁드립니다.",
        tag: { id: 202, name: "java" },
      },
      {
        id: 1006,
        title: "스프링 시큐리티 아시나요?",
        tag: { id: 201, name: "spring" },
      },
    ],
  },

  pagination: {
    page: 1,
    limit: 10,
    total: 25,
  },
};

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

export function getQuestionsByCategory(category) {
  if (category === "frontend") return frontQuestions || [];
  if (category === "backend") return backendQuestions || [];
}

export function getQuestionByCategoryId(categoryId) {
  return questionDetail;
}
