const tableName = "question";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table
      .integer("quiz_id")
      .references("id")
      .inTable("quiz")
      .onDelete("CASCADE");
    table.string("question_nl");
    table.string("question_en");
    table.string("question_fr");
    table.string("image_url");
    table.boolean("is_active");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}
