document
  .getElementById("imageForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const response = await fetch("/admin/photos", {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      alert("Image updated!");
      closeImageModal();
      if (typeof loadQuestions === "function") {
        loadQuestions();
      }
    } else {
      alert("Error updating image.");
    }
  });
