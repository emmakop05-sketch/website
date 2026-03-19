let products = JSON.parse(localStorage.getItem("products")) || [];
let editIndex = null;

function saveData() {
    localStorage.setItem("products", JSON.stringify(products));
}

function displayProducts(list = products) {
    let table = document.getElementById("tableBody");
    table.innerHTML = "";

    let totalValue = 0;

    list.forEach((product, index) => {
        let total = product.quantity * product.price;
        totalValue += total;

        table.innerHTML += `
            <tr>
                <td>${product.name}</td>
                <td>${product.quantity}</td>
                <td>₦${product.price}</td>
                <td>₦${total}</td>
                <td>
                    <button onclick="editProduct(${index})">Edit</button>
                    <button onclick="deleteProduct(${index})">Delete</button>
                </td>
            </tr>
        `;
    });

    document.getElementById("totalValue").innerText = "Total Value: ₦" + totalValue;
}

function addOrUpdateProduct() {
    let name = document.getElementById("name").value.trim();
    let quantity = document.getElementById("quantity").value;
    let price = document.getElementById("price").value;

    if (!name || !quantity || !price) {
        alert("Please fill all fields!");
        return;
    }

    if (editIndex === null) {
        products.push({ name, quantity: Number(quantity), price: Number(price) });
    } else {
        products[editIndex] = { name, quantity: Number(quantity), price: Number(price) };
        editIndex = null;
        document.getElementById("addBtn").innerText = "Add Product";
    }

    saveData();
    displayProducts();
    clearInputs();
}

function editProduct(index) {
    let product = products[index];

    document.getElementById("name").value = product.name;
    document.getElementById("quantity").value = product.quantity;
    document.getElementById("price").value = product.price;

    editIndex = index;
    document.getElementById("addBtn").innerText = "Update Product";
}

function deleteProduct(index) {
    products.splice(index, 1);
    saveData();
    displayProducts();
}

function searchProduct() {
    let search = document.getElementById("search").value.toLowerCase();

    let filtered = products.filter(p =>
        p.name.toLowerCase().includes(search)
    );

    displayProducts(filtered);
}

function clearInputs() {
    document.getElementById("name").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("price").value = "";
}

displayProducts();