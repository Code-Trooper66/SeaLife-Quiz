import { body } from "express-validator";

export default [
  body("name").notEmpty().withMessage("Dit is een verplicht veld."),
  body("email")
    .notEmpty()
    .withMessage("Dit is een verplicht veld.")
    .bail()
    .isEmail()
    .withMessage("Email is onjuist."),
  body("password")
    .notEmpty()
    .withMessage("Wachtwoord is verplicht.")
    .isLength({ min: 6 })
    .withMessage("Wachtwoord moet minstens 6 tekens bevatten.")
    .custom((value, { req }) => {
      if (value !== req.body["confirm-password"]) {
        throw new Error("Wachtwoorden komen niet overeen.");
      }
      return true;
    }),

  body("confirm-password")
    .notEmpty()
    .withMessage("Dit is een verplicht veld.")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Wachtwoorden komen niet overeen.");
      }
      return true;
    }),
];
