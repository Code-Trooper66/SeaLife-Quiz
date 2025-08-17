import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";
import SessionAnswer from "../models/SessionAnswer.js";
import Session from "../models/Session.js";
import User from "../models/User.js";
import { DateTime } from "luxon";

const quizController = {
  async getActiveQuestionsWithAnswers(req, res) {
    const { quizId } = req.params;
    const userId = req.query.user_id;

    try {
      const quiz = await Quiz.query().findOne({ id: quizId, is_active: true });
      if (!quiz) throw new Error("Quiz not found or not active");

      const questions = await Question.query()
        .where({ quiz_id: quiz.id, is_active: true })
        .withGraphFetched("answer");

      const lang = req.getLocale();

      const questionsTranslated = questions.map((question) => ({
        ...question,
        question_text: question[`question_${lang}`],
        answers: question.answer.map((answer) => ({
          ...answer,
          answer_text: answer[`answer_${lang}`],
        })),
      }));

      const user = await User.query().findById(userId);

      function calculateAge(birthday) {
        if (!birthday) return null;
        const birthDate = new Date(birthday);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      }

      let session = await Session.query().findOne({
        user_id: user.id,
        quiz_id: quiz.id,
        moment: "first try",
      });

      const nowBelgium = DateTime.now()
        .setZone("Europe/Brussels")
        .toSQL({ includeOffset: false });

      if (!session) {
        session = await Session.query().insertAndFetch({
          user_id: user.id,
          quiz_id: quiz.id,
          age: calculateAge(user.birthday),
          moment: "first try",
          created_at: nowBelgium,
        });
      }

      res.render("questions", {
        questions: questionsTranslated,
        user,
        session,
        quiz,
      });
    } catch (err) {
      console.error("Error fetching questions:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getFeedbackQuiz(req, res) {
    try {
      const { quiz_id, user_id } = req.params;
      const locale = req.getLocale();

      const quiz1Questions = await Question.query()
        .where("quiz_id", 1)
        .withGraphFetched("answer");

      const quiz2Questions = await Question.query()
        .where("quiz_id", 2)
        .withGraphFetched("answer");

      const sessions = await Session.query()
        .where("user_id", user_id)
        .whereIn("moment", ["first try", "second try", "completed"])
        .orderBy("created_at")
        .withGraphFetched("sessionAnswers.[Question, Answer]");

      const quiz1Session = sessions.find((s) => s.quiz_id === 1);
      const quiz1Feedback = quiz1Questions.map((q) => {
        const correctAnswer = q.answer.find((ans) => ans.is_true);
        let userAnswer = null;

        if (quiz1Session) {
          const sessionAnswer = quiz1Session.sessionAnswers.find(
            (sa) => sa.question_id === q.id
          );
          if (sessionAnswer) {
            userAnswer = {
              selectedAnswer: sessionAnswer.Answer,
              isCorrect: sessionAnswer.Answer.is_true,
            };
          }
        }

        return {
          question: q,
          correctAnswer: correctAnswer || null,
          userAnswer: userAnswer || { selectedAnswer: null, isCorrect: false },
        };
      });

      const quiz2Session = sessions.find(
        (s) => s.quiz_id === 2 && s.moment === "completed"
      );

      const quiz2Feedback = quiz2Questions.map((q) => {
        const correctAnswer = q.answer.find((ans) => ans.is_true);
        let userAnswer = null;

        if (quiz2Session) {
          const sessionAnswer = quiz2Session.sessionAnswers.find(
            (sa) => sa.question_id === q.id
          );
          if (sessionAnswer) {
            userAnswer = {
              selectedAnswer: sessionAnswer.Answer,
              isCorrect: sessionAnswer.Answer.is_true,
            };
          }
        }

        return {
          question: q,
          correctAnswer: correctAnswer || null,
          userAnswer: userAnswer || { selectedAnswer: null, isCorrect: false },
        };
      });

      res.render("feedbackUser", {
        quiz_id,
        user_id,
        quiz1Feedback,
        quiz2Feedback,
        locale,
      });
    } catch (error) {
      console.error("ERROR in getFeedbackQuiz:", error);
      res.status(500).send("Internal Server Error: " + error.message);
    }
  },

  async answerQuestion(req, res) {
    const { session_id, quiz_id, answers } = req.body;

    if (!session_id || !quiz_id || !Array.isArray(answers)) {
      return res
        .status(400)
        .json({ error: "session_id, quiz_id and answers are required." });
    }

    try {
      const session = await Session.query().findById(Number(session_id));
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      for (const answer of answers) {
        const question_id = Number(answer.question_id);
        const answer_id = Number(answer.answer_id);

        if (!question_id || !answer_id) continue;

        const answerObj = await Answer.query().findById(answer_id);
        if (!answerObj || Number(answerObj.question_id) !== question_id)
          continue;

        const insertData = {
          session_id: Number(session_id),
          question_id: question_id,
          answer_id: answer_id,
        };

        await SessionAnswer.query().insert(insertData);
      }

      res.status(201).json({ message: "Answers saved successfully" });
    } catch (err) {
      console.error("Error saving session_answer:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async addFeedbackToUser(req, res) {
    const { user_id, text } = req.body;

    if (!user_id || !text) {
      return res.status(400).json({ error: "user_id and text are required." });
    }

    try {
      const user = await User.query().findById(user_id);

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      await User.query().patchAndFetchById(user_id, {
        feedback: text,
      });

      res.redirect("/");
    } catch (err) {
      console.error("Error adding feedback:", err);
      res.status(500).json({ error: "Internal server error." });
    }
  },

  async createSession(req, res) {
    try {
      const { user_id, quiz_id } = req.body;
      if (!user_id || !quiz_id) {
        return res
          .status(400)
          .json({ error: "user_id and quiz_id are required." });
      }

      const user = await User.query().findById(user_id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      let age = null;
      if (user.birthday) {
        const birthDate = new Date(user.birthday);
        const today = new Date();
        age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
      }

      const existingFirstTry = await Session.query().findOne({
        user_id: user_id,
        moment: "first try",
      });

      const isSecondSession = !!existingFirstTry;

      const nowBelgium = DateTime.now()
        .setZone("Europe/Brussels")
        .toSQL({ includeOffset: false });

      const session = await Session.query().insert({
        user_id,
        quiz_id,
        age,
        moment: isSecondSession ? "second try" : "first try",
        created_at: nowBelgium,
      });

      res
        .status(201)
        .json({ message: "Session created", session_id: session.id });
    } catch (err) {
      console.error("Error creating session:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async endSession(req, res) {
    const { user_id, moment } = req.body;

    if (!user_id || !moment) {
      return res
        .status(400)
        .json({ error: "user_id and moment are required." });
    }

    try {
      const session = await Session.query()
        .where({ user_id })
        .orderBy("created_at", "desc")
        .first();

      if (!session) {
        return res.status(404).json({
          error: "No session found for this user.",
        });
      }

      const updatedSession = await Session.query().patchAndFetchById(
        session.id,
        { moment: "completed" }
      );

      res.status(200).json({
        message: "Session updated successfully.",
        session: updatedSession,
      });
    } catch (err) {
      console.error("Error updating session:", err);
      res.status(500).json({ error: "Internal server error." });
    }
  },

  async getActiveUsers(req, res) {
    try {
      const users = await User.query()
        .whereExists(
          Session.query()
            .select("id")
            .whereRaw("session.user_id = user.id")
            .where("moment", "second try")
            .where("id", function () {
              this.select("id")
                .from("session as s2")
                .whereRaw("s2.user_id = session.user_id")
                .orderBy("created_at", "desc")
                .limit(1);
            })
        )
        .withGraphFetched("session");

      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default quizController;
