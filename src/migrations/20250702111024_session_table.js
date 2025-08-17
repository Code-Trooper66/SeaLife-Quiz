const tableName = "session";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    table
      .integer("quiz_id")
      .unsigned()
      .references("id")
      .inTable("quiz")
      .onDelete("CASCADE");
    table.integer("age");
    table.string("moment");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}
