let currentQuestion = 0;
const answers = {};

function renderQuestion(index) {
  const question = questions[index];
  const container = document.getElementById("question__container");
  container.innerHTML = `
  <img class="question__image" src="http://localhost:3001/assets/images/${
    question.image_url
  }" alt="Question Image" />
    <h3 class="question__title" data-questionid="${question.id}">${
    question.question_text
  }</h3>
    <div class="question__answers">
      ${question.answers
        .map(
          (answer) => `
        <label class="answer__label">
          <input class="answer__btn"
            type="radio"
            name="question-${question.id}"
            value="${answer.id}"
            data-questionid="${question.id}"
            ${answers[question.id] == answer.id ? "checked" : ""}
          />
          ${answer.answer_text}
        </label>
      `
        )
        .join("")}
    </div>
  `;
  document.getElementById("prevQuestion").style.display =
    index > 0 ? "inline-block" : "none";
  document.getElementById("nextQuestion").style.display =
    index < questions.length - 1 ? "inline-block" : "none";
  document.getElementById("sendAnswers").style.display =
    index === questions.length - 1 ? "inline-block" : "none";
}

function saveAnswer() {
  const question = questions[currentQuestion];
  const selected = document.querySelector(
    `input[name="question-${question.id}"]:checked`
  );
  if (selected) {
    answers[question.id] = Number(selected.value);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderQuestion(currentQuestion);

  document.getElementById("nextQuestion").addEventListener("click", () => {
    saveAnswer();
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      renderQuestion(currentQuestion);
    }
  });

  document.getElementById("prevQuestion").addEventListener("click", () => {
    saveAnswer();
    if (currentQuestion > 0) {
      currentQuestion--;
      renderQuestion(currentQuestion);
    }
  });

  document
    .getElementById("question__container")
    .addEventListener("change", saveAnswer);

  document.getElementById("sendAnswers").addEventListener("click", async () => {
    saveAnswer();
    const quizId = document.getElementById("sendAnswers").dataset.quizid;
    const sessionId = document.getElementById("sendAnswers").dataset.sessionid;

    const answersArray = Object.entries(answers).map(
      ([question_id, answer_id]) => ({
        session_id: Number(sessionId),
        question_id: Number(question_id),
        answer_id: Number(answer_id),
      })
    );

    try {
      const response = await fetch("/answer-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quiz_id: quizId,
          answers: answersArray,
          session_id: sessionId,
          user_id: user_id,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        alert("Fout bij opslaan: " + result.error);
        return;
      }

      if (quizId == 1) {
        try {
          const resp = await fetch("/second-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: user_id, quiz_id: 2 }),
          });
          if (resp.ok) {
            window.location.href = "/login";
          } else {
            const error = await resp.json();
            alert("Fout bij tweede sessie: " + error.error);
          }
        } catch (err) {
          alert("Netwerkfout bij tweede sessie!");
        }
      } else if (quizId == 2) {
        try {
          const resp = await fetch("/endSession", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: user_id, moment: "second try" }),
          });
          if (resp.ok) {
            window.location.href = `/quiz/${quizId}/feedback/${user_id}`;
          } else {
            const error = await resp.json();
            alert("Fout bij einde sessie: " + error.error);
          }
        } catch (err) {
          alert("Netwerkfout bij einde sessie!");
        }
      } else {
        alert("Answers submitted successfully!");
      }
    } catch (err) {
      console.error("Fout bij fetch:", err);
      alert("Netwerkfout bij antwoorden doorsturen!");
    }
  });
});
