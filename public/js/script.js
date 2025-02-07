console.log("static js file loaded");

document.addEventListener("DOMContentLoaded", function () {
    const pswdBtn = document.querySelector("#pswdBtn");
    if (pswdBtn) {
      pswdBtn.addEventListener("click", function () {
        const pswdInput = document.getElementById("pword");
        const type = pswdInput.getAttribute("type");
        if (type === "password") {
          pswdInput.setAttribute("type", "text");
          pswdBtn.innerHTML = "Hide Password";
        } else {
          pswdInput.setAttribute("type", "password");
          pswdBtn.innerHTML = "Show Password";
        }
      });
    }
  });
  