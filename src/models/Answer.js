import knex from "../lib/Knex.js";
import { Model } from "objection";
import Question from "./Question.js";
import SessionAnswer from "./SessionAnswer.js";

Model.knex(knex);

class Answer extends Model {
  static get tableName() {
    return "answer";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "question_id",
        "answer_nl",
        "answer_en",
        "answer_fr",
        "is_true",
      ],
      properties: {
        id: { type: "integer" },
        question_id: { type: "integer" },
        answer_nl: { type: "string" },
        answer_en: { type: "string" },
        answer_fr: { type: "string" },
        is_true: { type: "boolean" },
      },
    };
  }

  static get relationMappings() {
    return {
      sessionAnswer: {
        relation: Model.HasManyRelation,
        modelClass: SessionAnswer,
        join: {
          from: "answer.id",
          to: "session_answer.answer_id",
        },
      },
      question: {
        relation: Model.BelongsToOneRelation,
        modelClass: Question,
        join: {
          from: "answer.question_id",
          to: "question.id",
        },
      },
    };
  }
}

export default Answer;
