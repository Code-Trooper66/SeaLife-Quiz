export async function seed(knex) {
  await knex("quiz").del();
  await knex("quiz").insert([
    {
      id: 1,
      title: "General Knowledge",
      description: "Test your knowledge!",
      author_id: 1,
      is_active: true,
    },
    {
      id: 2,
      title: "Post Quiz",
      description: "See what you learned!",
      author_id: 1,
      is_active: true,
    },
  ]);
}
