const form = document.querySelector("#account-update-form");
const accountForm = document.getElementById("account-update-form");

form.addEventListener("change", () => {
  const updateBtn = document.querySelector("button");
  updateBtn.removeAttribute("disabled");
});
