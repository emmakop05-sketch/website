document.addEventListener("DOMContentLoaded", () => {

    // ================= FIREBASE =================
    const firebaseConfig = {
        apiKey: "AIzaSyBWnf8zHTl0nHvgLlxjDrmTlg74wZCRhv8",
        authDomain: "lotmore-store.firebaseapp.com",
        projectId: "lotmore-store",
        storageBucket: "lotmore-store.appspot.com",
        messagingSenderId: "129844135487",
        appId: "1:129844135487:web:c65d1d938192c17191da8a"
    };

    firebase.initializeApp(firebaseConfig);

    const db = firebase.firestore();

    // ================= AUTH =================
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("userRole").textContent =
        currentUser.username + " (" + currentUser.role + ")";

    if (currentUser.role !== "admin") {
        document.getElementById("adminSection").style.display = "none";
    }

    // ================= DATA =================
    let cart = [];

    // ================= LOAD PRODUCTS FROM FIREBASE =================
    function loadProducts() {
        db.collection("products").onSnapshot(snapshot => {
            let items = [];

            snapshot.forEach(doc => {
                items.push({ id: doc.id, ...doc.data() });
            });

            displayItems(items);
            displayProducts(items);
        });
    }

    // ================= DISPLAY TABLE =================
    function displayItems(items) {
        const list = document.getElementById("item-list");
        list.innerHTML = "";

        items.forEach(item => {
            list.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₦${item.price}</td>
                <td>${item.category}</td>
                <td>${item.quantity > 0 ? "Available ✅" : "Out ❌"}</td>
                <td>
                    ${currentUser.role === "admin" ? `
                        <button onclick="deleteItem('${item.id}')">Delete</button>
                    ` : "No Access"}
                </td>
            </tr>`;
        });
    }

    // ================= DISPLAY SHOP =================
    function displayProducts(items) {
        const div = document.getElementById("product-list");
        div.innerHTML = "";

        items.forEach(item => {
            div.innerHTML += `
            <div class="card">
                <h3>${item.name}</h3>
                <p>₦${item.price}</p>
                <p>${item.quantity > 0 ? "Available ✅" : "Out ❌"}</p>

                <button onclick="addToCart('${item.id}', ${item.price})">
                    🛒 Add to Cart
                </button>
            </div>`;
        });
    }

    // ================= ADD PRODUCT (ADMIN) =================
    const form = document.getElementById("item-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (currentUser.role !== "admin") {
            alert("Admin only!");
            return;
        }

        const name = document.getElementById("name").value;
        const quantity = Number(document.getElementById("quantity").value);
        const price = Number(document.getElementById("price").value);
        const category = document.getElementById("category").value;

        await db.collection("products").add({
            name,
            quantity,
            price,
            category
        });

        form.reset();
    });

    // ================= DELETE =================
    window.deleteItem = async function(id) {
        await db.collection("products").doc(id).delete();
    };

    // ================= CART =================
    window.addToCart = function(id, price) {
        cart.push({ id, price });
        displayCart();
    };

    function displayCart() {
        const div = document.getElementById("cart");
        let total = 0;

        div.innerHTML = "";

        cart.forEach(item => {
            total += item.price;
            div.innerHTML += `<p>₦${item.price}</p>`;
        });

        div.innerHTML += `<h3>Total: ₦${total}</h3>`;
    }

    // ================= CHECKOUT =================
    window.checkout = function() {
        if (cart.length === 0) {
            alert("Cart empty!");
            return;
        }

        alert("Order placed successfully 🎉");
        cart = [];
        displayCart();
    };

    // ================= EXPORT =================
    window.exportCSV = function() {
        alert("Export coming soon...");
    };

    // ================= UI =================
    window.toggleDarkMode = function() {
        document.body.classList.toggle("light");
    };

    window.logout = function() {
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
    };

    // INIT
    loadProducts();
});
localStorage.setItem("currentUser", JSON.stringify({
    username: "admin",
    role: "admin"
}));