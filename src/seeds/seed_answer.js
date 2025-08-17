export async function seed(knex) {
  await knex("answer").del();

  await knex("answer").insert([
    {
      id: 1,
      question_id: 1,
      answer_nl: "Een dolfijn heeft geen oren.",
      answer_en: "A dolphin has no ears.",
      answer_fr: "Un dauphin n'a pas d'oreilles.",
      is_true: false,
    },
    {
      id: 2,
      question_id: 1,
      answer_nl: "Een dolfijn heeft wel oren maar geen uitwendige oorschelpen.",
      answer_en: "A dolphin has ears but no external ear flaps.",
      answer_fr: "Un dauphin a des oreilles mais pas de pavillons externes.",
      is_true: true,
    },
    {
      id: 3,
      question_id: 1,
      answer_nl: "Een dolfijn heeft wel oren en uitwendige oorschelpen.",
      answer_en: "A dolphin has ears and external ear flaps.",
      answer_fr: "Un dauphin a des oreilles et des pavillons externes.",
      is_true: false,
    },
    {
      id: 4,
      question_id: 1,
      answer_nl: "Hier weet ik niks over.",
      answer_en: "I don't know anything about this.",
      answer_fr: "Je ne sais rien à ce sujet.",
      is_true: false,
    },
    {
      id: 5,
      question_id: 2,
      answer_nl:
        "Lichtstralen zeer gevoelig kunnen oppikken zodat ze heel goed kunnen zien in donker water.",
      answer_en:
        "They can pick up light rays very sensitively so they can see well in dark water.",
      answer_fr:
        "Ils peuvent capter très sensiblement les rayons lumineux pour bien voir dans l'eau sombre.",
      is_true: false,
    },
    {
      id: 6,
      question_id: 2,
      answer_nl:
        "Bepaalde frequenties in geluidsgolven horen dat mensen niet kunnen horen.",
      answer_en:
        "They hear certain frequencies in sound waves that humans cannot hear.",
      answer_fr:
        "Ils entendent certaines fréquences dans les ondes sonores que les humains ne peuvent pas entendre.",
      is_true: false,
    },
    {
      id: 7,
      question_id: 2,
      answer_nl:
        "Geluidjes uitsturen die botsen op prooi en terugkomen zodat een dolfijn kan zien zonder geluid.",
      answer_en:
        "Sending out sounds that bounce off prey and return so a dolphin can 'see' without sight.",
      answer_fr:
        "Émettre des sons qui rebondissent sur la proie et reviennent pour que le dauphin puisse 'voir' sans la vue.",
      is_true: true,
    },
    {
      id: 8,
      question_id: 2,
      answer_nl: "Dat weet ik niet",
      answer_en: "I don't know",
      answer_fr: "Je ne sais pas",
      is_true: false,
    },
    {
      id: 9,
      question_id: 3,
      answer_nl: "Ja, ze is graag alleen.",
      answer_en: "Yes, she likes to be alone.",
      answer_fr: "Oui, elle aime être seule.",
      is_true: false,
    },
    {
      id: 10,
      question_id: 3,
      answer_nl: "Neen, ze leeft in groepen.",
      answer_en: "No, she lives in groups.",
      answer_fr: "Non, elle vit en groupes.",
      is_true: true,
    },
    {
      id: 11,
      question_id: 3,
      answer_nl: "Dat weet ik niet.",
      answer_en: "I don't know.",
      answer_fr: "Je ne sais pas.",
      is_true: false,
    },
    {
      id: 12,
      question_id: 4,
      answer_nl: "Ja, zowel in de borstvinnen, rugvin als staartvin.",
      answer_en: "Yes, both in the pectoral fins, dorsal fin, and tail fin.",
      answer_fr:
        "Oui, à la fois dans les nageoires pectorales, la nageoire dorsale et la nageoire caudale.",
      is_true: false,
    },
    {
      id: 13,
      question_id: 4,
      answer_nl: "Enkel in de staartvin",
      answer_en: "Only in the tail fin",
      answer_fr: "Uniquement dans la nageoire caudale",
      is_true: false,
    },
    {
      id: 14,
      question_id: 4,
      answer_nl: "Enkel in de rugvin",
      answer_en: "Only in the dorsal fin",
      answer_fr: "Uniquement dans la nageoire dorsale",
      is_true: false,
    },
    {
      id: 15,
      question_id: 4,
      answer_nl: "Enkel in de borstvinnen",
      answer_en: "Only in the pectoral fins",
      answer_fr: "Uniquement dans les nageoires pectorales",
      is_true: true,
    },
    {
      id: 16,
      question_id: 5,
      answer_nl:
        "De mannetjes hebben langere sierlijke vinnen dan de vrouwtjes.",
      answer_en: "Males have longer, more ornate fins than females.",
      answer_fr:
        "Les mâles ont des nageoires plus longues et plus ornées que les femelles.",
      is_true: false,
    },
    {
      id: 17,
      question_id: 5,
      answer_nl: "De mannetjes hebben een donkerdere kleur dan de vrouwtjes",
      answer_en: "Males have a darker color than females",
      answer_fr: "Les mâles ont une couleur plus foncée que les femelles",
      is_true: false,
    },
    {
      id: 18,
      question_id: 5,
      answer_nl:
        "De mannetjes hebben 2 spleetjes op de buik, de vrouwtjes maar 1.",
      answer_en: "Males have 2 slits on the belly, females only 1.",
      answer_fr:
        "Les mâles ont 2 fentes sur le ventre, les femelles n'en ont qu'une.",
      is_true: false,
    },
    {
      id: 19,
      question_id: 5,
      answer_nl: "De mannetjes hebben 1 spleetje op de buik, de vrouwtjes 2",
      answer_en: "Males have 1 slit on the belly, females 2.",
      answer_fr: "Les mâles ont 1 fente sur le ventre, les femelles 2.",
      is_true: true,
    },
    {
      id: 20,
      question_id: 6,
      answer_nl: "Ja",
      answer_en: "Yes",
      answer_fr: "Oui",
      is_true: true,
    },

    {
      id: 21,
      question_id: 6,
      answer_nl: "Neen",
      answer_en: "No",
      answer_fr: "Non",
      is_true: false,
    },
    {
      id: 22,
      question_id: 6,
      answer_nl: "Dat weet ik niet",
      answer_en: "I don't know",
      answer_fr: "Je ne sais pas",
      is_true: true,
    },
    {
      id: 23,
      question_id: 7,
      answer_nl:
        "Lichtstralen zeer gevoelig kunnen oppikken zodat ze heel goed kunnen zien in donker water",
      answer_en:
        "They can pick up light rays very sensitively so they can see well in dark water",
      answer_fr:
        "Ils peuvent capter les rayons lumineux très sensibles afin de bien voir dans l'eau sombre",
      is_true: false,
    },
    {
      id: 24,
      question_id: 7,
      answer_nl:
        "Bepaalde frequenties in geluidsgolven horen dat mensen niet kunnen horen",
      answer_en:
        "They hear certain frequencies in sound waves that humans cannot hear",
      answer_fr:
        "Ils entendent certaines fréquences dans les ondes sonores que les humains ne peuvent pas entendre",
      is_true: false,
    },
    {
      id: 25,
      question_id: 7,
      answer_nl:
        "Geluidjes uitsturen die botsen op een prooi en teruggkomen zodat een dolfijn kan zien zonder geluid",
      answer_en:
        "Sending out sounds that bounce off prey and return so a dolphin can 'see' without sight",
      answer_fr:
        "Émettre des sons qui rebondissent sur une proie et reviennent afin qu'un dauphin puisse 'voir' sans la vue",
      is_true: true,
    },
    {
      id: 26,
      question_id: 7,
      answer_nl: "Dat weet ik niet",
      answer_en: "I don't know",
      answer_fr: "Je ne sais pas",
      is_true: false,
    },
    {
      id: 27,
      question_id: 8,
      answer_nl: "Ja, ze is graag alleen.",
      answer_en: "Yes, she likes to be alone.",
      answer_fr: "Oui, elle aime être seule.",
      is_true: false,
    },
    {
      id: 28,
      question_id: 8,
      answer_nl: "Neen, ze leeft in groepen",
      answer_en: "No, she lives in groups.",
      answer_fr: "Non, elle vit en groupes.",
      is_true: true,
    },
    {
      id: 29,
      question_id: 8,
      answer_nl: "Dat weet ik niet",
      answer_en: "I don't know",
      answer_fr: "Je ne sais pas",
      is_true: false,
    },
    {
      id: 30,
      question_id: 9,
      answer_nl: "Ja, zowel in de borstvinnen, rugvin als staartvin",
      answer_en: "Yes, both in the pectoral fins, dorsal fin and tail fin",
      answer_fr:
        "Oui, à la fois dans les nageoires pectorales, la nageoire dorsale et la nageoire caudale",
      is_true: false,
    },
    {
      id: 31,
      question_id: 9,
      answer_nl: "Enkel in de staartvin",
      answer_en: "Only in the tail fin",
      answer_fr: "Uniquement dans la nageoire caudale",
      is_true: false,
    },
    {
      id: 32,
      question_id: 9,
      answer_nl: "Enkel in de rugvin",
      answer_en: "Only in the dorsal fin",
      answer_fr: "Uniquement dans la nageoire dorsale",
      is_true: false,
    },
    {
      id: 33,
      question_id: 9,
      answer_nl: "Enkel in de borstvinnen",
      answer_en: "Only in the pectoral fins",
      answer_fr: "Uniquement dans les nageoires pectorales",
      is_true: true,
    },
    {
      id: 34,
      question_id: 10,
      answer_nl:
        "De mannetjes hebben langere sierlijkere vinnen dan de vrouwtjes",
      answer_en: "Males have longer, more ornate fins than females.",
      answer_fr:
        "Les mâles ont des nageoires plus longues et plus ornées que les femelles.",
      is_true: false,
    },
    {
      id: 35,
      question_id: 10,
      answer_nl: "De mannetjes hebben een donkerdere kleur dan de vrouwtjes",
      answer_en: "Males have a darker color than females.",
      answer_fr: "Les mâles ont une couleur plus foncée que les femelles.",
      is_true: false,
    },
    {
      id: 36,
      question_id: 10,
      answer_nl:
        "De mannetjes hebben 2 spleetjes op de buik, de vrouwtjes maar 1.",
      answer_en: "Males have 2 slits on the belly, females only 1.",
      answer_fr:
        "Les mâles ont 2 fentes sur le ventre, les femelles n'en ont qu'une.",
      is_true: false,
    },
    {
      id: 37,
      question_id: 10,
      answer_nl: "De mannetjes hebben 1 spleetje op de buik, de vrouwtjes 2.",
      answer_en: "Males have 1 slit on the belly, females 2.",
      answer_fr: "Les mâles ont 1 fente sur le ventre, les femelles 2.",
      is_true: true,
    },
  ]);
}
