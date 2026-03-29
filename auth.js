// GET USERS
let users = JSON.parse(localStorage.getItem("users")) || [
    { username: "admin", password: "admin123", role: "admin" }
];

// ================= SIGN UP =================
function signupUser() {
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;

    if (!username || !password) {
        alert("Fill all fields!");
        return;
    }

    // Check if user exists
    const exists = users.find(user => user.username === username);
    if (exists) {
        alert("User already exists!");
        return;
    }

    // Add new user
    users.push({
        username: username,
        password: password,
        role: "user"
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created! Please login.");
    window.location.href = "login.html";
}

// ================= LOGIN =================
function loginUser() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const user = users.find(
        u => u.username === username && u.password === password
    );

    if (!user) {
        alert("Invalid login!");
        return;
    }

    // SAVE SESSION
    localStorage.setItem("currentUser", JSON.stringify(user));

    // GO TO APP
    window.location.href = "index.html";
}