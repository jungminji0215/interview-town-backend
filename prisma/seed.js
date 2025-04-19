import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const frontend = await prisma.category.create({
    data: { name: 'frontend' },
  });

  const backend = await prisma.category.create({
    data: { name: 'backend' },
  });


  const user = await prisma.user.create({
    data: {
      email: 'minji@example.com',
      password: 'hashed_password',
      nickname: 'minji',
    },
  });


  const createQuestionsAndAnswers = async (categoryId) => {
    for (let i = 1; i <= 100; i++) {
      const question = await prisma.question.create({
        data: {
          title: `Q${i} - 이 카테고리에서 어떤 기술을 알아야 하나요?`,
          content: `이건 질문 ${i}번에 대한 상세 설명입니다.`,
          categoryId,
        },
      });

      await prisma.answer.create({
        data: {
          content: `이건 질문 ${i}번에 대한 예시 답변입니다.`,
          questionId: question.id,
          userId: user.id,
        },
      });
    }
  };

  await createQuestionsAndAnswers(frontend.id);
  await createQuestionsAndAnswers(backend.id);

  console.log('✅ 더미 데이터 삽입 완료!');
}

main()
  .catch((e) => {
    console.error('❌ Seed 에러:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });