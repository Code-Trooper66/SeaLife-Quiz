let quizzesData = [];
let selectedQuizId = null;
let selectedVraagId = null;
let selectedAnswerId = null;

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = "block";
  modal.classList.remove("hidden");
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = "none";
  modal.classList.add("hidden");
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    ["addAnswerModal", "answerModal", "imageModal", "quizModal", "addQuestionModal", "questionModal"].forEach(closeModal);
  }
});

document.querySelectorAll(".quiz__modal").forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target.classList.contains("quiz__modal")) {
      closeModal(modal.id);
    }
  });
});

async function loadQuizzes() {
  try {
    const res = await fetch("/quizzes");
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    quizzesData = await res.json();

  const quizSelect = document.getElementById("quizSelect");
  quizSelect.innerHTML = "";

  quizzesData.forEach((quiz) => {
    const option = document.createElement("option");
    option.value = quiz.id;
    option.textContent = quiz.title;
    quizSelect.appendChild(option);
  });

  if (quizzesData.length > 0) {
    selectedQuizId = quizzesData[0].id;
    quizSelect.value = selectedQuizId;
    enableQuizControls(true);
    loadQuestionsFromQuiz();
  } else {
    selectedQuizId = null;
    enableQuizControls(false);
    clearQuestions();
    clearAnswers();
  }
  } catch (error) {
    console.error("Error loading quizzes:", error);
    alert("Error loading quizzes. Please try again.");
  }
}

function enableQuizControls(enabled) {
  document.getElementById("editQuizBtn").disabled = !enabled;
  document.getElementById("deleteQuizBtn").disabled = !enabled;
  const questionSelect = document.getElementById("questionSelect");
  questionSelect.disabled = !enabled;
  document.getElementById("addAnswerBtn").disabled = !enabled;
  document.getElementById("editAnswerBtn").disabled = true;
  document.getElementById("deleteAnswerBtn").disabled = true;
}

function loadQuestionsFromQuiz() {
  const quiz = quizzesData.find((q) => q.id == selectedQuizId);
  const questions = quiz?.questions || [];

  const questionSelect = document.getElementById("questionSelect");
  questionSelect.innerHTML = "";

  questions.forEach((vraag) => {
    const option = document.createElement("option");
    option.value = vraag.id;
    option.textContent = vraag.question_nl || "(Geen tekst)";
    questionSelect.appendChild(option);
  });

  if (questions.length > 0) {
    selectedVraagId = questions[0].id;
    questionSelect.value = selectedVraagId;
    document.getElementById("editQuestionBtn").disabled = false;
    loadAnswersFromQuestion();
  } else {
    selectedVraagId = null;
    document.getElementById("editQuestionBtn").disabled = true;
    clearAnswers();
  }
}

function clearQuestions() {
  const questionSelect = document.getElementById("questionSelect");
  questionSelect.innerHTML = "";
  questionSelect.disabled = true;
  document.getElementById("editQuestionBtn").disabled = true;
  selectedVraagId = null;
  clearAnswers();
}

function loadAnswersFromQuestion() {
  const quiz = quizzesData.find((q) => q.id == selectedQuizId);
  const vraag = quiz?.questions.find((v) => v.id == selectedVraagId);
  const answers = vraag?.answer || [];

  const answerSelect = document.getElementById("answerSelect");
  answerSelect.innerHTML = "";

  answers.forEach((answer) => {
    const option = document.createElement("option");
    option.value = answer.id;
    option.textContent = answer.answer_nl || "(Geen antwoord)";
    answerSelect.appendChild(option);
  });

  if (answers.length > 0) {
    selectedAnswerId = answers[0].id;
    answerSelect.value = selectedAnswerId;
    answerSelect.disabled = false;
    document.getElementById("editAnswerBtn").disabled = false;
    document.getElementById("deleteAnswerBtn").disabled = false;
  } else {
    clearAnswers();
  }
}

function clearAnswers() {
  const answerSelect = document.getElementById("answerSelect");
  answerSelect.innerHTML = "";
  answerSelect.disabled = true;
  document.getElementById("editAnswerBtn").disabled = true;
  document.getElementById("deleteAnswerBtn").disabled = true;
  selectedAnswerId = null;
}

document.getElementById("quizSelect").addEventListener("change", (e) => {
  selectedQuizId = e.target.value;
  enableQuizControls(!!selectedQuizId);
  loadQuestionsFromQuiz();
});

