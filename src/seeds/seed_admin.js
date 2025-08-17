export async function seed(knex) {
  await knex("admin").del();
  await knex("admin").insert([
    {
      id: 1,
      name: "Admin1",
      email: "admin1@example.com",
      password: "password",
    },
  ]);
}
