import { body } from "express-validator";

export default [
  body("firstname").notEmpty().withMessage("Dit is een verplicht veld."),
  body("lastname").notEmpty().withMessage("Dit is een verplicht veld."),
  body("birthday").notEmpty().withMessage("Dit is een verplicht veld."),
];
