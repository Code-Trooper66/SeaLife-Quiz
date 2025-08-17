import knex from "../lib/Knex.js";
import { Model } from "objection";
import Quiz from "./Quiz.js";

Model.knex(knex);

class Admin extends Model {
  static get tableName() {
    return "admin";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "email", "password"],
      properties: {
        id: { type: "integer" },
        name: { type: "string" },
        email: { type: "string" },
        password: { type: "string" },
      },
    };
  }
  static get relationMappings() {
    return {
      quiz: {
        relation: Model.HasManyRelation,
        modelClass: Quiz,
        join: {
          from: "admin.id",
          to: "quiz.author_id",
        },
      },
    };
  }
}
export default Admin;
