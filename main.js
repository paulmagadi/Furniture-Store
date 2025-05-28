/**
 * main.js - Starter template for a Furniture Store
 */

// Sample product data
const products = [
    { id: 1, name: "Modern Sofa", price: 499, category: "Living Room", image: "images/p1.png" },
    { id: 2, name: "Dining Table", price: 299, category: "Dining Room", image: "images/p2.png" },
    { id: 3, name: "Queen Bed", price: 399, category: "Bedroom", image: "images/p3.png" },
    { id: 4, name: "Office Chair", price: 199, category: "Office", image: "images/p4.png" },
    { id: 5, name: "Bookshelf", price: 149, category: "Living Room", image: "images/p5.png" },
    { id: 6, name: "Coffee Table", price: 89, category: "Living Room", image: "images/p6.png" },
    { id: 7, name: "Wardrobe", price: 599, category: "Bedroom", image: "images/p7.png" },
    { id: 8, name: "Accent Chair", price: 249, category: "Living Room", image: "images/p8.png" }
];


// Render products to the DOM
function renderProducts(productList) {
    const container = document.getElementById('product-list');
    container.innerHTML = '';
    productList.forEach(product => {
        const item = document.createElement('div');
        item.className = 'product-card';
        item.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image" title="${product.name}">
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <button onclick="addToCart(${product.id})" class="add-to-cart btn-primary">Add to Cart</button>
        `;
        container.appendChild(item);
    });
}

// Simple cart logic
let cart = [];

const cartContainer = document.getElementById('cart');
const cartIcon = document.getElementById('cart-icon');
const closeCartButton = document.getElementById('close-cart');

const alertEl = document.getElementById('alert');

//close cart functionality
closeCartButton.addEventListener('click', () => {
    cartContainer.classList.remove('show-cart');
});

// Toggle cart visibility
cartIcon.addEventListener('click', () => {
    cartContainer.classList.toggle('show-cart');
});

// Add product to cart
function addToCart(productId) {
    const cartCountElement = document.getElementById('cart-count');
    cartCountElement.textContent = `Cart (${cart.length})`;

    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        alertEl.textContent = `${product.name} added to cart!`;
        alertEl.classList.remove('show-alert');
        alertEl.classList.add('show-alert');
        setTimeout(() => {
            alertEl.classList.remove('show-alert');
        }, 3000); // Hide alert after 3 seconds
        renderCartItem();
    }
}

// Render cart items
function renderCartItem() {
    const cartItemContainer = document.getElementById('cart-items');
    cartItemContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemContainer.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
        document.getElementById('cart-total').style.display = 'none';
        document.getElementById('checkout-button').style.display = 'none';
        return;
    }
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>Price: $${item.price}</p>
            </div>
            <button onclick="removeFromCart(${item.id})"><i class="fa-solid fa-xmark"></i></button>
        `;
        cartItemContainer.appendChild(cartItem);
    });

    document.getElementById('cart-total').style.display = 'block';
    document.getElementById('checkout-button').style.display = 'block';
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('cart-total').textContent = `Total: $${total.toFixed(2)}`;
    document.getElementById('cart-count').textContent = `Cart (${cart.length})`;
    document.getElementById('cart').classList.add('show-cart'); 
    
}

// Remove item from cart

const confirmRemoveModal = document.getElementById('confirm-remove-modal');
const confirmRemoveButton = document.getElementById('confirm-remove-button');
const cancelRemoveButton = document.getElementById('cancel-remove-button');

function removeFromCart(productId) {
    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex > -1) {
        const productName = cart[productIndex].name;
        confirmRemoveModal.classList.add('show-modal');
        
        confirmRemoveButton.onclick = () => {
            cart.splice(productIndex, 1);
            renderCartItem();
            confirmRemoveModal.classList.remove('show-modal');
            alertEl.textContent = `${productName} removed from cart!`;
            alertEl.classList.remove('show-alert');
            alertEl.classList.add('show-alert');
            setTimeout(() => {
                alertEl.classList.remove('show-alert');
            }, 3000); // Hide alert after 3 seconds
        };

        cancelRemoveButton.onclick = () => {
            confirmRemoveModal.classList.remove('show-modal');
        };
    }
}


// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    renderCartItem();
});