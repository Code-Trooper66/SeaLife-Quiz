import ExcelJS from "exceljs";
import knex from "../lib/Knex.js";

const exportController = {
  exportToExcel: async function (req, res) {
    try {
      const period = parseInt(req.query.period, 10);
      if (!period || period < 1 || period > 4) {
        return res
          .status(400)
          .send("Invalid period. Please provide period 1-4.");
      }

      const periodMonths = {
        1: [1, 2, 3],
        2: [4, 5, 6],
        3: [7, 8, 9],
        4: [10, 11, 12],
      };
      const months = periodMonths[period];

      const results = await knex.raw(`
        SELECT DISTINCT
          u.id as user_id,
          u.firstname,
          u.lastname,
          u.birthday,
          u.feedback,
          s.id as session_id,
          s.created_at as session_date,
          s.age as session_age,
          s.moment as session_moment,
          q.title as quiz_title,
          quest.question_nl,
          quest.question_en,
          quest.question_fr,
          user_ans.answer_nl as user_answer_nl,
          correct_ans.answer_nl as correct_answer_nl,
          user_ans.is_true as is_correct
        FROM user u
        LEFT JOIN session s ON u.id = s.user_id 
          AND CAST(substr(s.created_at, 6, 2) AS INTEGER) IN (${months.join(
            ","
          )})
        LEFT JOIN quiz q ON s.quiz_id = q.id
        LEFT JOIN session_answer sa ON s.id = sa.session_id
        LEFT JOIN question quest ON sa.question_id = quest.id
        LEFT JOIN answer user_ans ON sa.answer_id = user_ans.id
        LEFT JOIN answer correct_ans ON quest.id = correct_ans.question_id AND correct_ans.is_true = 1
        ORDER BY u.id, s.created_at, quest.id
      `);

      const rows = results;

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet(`Q${period} Results`);

      sheet.addRow([
        "User ID",
        "First Name",
        "Last Name",
        "Birthday",
        "User Feedback",
        "Quiz Title",
        "Session Date",
        "Session Age",
        "Session Moment",
        "Question (NL)",
        "User Answer (NL)",
        "Correct Answer (NL)",
        "Is Correct",
      ]);

      rows.forEach((row) => {
        sheet.addRow([
          row.user_id,
          row.firstname,
          row.lastname,
          row.birthday,
          row.feedback || "No feedback",
          row.quiz_title || "No quiz taken",
          row.session_date || "",
          row.session_age || "",
          row.session_moment || "",
          row.question_nl || "",
          row.user_answer_nl || "",
          row.is_correct ? "Yes" : "No",
        ]);
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=quarter_${period}_results.xlsx`
      );

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error("Export error:", error);
      res.status(500).send("Failed to export Excel: " + error.message);
    }
  },
};

export default exportController;
