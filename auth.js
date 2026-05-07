let users = JSON.parse(localStorage.getItem("users")) || [
{
username:"admin",
password:"admin123",
role:"admin"
}
];

function signup(){

const username =
document.getElementById("signupUser").value;

const password =
document.getElementById("signupPass").value;

if(!username || !password){
alert("Fill all fields");
return;
}

const exists = users.find(
u => u.username === username
);

if(exists){
alert("User already exists");
return;
}

users.push({
username,
password,
role:"user"
});

localStorage.setItem(
"users",
JSON.stringify(users)
);

alert("Account created");

window.location.href = "login.html";
}

function login(){

const username =
document.getElementById("loginUser").value;

const password =
document.getElementById("loginPass").value;

const user = users.find(
u => u.username === username &&
u.password === password
);

if(!user){
alert("Invalid login");
return;
}

localStorage.setItem(
"currentUser",
JSON.stringify(user)
);

window.location.href = "index.html";
}