// ================= AUTH =================
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "login.html";
}

// SHOW USER
document.getElementById("userRole").textContent =
    currentUser.username + " (" + currentUser.role + ")";

// HIDE ADMIN
if (currentUser.role !== "admin") {
    document.getElementById("adminSection").style.display = "none";
}

// ================= DATA =================
let items = JSON.parse(localStorage.getItem("items")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ================= SAVE =================
function save() {
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

// ================= DISPLAY ITEMS =================
function displayItems() {
    const list = document.getElementById("item-list");
    list.innerHTML = "";

    items.forEach((item, i) => {
        list.innerHTML += `
        <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>₦${item.price}</td>
            <td>${item.category}</td>
            <td>${item.quantity > 0 ? "Available ✅" : "Out ❌"}</td>
            <td>
                ${currentUser.role === "admin" ? `
                    <button onclick="editItem(${i})">Edit</button>
                    <button onclick="deleteItem(${i})">Delete</button>
                ` : "No Access"}
            </td>
        </tr>`;
    });

    updateDashboard();
}

// ================= DELETE =================
window.deleteItem = function(i) {
    items.splice(i, 1);
    save();
    displayItems();
    displayProducts();
};

// ================= EDIT =================
window.editItem = function(i) {
    const item = items[i];

    document.getElementById("name").value = item.name;
    document.getElementById("quantity").value = item.quantity;
    document.getElementById("price").value = item.price;
    document.getElementById("category").value = item.category;

    deleteItem(i);
};

// ================= ADD =================
document.getElementById("item-form").addEventListener("submit", e => {
    e.preventDefault();

    items.push({
        name: name.value,
        quantity: Number(quantity.value),
        price: Number(price.value),
        category: category.value
    });

    save();
    e.target.reset();

    displayItems();
    displayProducts();
});

// ================= PRODUCTS =================
function displayProducts() {
    const div = document.getElementById("product-list");
    div.innerHTML = "";

    items.forEach((item, i) => {
        div.innerHTML += `
        <div class="card">
            <h3>${item.name}</h3>
            <p>₦${item.price}</p>
            <p>${item.quantity > 0 ? "Available ✅" : "Out ❌"}</p>

            <button onclick="addToCart(${i})">
                🛒 Add to Cart
            </button>
        </div>`;
    });
}

// ================= CART =================
window.addToCart = function(i) {
    if (items[i].quantity <= 0) {
        alert("Out of stock!");
        return;
    }

    cart.push(items[i]);
    items[i].quantity -= 1;

    save();
    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
    displayItems();
    displayProducts();
};

// ================= DISPLAY CART =================
function displayCart() {
    const div = document.getElementById("cart");
    let total = 0;

    div.innerHTML = "";

    cart.forEach(item => {
        total += item.price;
        div.innerHTML += `<p>${item.name} - ₦${item.price}</p>`;
    });

    div.innerHTML += `<h3>Total: ₦${total}</h3>`;
}

// ================= CHECKOUT =================
window.checkout = function() {
    if (cart.length === 0) return alert("Cart is empty!");

    alert("Order placed successfully 🎉");

    cart = [];
    localStorage.removeItem("cart");

    displayCart();
};

// ✅ FIXED ERROR HERE
window.exportCSV = function() {
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
};

// ================= UI =================
window.toggleDarkMode = function() {
    document.body.classList.toggle("light");
};

window.logout = function() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
};

// ================= INIT =================
displayItems();
displayProducts();
displayCart();