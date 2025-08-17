const tableName = "answer";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table
      .integer("question_id")
      .references("id")
      .inTable("question")
      .onDelete("CASCADE");
    table.string("answer_nl");
    table.string("answer_en");
    table.string("answer_fr");
    table.boolean("is_true");
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}
