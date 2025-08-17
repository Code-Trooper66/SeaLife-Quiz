const tableName = "quiz";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.string("title");
    table.string("description");
    table
      .integer("author_id")
      .unsigned()
      .references("id")
      .inTable("admin")
      .onDelete("CASCADE");
    table.boolean("is_active");
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}
