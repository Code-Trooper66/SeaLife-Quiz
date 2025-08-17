const tableName = "admin";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("email").notNullable();
    table.string("password").notNullable();
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}
