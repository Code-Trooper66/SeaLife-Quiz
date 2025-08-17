import knex from "../lib/Knex.js";
import { Model } from "objection";
import Quiz from "./Quiz.js";
import User from "./User.js";
import SessionAnswer from "./SessionAnswer.js";

Model.knex(knex);

class Session extends Model {
  static get tableName() {
    return "session";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id", "quiz_id"],
      properties: {
        id: { type: "integer" },
        quiz_id: { type: "integer" },
        age: { type: "integer" },
        moment: { type: "string" },
        created_at: { type: "string", format: "date-time" },
      },
    };
  }

  static get relationMappings() {
    return {
      quiz: {
        relation: Model.BelongsToOneRelation,
        modelClass: Quiz,
        join: {
          from: "session.quiz_id",
          to: "quiz.id",
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "session.user_id",
          to: "user.id",
        },
      },
      sessionAnswers: {
        relation: Model.HasManyRelation,
        modelClass: SessionAnswer,
        join: {
          from: "session.id",
          to: "session_answer.session_id",
        },
      },
    };
  }
}

export default Session;
