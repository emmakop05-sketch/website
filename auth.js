let users = JSON.parse(localStorage.getItem("users")) || [
    { username: "admin", password: "admin123", role: "admin" }
];

// SIGNUP
function signup() {
    const username = document.getElementById("signupUser").value;
    const password = document.getElementById("signupPass").value;

    if (!username || !password) return alert("Fill all fields");

    users.push({
        username,
        password,
        role: "user"
    });

    localStorage.setItem("users", JSON.stringify(users));
    alert("Account created!");
    window.location.href = "login.html";
}

// LOGIN
function login() {
    const username = document.getElementById("loginUser").value;
    const password = document.getElementById("loginPass").value;

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) return alert("Invalid login");

    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "index.html";
}