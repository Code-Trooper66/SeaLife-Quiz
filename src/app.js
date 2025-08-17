// Package imports
import express from "express";
import expressLayouts from "express-ejs-layouts";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import i18n from "i18n";
import multer from "multer";
// Const imports
import { PORT, VIEWS_PATH, LOCALES_PATH } from "./consts.js";
// Controller imports
import authController from "./controllers/authController.js";
import exportController from "./controllers/exportController.js";
import adminController from "./controllers/adminController.js";
import dataController from "./controllers/dataController.js";
import quizController from "./controllers/quizController.js";
// Validation imports
import authLogin from "./validation/authLogin.js";
import authAdminLogin from "./validation/authAdminLogin.js";
import authAdminRegister from "./validation/authAdminRegister.js";
// Model import for image upload
import User from "./models/User.js";

const app = express();
const upload = multer({ dest: "public/assets/images" });

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Views setup
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("layout", "layouts/main");
app.set("views", VIEWS_PATH);

// Translation setup
i18n.configure({
  locales: ["en", "nl", "fr"],
  directory: LOCALES_PATH,
  detectLanguage: false,
  cookie: "lang",
  queryParameter: "lang",
  updateFiles: false,
});
app.use(i18n.init);

app.post("/change-lang", (req, res) => {
  const lang = req.body.lang;
  res.cookie("lang", lang, { maxAge: 900000 });
  const backURL = req.header("Referer") || "/welcome";
  res.redirect(backURL);
});

// Login & register routes
app.get("/welcome", (req, res) => res.render("welcome"));
app.get("/login", authController.userLogin);
app.post("/login", authLogin, authController.postLogin);
app.post("/createSessionForUser", quizController.createSession);
app.get("/adminLogin", authController.adminLogin);
app.post("/adminLogin", authAdminLogin, authController.postAdminLogin);
app.get("/adminRegister", authController.adminRegister);
app.post("/adminRegister", authAdminRegister, authController.postAdminRegister);

app.get("/validate-pincode", async (req, res) => {
  const { user_id, pincode } = req.query;
  const user = await User.query().findById(user_id);
  if (user && user.pincode === pincode) {
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
});

// Quiz routes all of these
app.get("/quiz/:quizId", quizController.getActiveQuestionsWithAnswers);
app.get("/active-users", quizController.getActiveUsers);
app.post("/createSession", quizController.createSession);
app.post("/endSession", quizController.endSession);
app.post("/answer-question", quizController.answerQuestion);
app.post("/second-session", quizController.createSession);
app.post("/feedback", quizController.addFeedbackToUser);
app.get("/quiz/:quiz_id/feedback/:user_id", quizController.getFeedbackQuiz);

// Admin routes
app.get("/admin", requireAdminLogin, (req, res) => {
  res.render("admin/admin");
});

function requireAdminLogin(req, res, next) {
  if (req.cookies && req.cookies.adminLoggedIn) {
    return next();
  }
  return res.redirect("/adminLogin");
}

app.post("/quizzes", requireAdminLogin, adminController.createQuiz);
app.get("/quizzes", requireAdminLogin, adminController.getQuizzes);
app.put("/quizzes/:id", requireAdminLogin, adminController.updateQuiz);
app.delete("/quizzes/:id", requireAdminLogin, adminController.deleteQuiz);

app.post("/questions", requireAdminLogin, adminController.createQuestion);
app.get("/questions", requireAdminLogin, adminController.getQuestions);
app.get("/questions/:id", requireAdminLogin, adminController.getQuestionById);
app.put("/questions/:id", requireAdminLogin, adminController.updateQuestion);
app.delete("/questions/:id", requireAdminLogin, adminController.deleteQuestion);

// Answer routes
app.post("/answers", requireAdminLogin, adminController.createAnswer);
app.put("/answers/:id", requireAdminLogin, adminController.updateAnswer);
app.delete("/answers/:id", requireAdminLogin, adminController.deleteAnswer);

// Admin export and logout
app.get("/admin/export", requireAdminLogin, exportController.exportToExcel);
app.get("/adminLogout", (req, res) => {
  res.clearCookie("adminLoggedIn");
  res.redirect("/adminLogin");
});

// Admin question image upload
app.post(
  "/admin/photos",
  requireAdminLogin,
  upload.single("image"),
  adminController.updateQuestionImage
);

// Review data routes
app.get("/feedback/:quiz_id", requireAdminLogin, dataController.getFeedback);

// Basic routes for running the app
app.get("/", (req, res) => {
  res.redirect("/welcome");
});

app.use((req, res) => {
  res.status(404).render("errors/404", {
    layout: "layouts/error",
  });
});

app.listen(PORT, () => {
  console.log(`we are running on http://localhost:${PORT}`);
});
