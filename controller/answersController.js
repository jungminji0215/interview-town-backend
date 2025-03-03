import * as answerRepository from "../data/answerRepository.js";

export const getAnswersByQuestionId = async (req, res, next) => {
  const questionId = req.query.questionId;

  const data = await answerRepository.getAnswersByQuestionId(questionId);
  res.status(200).json(data);
};

export const addAnswer = async (req, res, next) => {
  console.log("실시간 답변 테스트");

  try {
    const { questionId, content } = req.body;
    // DB에 새 답변 추가
    const data = await answerRepository.addAnswer(questionId, content);

    console.log("실시간 답변 테스트 data :>> ", data);

    // 답변 등록 후, socket.io를 통해 모든 클라이언트에 새 답변 방송
    // app.locals.io는 메인 서버 파일에서 설정한 socket.io 인스턴스
    req.app.locals.io.emit("newAnswer", data.data.answer);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
