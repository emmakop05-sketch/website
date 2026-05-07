const currentUser =
JSON.parse(localStorage.getItem("currentUser"));

if(!currentUser){
window.location.href = "login.html";
}

let items =
JSON.parse(localStorage.getItem("items")) || [];

let cart =
JSON.parse(localStorage.getItem("cart")) || [];

const adminPanel =
document.getElementById("adminPanel");

if(currentUser.role !== "admin"){
adminPanel.style.display = "none";
}

function saveProducts(){
localStorage.setItem(
"items",
JSON.stringify(items)
);
}

function displayProducts(){

const products =
document.getElementById("products");

products.innerHTML = "";

items.forEach((item,index)=>{

products.innerHTML += `
<div class="card">

<img src="${item.image}" alt="">

<h3>${item.name}</h3>

<p>₦${item.price}</p>

<p>${item.category}</p>

<p>
${item.quantity > 0 ?
"Available ✅" :
"Out of Stock ❌"}
</p>

<button onclick="addToCart(${index})">
Add To Cart
</button>

${
currentUser.role === "admin" ?
`
<button onclick="deleteProduct(${index})">
Delete
</button>
`
:
""
}

</div>
`;

});
}

document.getElementById("productForm")
.addEventListener("submit",e=>{

e.preventDefault();

items.push({

name:name.value,
price:Number(price.value),
quantity:Number(quantity.value),
category:category.value,
image:image.value

});

saveProducts();

displayProducts();

e.target.reset();

});

function deleteProduct(index){

items.splice(index,1);

saveProducts();

displayProducts();

}

function addToCart(index){

if(items[index].quantity <= 0){
alert("Out of stock");
return;
}

cart.push(items[index]);

items[index].quantity--;

localStorage.setItem(
"cart",
JSON.stringify(cart)
);

saveProducts();

displayProducts();

displayCart();

}

function displayCart(){

const cartDiv =
document.getElementById("cart");

cartDiv.innerHTML = "";

let total = 0;

cart.forEach(item=>{

total += item.price;

cartDiv.innerHTML += `
<p>
${item.name} - ₦${item.price}
</p>
`;

});

cartDiv.innerHTML += `
<h2>Total: ₦${total}</h2>
`;

}

function checkout(){

if(cart.length === 0){
alert("Cart empty");
return;
}

alert("Payment Successful 🎉");

cart = [];

localStorage.removeItem("cart");

displayCart();

}

function toggleDarkMode(){
document.body.classList.toggle("light");
}

function logout(){

localStorage.removeItem("currentUser");

window.location.href = "login.html";

}

document.getElementById("search")
.addEventListener("input",e=>{

const value =
e.target.value.toLowerCase();

const filtered = items.filter(item=>

item.name.toLowerCase().includes(value)

);

const products =
document.getElementById("products");

products.innerHTML = "";

filtered.forEach((item,index)=>{

products.innerHTML += `
<div class="card">

<img src="${item.image}" alt="">

<h3>${item.name}</h3>

<p>₦${item.price}</p>

<button onclick="addToCart(${index})">
Add To Cart
</button>

</div>
`;

});

});

displayProducts();

displayCart();