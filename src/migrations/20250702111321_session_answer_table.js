const tableName = "session_answer";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table
      .integer("session_id")
      .unsigned()
      .references("id")
      .inTable("session")
      .onDelete("CASCADE");
    table
      .integer("question_id")
      .unsigned()
      .references("id")
      .inTable("quiz")
      .onDelete("CASCADE");
    table
      .integer("answer_id")
      .unsigned()
      .references("id")
      .inTable("quiz")
      .onDelete("CASCADE");
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}
