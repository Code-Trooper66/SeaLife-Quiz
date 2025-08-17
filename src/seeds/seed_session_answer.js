export async function seed(knex) {
  await knex("session_answer").del();
  await knex("session_answer").insert([
    {
      id: 1,
      session_id: 1,
      question_id: 1,
      answer_id: 2,
    },
  ]);
}
