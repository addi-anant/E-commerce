const clientInfo = document.getElementById("client-info");
const clientError = document.getElementById("client-error");

// LOGIN HANDLER:
document.getElementById("login-btn")?.addEventListener("click", async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const response = await fetch(`/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email: email, password: password }),
    headers: { "Content-Type": "application/json" },
  });

  response.status === 200 && window.location.replace("/");

  clientError.innerText =
    response.status === 400
      ? "All Fields are required"
      : response.status === 401
      ? "Email Not Verified"
      : response.status === 404
      ? "Invalid username or password"
      : "";
});

// REGISTER HANDLER:
document.getElementById("register-btn")?.addEventListener("click", async () => {
  const name = document.getElementById("register-name").value;
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  const response = await fetch(`/auth/register`, {
    method: "POST",
    body: JSON.stringify({ name: name, email: email, password: password }),
    headers: { "Content-Type": "application/json" },
  });

  clientInfo.innerText =
    response.status === 200
      ? "Link sent for verification, Check Your Email!"
      : "";

  clientError.innerText =
    response.status === 400
      ? "All Fields are required"
      : response.status === 401
      ? "Email Already in use."
      : response.status === 406
      ? "Invalid Password, Follow Password Containts."
      : "";
});

// FORGOT PASSWORD HANDLER:
document.getElementById("update-btn")?.addEventListener("click", async () => {
  const email = document.getElementById("update-email").value;

  const response = await fetch(`/auth/update-password`, {
    method: "POST",
    body: JSON.stringify({ email: email }),
    headers: { "Content-Type": "application/json" },
  });

  clientInfo.innerText =
    response.status === 200
      ? "Link to update your password sent, Check Your Email!"
      : "";

  clientError.innerText =
    response.status === 400
      ? "All Fields are required"
      : response.status === 404
      ? "No user with provided Email Found."
      : "";
});

// NEW PASSWORD HANDLER:
const token = window.location.href.split("/")[5]; // token.
document.getElementById("new-btn")?.addEventListener("click", async () => {
  const password = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("new-confirmPassword").value;

  const response = await fetch(`/auth/new-password/${token}`, {
    method: "POST",
    body: JSON.stringify({
      password: password,
      confirmPassword: confirmPassword,
    }),
    headers: { "Content-Type": "application/json" },
  });

  response.status === 200 && window.location.replace("/auth/login");

  clientError.innerText =
    response.status === 400
      ? "All Fields are required"
      : response.status === 409
      ? "Passwords donot match."
      : response.status === 406
      ? "Invalid Password, Follow Password Containts."
      : "";
});

// RESET PASSWORD HANDLER:
document.getElementById("new-btn")?.addEventListener("click", async () => {
  const password = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("new-confirmPassword").value;

  const response = await fetch(`/auth/new-password/${token}`, {
    method: "POST",
    body: JSON.stringify({
      password: password,
      confirmPassword: confirmPassword,
    }),
    headers: { "Content-Type": "application/json" },
  });

  response.status === 200 && window.location.replace("/auth/login");

  clientError.innerText =
    response.status === 400
      ? "All Fields are required"
      : response.status === 409
      ? "Passwords donot match."
      : response.status === 406
      ? "Invalid Password, Follow Password Containts."
      : "";
});
