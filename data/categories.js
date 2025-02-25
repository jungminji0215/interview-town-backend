/** 임시 데이터 TODO prisma 연결 */
const categoriesData = {
  categories: [
    {
      id: 1,
      name: "frontend",
      description: "웹 프론트엔드 개발 관련 질문",
    },
    {
      id: 2,
      name: "backend",
      description: "서버 및 백엔드 개발 관련 질문",
    },
    {
      id: 3,
      name: "ios",
      description: "iOS 앱 개발 관련 질문",
    },
  ],
};

export function getAllCategories() {
  return { data: categoriesData };
}
