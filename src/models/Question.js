import knex from "../lib/Knex.js";
import { Model } from "objection";
import Quiz from "./Quiz.js";
import SessionAnswer from "./SessionAnswer.js";
import Answer from "./Answer.js";

Model.knex(knex);

class Question extends Model {
  static get tableName() {
    return "question";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "quiz_id",
        "question_nl",
        "question_en",
        "question_fr",
        "is_active",
      ],
      properties: {
        id: { type: "integer" },
        quiz_id: { type: "integer" },
        question_nl: { type: "string" },
        question_en: { type: "string" },
        question_fr: { type: "string" },
        image_url: { type: "string" },
        is_active: { type: "boolean" },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }

  static get relationMappings() {
    return {
      quiz: {
        relation: Model.BelongsToOneRelation,
        modelClass: Quiz,
        join: {
          from: "question.quiz_id",
          to: "quiz.id",
        },
      },
      answer: {
        relation: Model.HasManyRelation,
        modelClass: Answer,
        join: {
          from: "question.id",
          to: "answer.question_id",
        },
      },
      session_answer: {
        relation: Model.HasManyRelation,
        modelClass: SessionAnswer,
        join: {
          from: "question.id",
          to: "session_answer.question_id",
        },
      },
    };
  }
}

export default Question;
