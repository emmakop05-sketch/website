// LOGOUT FUNCTION
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

// DARK MODE
function toggleDarkMode() {
    document.body.classList.toggle("light");
}

// ================= USER SYSTEM =================
// Get users or create default admin
let users = JSON.parse(localStorage.getItem("users")) || [
    { username: "admin", password: "admin123", role: "admin" }
];

// Get logged in user
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

// Redirect if not logged in
if (!currentUser && !window.location.href.includes("login.html")) {
    window.location.href = "login.html";
}

// ================= LOGOUT =================
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

// ================= INVENTORY =================
let items = JSON.parse(localStorage.getItem("items")) || [];
let editIndex = null;

const form = document.getElementById("item-form");
const list = document.getElementById("item-list");

// ================= SAVE =================
function saveData() {
    localStorage.setItem("items", JSON.stringify(items));
}

// ================= DASHBOARD =================
function updateDashboard() {
    let totalItems = items.length;
    let totalValue = 0;
    let lowStock = 0;

    items.forEach(item => {
        totalValue += item.price * item.quantity;
        if (item.quantity < 5) lowStock++;
    });

    document.getElementById("totalItems").textContent = totalItems;
    document.getElementById("totalValue").textContent = totalValue;
    document.getElementById("lowStock").textContent = lowStock;
}

// ================= DISPLAY =================
function displayItems(data = items) {
    if (!list) return;

    list.innerHTML = "";

    data.forEach((item, index) => {
        let statusClass = item.quantity < 5 ? "status-low" : "status-ok";
        let statusText = item.quantity < 5 ? "Low ⚠️" : "Available ✅";

        // ADMIN ONLY ACTIONS
        let actions = "";
        if (currentUser.role === "admin") {
            actions = `
                <button onclick="editItem(${index})">Edit</button>
                <button onclick="deleteItem(${index})">Delete</button>
            `;
        } else {
            actions = `<span style="opacity:0.5;">No Access</span>`;
        }

        list.innerHTML += `
        <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.price}</td>
            <td>${item.category}</td>
            <td class="${statusClass}">${statusText}</td>
            <td>${actions}</td>
        </tr>`;
    });

    updateDashboard();
}

// ================= ADD / EDIT =================
if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const newItem = {
            name: document.getElementById("name").value,
            quantity: Number(document.getElementById("quantity").value),
            price: Number(document.getElementById("price").value),
            category: document.getElementById("category").value
        };

        if (editIndex === null) {
            items.push(newItem);
        } else {
            items[editIndex] = newItem;
            editIndex = null;
        }

        form.reset();
        saveData();
        displayItems();
    });
}

// ================= DELETE =================
function deleteItem(index) {
    if (currentUser.role !== "admin") {
        alert("Only admin can delete!");
        return;
    }

    items.splice(index, 1);
    saveData();
    displayItems();
}

// ================= EDIT =================
function editItem(index) {
    if (currentUser.role !== "admin") {
        alert("Only admin can edit!");
        return;
    }

    const item = items[index];

    document.getElementById("name").value = item.name;
    document.getElementById("quantity").value = item.quantity;
    document.getElementById("price").value = item.price;
    document.getElementById("category").value = item.category;

    editIndex = index;
}

// ================= SEARCH =================
const searchInput = document.getElementById("search");

if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        const value = e.target.value.toLowerCase();

        const filtered = items.filter(item =>
            item.name.toLowerCase().includes(value) ||
            item.category.toLowerCase().includes(value)
        );

        displayItems(filtered);
    });
}

// ================= DARK MODE =================
function toggleDarkMode() {
    document.body.classList.toggle("light");
}

// ================= EXPORT =================
function exportCSV() {
    let csv = "Name,Quantity,Price,Category\n";

    items.forEach(item => {
        csv += `${item.name},${item.quantity},${item.price},${item.category}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory.csv";
    a.click();
}

// ================= INIT =================
displayItems(); 
document.addEventListener("DOMContentLoaded", () => {
    displayItems();
});