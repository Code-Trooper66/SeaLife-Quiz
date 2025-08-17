import Quiz from "../models/Quiz.js";
import Session from "../models/Session.js";

const dataController = {
  async loadDataPage(req, res) {
    try {
      const url = req.originalUrl.replace("/admin/", "").split("?")[0];
      const quizzes = await Quiz.query();
      res.render("admin/" + url, { quizzes });
    } catch (error) {
      console.error(error);
      res.status(500).send("Could not load quizzes");
    }
  },

  async getFeedback(req, res) {
    try {
      const { quiz_id } = req.params;
      const { age_min, age_max } = req.query;

      let query = Session.query()
        .where("quiz_id", quiz_id)
        .withGraphFetched("[user, quiz]");

      const sessions = await query;

      const feedback = sessions
        .filter((s) => s.user?.feedback)
        .filter((s) => {
          const min = age_min ?? 0;
          const max = age_max ?? 120;
          return s.age >= min && s.age <= max;
        })
        .map((s) => ({
          quiz_id: s.quiz?.id,
          quiz_title: s.quiz?.title,
          feedback: s.user?.feedback,
          age: s.age,
        }));

      res.json({ feedback });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Could not fetch feedback" });
    }
  },
};

export default dataController;
