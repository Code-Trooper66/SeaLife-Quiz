import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";

const adminController = {
  async createQuiz(req, res) {
    try {
      const { title, description, author_id } = req.body;
      let is_active = req.body.is_active;
      if (typeof is_active === "undefined") is_active = true;
      if (typeof is_active === "string") is_active = is_active === "true";

      const newQuiz = await Quiz.query().insert({
        title,
        description,
        author_id,
        is_active,
      });

      res.status(201).json(newQuiz);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create quiz" });
    }
  },

  async getQuizzes(req, res) {
    try {
      const quizzes = await Quiz.query().withGraphFetched("questions.answer");
      res.json(quizzes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch quizzes" });
    }
  },

  async updateQuiz(req, res) {
    try {
      const { id } = req.params;
      const { title, description, is_active } = req.body;

      const updatedQuiz = await Quiz.query()
        .findById(id)
        .patch({ title, description, is_active })
        .returning("*");

      if (!updatedQuiz)
        return res.status(404).json({ error: "Quiz not found" });
      res.json(updatedQuiz);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update quiz" });
    }
  },

  async deleteQuiz(req, res) {
    try {
      const { id } = req.params;
      const questions = await Question.query().where("quiz_id", id);
      for (const q of questions) {
        await Answer.query().delete().where("question_id", q.id);
      }

      await Question.query().delete().where("quiz_id", id);

      const rowsDeleted = await Quiz.query().deleteById(id);
      if (!rowsDeleted)
        return res.status(404).json({ error: "Quiz not found" });

      res.json({ message: "Quiz deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete quiz" });
    }
  },

  async toggleQuizActive(req, res) {
    try {
      const { id } = req.params;
      const { is_active } = req.body;

      const updatedQuiz = await Quiz.query()
        .findById(id)
        .patch({ is_active })
        .returning("*");

      if (!updatedQuiz)
        return res.status(404).json({ error: "Quiz not found" });
      res.json({
        message: `Quiz ${is_active ? "activated" : "deactivated"}`,
        quiz: updatedQuiz,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update quiz status" });
    }
  },

  async createQuestion(req, res) {
    try {
      const {
        quiz_id,
        question_en,
        question_nl,
        question_fr,
        image_url,
        is_active,
      } = req.body;

      const quiz = await Quiz.query().findById(quiz_id);
      if (!quiz) return res.status(404).json({ error: "Quiz not found" });

      const newQuestion = await Question.query().insert({
        quiz_id,
        question_en,
        question_nl,
        question_fr,
        image_url,
        is_active,
      });

      res.status(201).json(newQuestion);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create question" });
    }
  },

  async getQuestions(req, res) {
    try {
      const { quizId } = req.params;
      let query = Question.query().withGraphFetched("answer");
      if (quizId) query = query.where("quiz_id", quizId);
      const questions = await query;
      res.json(questions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch questions" });
    }
  },

  async getQuestionById(req, res) {
    try {
      const { id } = req.params;
      const question = await Question.query()
        .findById(id)
        .withGraphFetched("answer");
      if (!question)
        return res.status(404).json({ error: "Question not found" });
      res.json(question);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch question" });
    }
  },

  async updateQuestion(req, res) {
    try {
      const { id } = req.params;
      const {
        question_en,
        question_nl,
        question_fr,
        image_url,
        is_active,
        answers,
      } = req.body;

      const updatedQuestion = await Question.query()
        .findById(id)
        .patch({ question_en, question_nl, question_fr, image_url, is_active })
        .returning("*");

      if (!updatedQuestion)
        return res.status(404).json({ error: "Question not found" });

      if (Array.isArray(answers)) {
        for (const answer of answers) {
          const {
            id: answerId,
            answer_en,
            answer_nl,
            answer_fr,
            is_true,
          } = answer;
          await Answer.query().findById(answerId).patch({
            answer_en,
            answer_nl,
            answer_fr,
            is_true: !!is_true,
          });
        }
      }

      res.json(updatedQuestion);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update question" });
    }
  },

  async deleteQuestion(req, res) {
    try {
      const { id } = req.params;
      await Answer.query().delete().where("question_id", id);
      const rowsDeleted = await Question.query().deleteById(id);
      if (!rowsDeleted)
        return res.status(404).json({ error: "Question not found" });
      res.json({ message: "Question deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete question" });
    }
  },

  async toggleQuestionActive(req, res) {
    try {
      const { id } = req.params;
      const { is_active } = req.body;
      const updatedQuestion = await Question.query()
        .findById(id)
        .patch({ is_active })
        .returning("*");
      if (!updatedQuestion)
        return res.status(404).json({ error: "Question not found" });
      res.json({
        message: `Question ${is_active ? "activated" : "deactivated"}`,
        question: updatedQuestion,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update question status" });
    }
  },

  async updateQuestionImage(req, res) {
    try {
      const questionId = req.body.vraag_id || req.body.question_id;

      if (!questionId) {
        return res.status(400).json({ error: "Question ID is required" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
      }

      const image_url = req.file.filename;
      const updatedQuestion = await Question.query()
        .findById(questionId)
        .patch({ image_url })
        .returning("*");

      if (!updatedQuestion) {
        return res.status(404).json({ error: "Question not found" });
      }

      res.json({
        success: true,
        message: "Image updated successfully",
        question: updatedQuestion,
      });
    } catch (error) {
      console.error("Error updating question image:", error);
      res.status(500).json({ error: "Failed to update image" });
    }
  },

  async createAnswer(req, res) {
    try {
      const { question_id, answer_en, answer_nl, answer_fr, is_true } =
        req.body;
      const question = await Question.query().findById(question_id);
      if (!question)
        return res.status(404).json({ error: "Question not found" });

      const newAnswer = await Answer.query().insert({
        question_id,
        answer_en,
        answer_nl,
        answer_fr,
        is_true: !!is_true,
      });

      res.status(201).json(newAnswer);
    } catch (error) {
      console.error("Error creating answer:", error);
      res.status(500).json({ error: "Failed to create answer" });
    }
  },

  async updateAnswer(req, res) {
    try {
      const { id } = req.params;
      const { answer_en, answer_nl, answer_fr, is_true } = req.body;

      const updatedAnswer = await Answer.query()
        .findById(id)
        .patch({ answer_en, answer_nl, answer_fr, is_true: !!is_true })
        .returning("*");

      if (!updatedAnswer)
        return res.status(404).json({ error: "Answer not found" });
      res.json(updatedAnswer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update answer" });
    }
  },

  async deleteAnswer(req, res) {
    try {
      const { id } = req.params;
      const rowsDeleted = await Answer.query().deleteById(id);
      if (!rowsDeleted)
        return res.status(404).json({ error: "Answer not found" });
      res.json({ message: "Answer deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete answer" });
    }
  },
};

export default adminController;
