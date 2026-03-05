// ==========================
// UTILITIES
// ==========================

function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function generateAccountNumber() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

function getCurrentUser() {
  const email = localStorage.getItem("loggedInUser");
  if (!email) return null;

  const users = getUsers();
  return users.find(user => user.email === email);
}

function updateUser(updatedUser) {
  let users = getUsers();

  users = users.map(user =>
    user.email === updatedUser.email ? updatedUser : user
  );

  saveUsers(users);
}

// ==========================
// SIGN UP
// ==========================

function signup() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  let users = getUsers();

  if (users.find(user => user.email === email)) {
    alert("User already exists!");
    return;
  }

  const newUser = {
    email: email,
    password: password,
    accountNumber: generateAccountNumber(),
    balance: 0,
    transactions: []
  };

  users.push(newUser);
  saveUsers(users);

  alert("Account created successfully!");
  window.location.href = "index.html";
}

// ==========================
// LOGIN
// ==========================

function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  const users = getUsers();

  const validUser = users.find(user =>
    user.email === email && user.password === password
  );

  if (validUser) {
    localStorage.setItem("loggedInUser", email);
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid email or password");
  }
}

// ==========================
// DASHBOARD LOAD
// ==========================

function loadDashboard() {
  const user = getCurrentUser();

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("balance").innerText = "₦" + user.balance;
  document.getElementById("accountNumber").innerText = user.accountNumber;

  renderTransactions();
}

// ==========================
// TRANSACTIONS
// ==========================

function renderTransactions() {
  const user = getCurrentUser();
  const history = document.getElementById("history");

  if (!history || !user) return;

  history.innerHTML = "";

  user.transactions
    .slice()
    .reverse()
    .forEach(tx => {
      history.innerHTML += `
        <div class="transaction">
          <strong>${tx.type}</strong> - ₦${tx.amount}
          <br>
          <small>${tx.date}</small>
        </div>
      `;
    });
}

// ==========================
// DEPOSIT
// ==========================

function deposit() {
  const amount = parseFloat(document.getElementById("amount").value);

  if (!amount || amount <= 0) {
    alert("Enter valid amount");
    return;
  }

  let user = getCurrentUser();

  user.balance += amount;

  user.transactions.push({
    type: "Deposit",
    amount: amount,
    date: new Date().toLocaleString()
  });

  updateUser(user);
  loadDashboard();
}

// ==========================
// WITHDRAW
// ==========================

function withdraw() {
  const amount = parseFloat(document.getElementById("amount").value);

  if (!amount || amount <= 0) {
    alert("Enter valid amount");
    return;
  }

  let user = getCurrentUser();

  if (amount > user.balance) {
    alert("Insufficient funds!");
    return;
  }

  user.balance -= amount;

  user.transactions.push({
    type: "Withdraw",
    amount: amount,
    date: new Date().toLocaleString()
  });

  updateUser(user);
  loadDashboard();
}

// ==========================
// LOGOUT
// ==========================

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

// ==========================
// DARK MODE
// ==========================

function toggleDarkMode() {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}

function loadTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark");
  }
}

// ==========================
// AUTO LOAD
// ==========================

window.onload = function () {
  if (document.getElementById("balance")) {
    loadDashboard();
  }
  loadTheme();
};