document.getElementById("questionSelect").addEventListener("change", (e) => {
  selectedVraagId = e.target.value;
  loadAnswersFromQuestion();
});

document.getElementById("answerSelect").addEventListener("change", (e) => {
  selectedAnswerId = e.target.value;
  document.getElementById("editAnswerBtn").disabled = !selectedAnswerId;
  document.getElementById("deleteAnswerBtn").disabled = !selectedAnswerId;
});

function openAddAnswerModal() {
  if (!selectedVraagId) {
    alert("Please select a question first.");
    return;
  }
  document.getElementById("add_answer_nl").value = "";
  document.getElementById("add_answer_en").value = "";
  document.getElementById("add_answer_fr").value = "";
  document.getElementById("add_correct_answer").checked = false;
  openModal("addAnswerModal");
}

function closeAddAnswerModal() {
  closeModal("addAnswerModal");
}

document
  .getElementById("addAnswerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!selectedVraagId) {
      alert("Please select a question first.");
      return;
    }

    const answer_nl = document.getElementById("add_answer_nl").value.trim();
    const answer_en = document.getElementById("add_answer_en").value.trim();
    const answer_fr = document.getElementById("add_answer_fr").value.trim();
    const is_correct = document.getElementById("add_correct_answer").checked;

    if (!answer_nl) {
      alert("Please enter the Dutch answer text.");
      return;
    }

    const response = await fetch(`/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_id: parseInt(selectedVraagId, 10),
        answer_nl,
        answer_en,
        answer_fr,
        is_true: is_correct,
      }),
    });

    if (response.ok) {
      closeAddAnswerModal();
      await loadQuizzes();
    } else {
      alert("Error creating answer. Please try again.");
    }
  });

function openEditAnswerModal() {
  if (!selectedAnswerId) return;

  const quiz = quizzesData.find((q) => q.id == selectedQuizId);
  const vraag = quiz?.questions.find((v) => v.id == selectedVraagId);
  const answer = vraag?.answer.find((a) => a.id == selectedAnswerId);

  if (!answer) return;

  document.getElementById("answer_id").value = answer.id;
  document.getElementById("answer_nl").value = answer.answer_nl || "";
  document.getElementById("answer_en").value = answer.answer_en || "";
  document.getElementById("answer_fr").value = answer.answer_fr || "";
  document.getElementById("correct_answer").checked = !!answer.is_true;

  openModal("answerModal");
}

function closeAnswerModal() {
  closeModal("answerModal");
}

document.getElementById("answerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const answer_id = document.getElementById("answer_id").value;
  const answer_nl = document.getElementById("answer_nl").value.trim();
  const answer_en = document.getElementById("answer_en").value.trim();
  const answer_fr = document.getElementById("answer_fr").value.trim();
  const is_correct = document.getElementById("correct_answer").checked;

  if (!answer_nl) {
    alert("Please enter the Dutch answer text.");
    return;
  }

  const response = await fetch(`/answers/${answer_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      answer_nl,
      answer_en,
      answer_fr,
      is_true: is_correct,
    }),
  });

  if (response.ok) {
    closeAnswerModal();
    await loadQuizzes();
  } else {
    alert("Error updating answer. Please try again.");
  }
});

async function deleteAnswer() {
  if (!selectedAnswerId) return;
  if (!confirm("Are you sure you want to delete this answer?")) return;

  const response = await fetch(`/answers/${selectedAnswerId}`, { method: "DELETE" });
  if (response.ok) {
    await loadQuizzes();
  } else {
    alert("Error deleting answer. Please try again.");
  }
}

function openImageModal() {
  document.getElementById("imageVraagId").value = selectedVraagId;
  openModal("imageModal");
}

function closeImageModal() {
  closeModal("imageModal");
  document.getElementById("imageForm").reset();
}

document.querySelectorAll(".modal .modal-close").forEach((btn) =>
  btn.addEventListener("click", (e) => {
    const modal = btn.closest(".modal");
    if (modal) closeModal(modal.id);
  })
);

loadQuizzes();

function openAddQuizModal() {
  document.getElementById("quiz_id").value = "";
  document.getElementById("quiz_title").value = "";
  document.getElementById("quiz_description").value = "";
  document.getElementById("quiz_active").checked = true;
  document.getElementById("saveQuizBtn").textContent = "Opslaan";
  openModal("quizModal");
}

