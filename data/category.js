/** 임시 데이터 */
const categoriesData = {
  categories: [
    {
      id: 1,
      name: "프론트엔드",
      description: "웹 프론트엔드 개발 관련 질문",
    },
    {
      id: 2,
      name: "백엔드",
      description: "서버 및 백엔드 개발 관련 질문",
    },
    {
      id: 3,
      name: "IOS",
      description: "iOS 앱 개발 관련 질문",
    },
  ],
};

export function getAllCategories() {
  return categoriesData;
}
