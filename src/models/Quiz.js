import knex from "../lib/Knex.js";
import { Model } from "objection";
import Question from "./Question.js";
import Session from "./Session.js";
import Admin from "./Admin.js";

Model.knex(knex);

class Quiz extends Model {
  static get tableName() {
    return "quiz";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["title", "description", "author_id", "is_active"],
      properties: {
        id: { type: "integer" },
        title: { type: "string" },
        description: { type: "string" },
        author_id: { type: "integer" },
        is_active: { type: "boolean" },
      },
    };
  }

  static get relationMappings() {
    return {
      questions: {
        relation: Model.HasManyRelation,
        modelClass: Question,
        join: {
          from: "quiz.id",
          to: "question.quiz_id",
        },
      },
      session: {
        relation: Model.HasManyRelation,
        modelClass: Session,
        join: {
          from: "quiz.id",
          to: "session.quiz_id",
        },
      },
      admin: {
        relation: Model.BelongsToOneRelation,
        modelClass: Admin,
        join: {
          from: "quiz.author_id",
          to: "admin.id",
        },
      },
    };
  }
}

export default Quiz;
