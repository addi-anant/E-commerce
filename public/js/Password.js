const token = window.location.href.split("/")[5];
document
  .querySelector(".forgot")
  .setAttribute("action", `/auth/new-password/${token}`);
