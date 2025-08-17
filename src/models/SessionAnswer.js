import knex from "../lib/Knex.js";
import { Model } from "objection";
import Session from "./Session.js";
import Question from "./Question.js";
import Answer from "./Answer.js";

Model.knex(knex);

class SessionAnswer extends Model {
  static get tableName() {
    return "session_answer";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["session_id", "question_id", "answer_id"],
      properties: {
        id: { type: "integer" },
        session_id: { type: "integer" },
        question_id: { type: "integer" },
        answer_id: { type: "integer" },
      },
    };
  }

  static get relationMappings() {
    return {
      session: {
        relation: Model.BelongsToOneRelation,
        modelClass: Session,
        join: {
          from: "session_answer.session_id",
          to: "session.id",
        },
      },
      Question: {
        relation: Model.BelongsToOneRelation,
        modelClass: Question,
        join: {
          from: "session_answer.question_id",
          to: "question.id",
        },
      },
      Answer: {
        relation: Model.BelongsToOneRelation,
        modelClass: Answer,
        join: {
          from: "session_answer.answer_id",
          to: "answer.id",
        },
      },
    };
  }
}

export default SessionAnswer;
