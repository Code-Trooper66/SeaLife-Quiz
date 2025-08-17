export async function seed(knex) {
  await knex("session").del();
  await knex("session").insert([
    {
      id: 1,
      user_id: 1,
      quiz_id: 1,
      age: 25,
      moment: "first try",
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      user_id: 3,
      quiz_id: 1,
      age: 25,
      moment: "second try",
      created_at: new Date().toISOString(),
    },
  ]);
}
