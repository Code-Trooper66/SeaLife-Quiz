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
    .withMessage("Dit is een verplicht veld")
    .isLength({ min: 6 })
    .withMessage("Wachtwoord moet minstens 6 tekens bevatten."),
];
