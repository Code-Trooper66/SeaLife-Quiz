import knex from "../lib/Knex.js";
import { Model } from "objection";
import Session from "./Session.js";

Model.knex(knex);

class User extends Model {
  static get tableName() {
    return "user";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["firstname", "lastname", "birthday", "pincode"],
      properties: {
        id: { type: "integer" },
        firstname: { type: "string" },
        lastname: { type: "string" },
        birthday: { type: "string", format: "date" },
        pincode: { type: "string", minLength: 4, maxLength: 4 },
        feedback: { type: "string" },
        created_at: { type: "string", format: "date-time" },
      },
    };
  }
  static get relationMappings() {
    return {
      session: {
        relation: Model.HasManyRelation,
        modelClass: Session,
        join: {
          from: "user.id",
          to: "session.user_id",
        },
      },
    };
  }
}
export default User;
