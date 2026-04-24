// ================= AUTH (FIREBASE) =================
auth.onAuthStateChanged(user => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("userRole").textContent = user.email;

    const ADMIN_EMAIL = "youradmin@email.com"; // CHANGE THIS

    if (user.email !== ADMIN_EMAIL) {
        document.getElementById("adminSection").style.display = "none";
    }
});

// ================= DATA =================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ================= ADD PRODUCT (ADMIN ONLY) =================
document.getElementById("item-form").addEventListener("submit", e => {
    e.preventDefault();

    const user = auth.currentUser;
    const ADMIN_EMAIL = "youradmin@email.com";

    if (user.email !== ADMIN_EMAIL) {
        alert("Only admin can add products!");
        return;
    }

    const name = document.getElementById("name").value;
    const quantity = Number(document.getElementById("quantity").value);
    const price = Number(document.getElementById("price").value);
    const category = document.getElementById("category").value;

    db.collection("products").add({
        name,
        quantity,
        price,
        category,
        createdAt: new Date()
    }).then(() => {
        alert("Product added!");
        e.target.reset();
    });
});

// ================= REAL-TIME PRODUCTS =================
function displayProducts() {
    const div = document.getElementById("product-list");

    db.collection("products").onSnapshot(snapshot => {
        div.innerHTML = "";

        snapshot.forEach(doc => {
            const item = doc.data();

            div.innerHTML += `
            <div class="card">
                <h3>${item.name}</h3>
                <p>₦${item.price}</p>
                <p>${item.quantity > 0 ? "Available ✅" : "Out ❌"}</p>

                <button onclick="addToCart('${doc.id}', ${item.price})">
                    🛒 Add to Cart
                </button>
            </div>
            `;
        });
    });
}

// ================= INVENTORY TABLE =================
function displayItems() {
    const list = document.getElementById("item-list");

    db.collection("products").onSnapshot(snapshot => {
        list.innerHTML = "";

        snapshot.forEach(doc => {
            const item = doc.data();

            list.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₦${item.price}</td>
                <td>${item.category}</td>
                <td>${item.quantity > 0 ? "Available" : "Out"}</td>
                <td>
                    <button onclick="deleteItem('${doc.id}')">Delete</button>
                </td>
            </tr>
            `;
        });
    });
}

// ================= DELETE PRODUCT =================
window.deleteItem = function(id) {
    const user = auth.currentUser;
    const ADMIN_EMAIL = "youradmin@email.com";

    if (user.email !== ADMIN_EMAIL) {
        alert("Only admin can delete!");
        return;
    }

    db.collection("products").doc(id).delete();
};

// ================= CART =================
window.addToCart = function(id, price) {
    cart.push({ id, price });

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
};

// ================= DISPLAY CART =================
function displayCart() {
    const div = document.getElementById("cart");
    let total = 0;

    div.innerHTML = "";

    cart.forEach(item => {
        total += item.price;
        div.innerHTML += `<p>Item - ₦${item.price}</p>`;
    });

    div.innerHTML += `<h3>Total: ₦${total}</h3>`;
}

// ================= CHECKOUT =================
window.checkout = function() {
    if (cart.length === 0) return alert("Cart empty!");

    alert("Order placed successfully 🎉");

    cart = [];
    localStorage.removeItem("cart");

    displayCart();
};

// ================= EXPORT =================
window.exportCSV = function() {
    db.collection("products").get().then(snapshot => {
        let csv = "Name,Quantity,Price,Category\n";

        snapshot.forEach(doc => {
            const item = doc.data();
            csv += `${item.name},${item.quantity},${item.price},${item.category}\n`;
        });

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "products.csv";
        a.click();
    });
};

// ================= UI =================
window.toggleDarkMode = function() {
    document.body.classList.toggle("light");
};

window.logout = function() {
    auth.signOut();
};

// ================= INIT =================
displayProducts();
displayItems();
displayCart();