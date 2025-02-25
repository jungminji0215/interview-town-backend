/** 임시 데이터 TODO prisma 연결 */
const tagsData = {
  frontend: [
    { id: 101, name: "javascript" },
    { id: 102, name: "react" },
    { id: 103, name: "css" },
  ],
  backend: [
    { id: 201, name: "spring" },
    { id: 202, name: "java" },
    { id: 203, name: "redis" },
  ],
  ios: [
    { id: 301, name: "아이폰" },
    { id: 302, name: "아이폰 pro" },
    { id: 303, name: "아이폰 se" },
  ],
};

export function getTagsByCategory(category) {
  return { data: { tags: tagsData[category] } } || [];
}
