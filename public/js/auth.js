// Embedding token in the 'newPassword' Form:
const token = window.location.href.split("/")[5];
document
  .querySelector(".forgot")
  ?.setAttribute("action", `/auth/new-password/${token}`);

// Logout Functionality:
document.getElementById("logout")?.addEventListener("click", async () => {
  await fetch("/aut/logout");
  window.location.replace("/auth/login");
});
