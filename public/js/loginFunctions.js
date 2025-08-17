let selectedUserId = null;

async function loadActiveUsers() {
  const res = await fetch("/active-users");
  const users = await res.json();
  const active = document.getElementById("active-users__list");
  active.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = user.firstname + " " + user.lastname;
    li.style.cursor = "pointer";
    li.dataset.userid = user.id;
    li.className = "active-user__item";
    li.addEventListener("click", () => {
      selectedUserId = user.id;
      document.getElementById("pincodeModal").style.display = "block";
      document.getElementById("modalPincode").value = "";
      document.getElementById("pincodeError").textContent = "";
    });
    active.appendChild(li);
  });
}

document.getElementById("closeModal").onclick = function () {
  document.getElementById("pincodeModal").style.display = "none";
};

document.getElementById("submitPincode").onclick = async function () {
  const pincode = document.getElementById("modalPincode").value;
  if (!/^\d{4}$/.test(pincode)) {
    document.getElementById("pincodeError").textContent =
      "Pincode must be 4 digits.";
    return;
  }
  const res = await fetch(
    `/validate-pincode?user_id=${selectedUserId}&pincode=${pincode}`
  );
  const result = await res.json();
  if (result.valid) {
    window.location.href = `/quiz/2?user_id=${selectedUserId}`;
  } else {
    document.getElementById("pincodeError").textContent = "Incorrect pincode.";
  }
};

loadActiveUsers();
