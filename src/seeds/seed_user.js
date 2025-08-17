export async function seed(knex) {
  await knex("user").del();
  await knex("user").insert([
    {
      id: 1,
      firstname: "Alice",
      lastname: "Smith",
      birthday: "2000-01-01",
      pincode: "1234",
      feedback: "De quiz was leuk.",
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      firstname: "Bob",
      lastname: "Jones",
      birthday: "1995-05-15",
      pincode: "5678",
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      firstname: "Jana",
      lastname: "Dekyser",
      birthday: "1995-05-15",
      pincode: "9012",
      feedback: "oke quiz.",
      created_at: new Date().toISOString(),
    },
  ]);
}