function openEditQuizModal() {
  if (!selectedQuizId) return;

  const quiz = quizzesData.find((q) => q.id == selectedQuizId);
  if (!quiz) return;

  document.getElementById("quiz_id").value = quiz.id;
  document.getElementById("quiz_title").value = quiz.title || "";
  document.getElementById("quiz_description").value = quiz.description || "";
  document.getElementById("quiz_active").checked = !!quiz.is_active;
  document.getElementById("saveQuizBtn").textContent = "Update";
  openModal("quizModal");
}

function closeQuizModal() {
  closeModal("quizModal");
}

document.getElementById("quizForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const quiz_id = document.getElementById("quiz_id").value;
  const title = document.getElementById("quiz_title").value.trim();
  const description = document.getElementById("quiz_description").value.trim();
  const is_active = document.getElementById("quiz_active").checked;

  if (!title) {
    alert("Please enter a quiz title.");
    return;
  }

  const isEdit = !!quiz_id;
  const url = isEdit ? `/quizzes/${quiz_id}` : `/quizzes`;
  const method = isEdit ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      description,
      is_active,
      // TODO: Get actual logged-in admin ID
      author_id: 1,
    }),
  });

  if (response.ok) {
    closeQuizModal();
    await loadQuizzes();
  } else {
    alert("Error saving quiz.");
  }
});

async function deleteQuiz() {
  if (!selectedQuizId) return;
  if (
    !confirm(
      "Are you sure you want to delete this quiz? This will also delete all questions and answers."
    )
  )
    return;

  const response = await fetch(`/quizzes/${selectedQuizId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    await loadQuizzes();
  } else {
    alert("Error deleting quiz.");
  }
}

function openAddQuestionModal() {
  if (!selectedQuizId) {
    alert("Please select a quiz first.");
    return;
  }
  document.getElementById("add_vraag_nl").value = "";
  document.getElementById("add_vraag_en").value = "";
  document.getElementById("add_vraag_fr").value = "";
  openModal("addQuestionModal");
}

function closeAddQuestionModal() {
  closeModal("addQuestionModal");
}

document
  .getElementById("addQuestionForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!selectedQuizId) {
      alert("Please select a quiz first.");
      return;
    }

    const question_nl = document.getElementById("add_vraag_nl").value.trim();
    const question_en = document.getElementById("add_vraag_en").value.trim();
    const question_fr = document.getElementById("add_vraag_fr").value.trim();

    if (!question_nl) {
      alert("Please enter the Dutch question text.");
      return;
    }

    const response = await fetch(`/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quiz_id: parseInt(selectedQuizId, 10),
        question_nl,
        question_en,
        question_fr,
        is_active: true,
      }),
    });

    if (response.ok) {
      closeAddQuestionModal();
      await loadQuizzes();
    } else {
      alert("Error creating question.");
    }
  });

function openEditQuestionModal() {
  if (!selectedVraagId) return;

  const quiz = quizzesData.find((q) => q.id == selectedQuizId);
  const vraag = quiz?.questions.find((v) => v.id == selectedVraagId);

  if (!vraag) return;

  document.getElementById("vraag_id").value = vraag.id;
  document.getElementById("vraag_nl").value = vraag.question_nl || "";
  document.getElementById("vraag_en").value = vraag.question_en || "";
  document.getElementById("vraag_fr").value = vraag.question_fr || "";
  openModal("questionModal");
}

function closeQuestionModal() {
  closeModal("questionModal");
}

document
  .getElementById("questionForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const vraag_id = document.getElementById("vraag_id").value;
    const question_nl = document.getElementById("vraag_nl").value.trim();
    const question_en = document.getElementById("vraag_en").value.trim();
    const question_fr = document.getElementById("vraag_fr").value.trim();

    if (!question_nl) {
      alert("Please enter the Dutch question text.");
      return;
    }

    const response = await fetch(`/questions/${vraag_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_nl,
        question_en,
        question_fr,
        is_active: true,
      }),
    });

    if (response.ok) {
      closeQuestionModal();
      await loadQuizzes();
    } else {
      alert("Error updating question.");
    }
  });

async function deleteQuestion() {
  if (!selectedVraagId) return;
  if (
    !confirm(
      "Are you sure you want to delete this question? This will also delete all answers."
    )
  )
    return;

  const response = await fetch(`/questions/${selectedVraagId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    await loadQuizzes();
  } else {
    alert("Error deleting question.");
  }
}

async function exportToExcel() {
  const period = document.getElementById("periodSelect").value;
  window.location.href = `/admin/export?period=${period}`;
}
