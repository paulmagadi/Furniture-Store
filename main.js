// ========== Menu Toggle ========== //
(function initMenuToggle() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.innerHTML = navMenu.classList.contains('active')
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        });
    });
})();

// ========== Product Data ========== //
const products = [
    { id: 1, name: "Modern Sofa", price: 499, category: "Living Room", image: "images/p1.png", description: "A stylish and comfortable modern sofa perfect for any living room." },
    { id: 2, name: "Dining Table", price: 299, category: "Dining Room", image: "images/p2.png", description: "A spacious dining table that seats up to six people, ideal for family gatherings." },
    { id: 3, name: "Queen Bed", price: 399, category: "Bedroom", image: "images/p3.png", description: "A luxurious queen bed with a comfortable mattress for a good night's sleep." },
    { id: 4, name: "Office Chair", price: 199, category: "Office", image: "images/p4.png", description: "An ergonomic office chair designed for comfort during long working hours." },
    { id: 5, name: "Bookshelf", price: 149, category: "Living Room", image: "images/p5.png", description: "A stylish bookshelf to organize your books and decorative items." },
    { id: 6, name: "Coffee Table", price: 89, category: "Living Room", image: "images/p6.png", description: "A modern coffee table that complements your living room decor." },
    { id: 7, name: "Wardrobe", price: 599, category: "Bedroom", image: "images/p7.png", description: "A spacious wardrobe with ample storage for your clothes and accessories." },
    { id: 8, name: "Accent Chair", price: 249, category: "Living Room", image: "images/p8.png", description: "A stylish accent chair that adds a pop of color to your living room." },
];

// ========== Product Rendering ========== //
function renderProducts(list) {
    const container = document.getElementById('product-list');
    container.innerHTML = '';
    list.forEach(product => {
        const item = document.createElement('div');
        item.className = 'product-card';
        item.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image" title="${product.name}">
            <h3 class="product-name">${product.name}</h3>
            <p>Price: $${product.price}</p>
            <button onclick="addToCart(${product.id})" class="add-to-cart btn-primary">Add to Cart</button>
            <button class="view-product btn-primary" data-id="${product.id}">View</button>
        `;
        container.appendChild(item);
    });
}

function attachViewButtons() {
    document.querySelectorAll('.view-product').forEach(button => {
        button.addEventListener('click', e => {
            openProductModal(parseInt(e.target.getAttribute('data-id')));
        });
    });
}

// ========== Product Modal ========== //
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('modal-product-title').textContent = product.name;
    document.getElementById('modal-product-price').textContent = `$${product.price}`;
    document.getElementById('modal-product-image').src = product.image;
    document.getElementById('modal-product-description').textContent = product.description;
    document.getElementById('modal-add-to-cart').setAttribute('data-id', product.id);
    document.getElementById('product-modal').style.display = 'flex';
}

document.getElementById('modal-add-to-cart').addEventListener('click', e => {
    addToCart(parseInt(e.target.getAttribute('data-id')));
    document.getElementById('product-modal').style.display = 'none';
});

document.querySelectorAll('.close-product-modal').forEach(btn => {
    btn.addEventListener('click', () => {
        document.getElementById('product-modal').style.display = 'none';
    });
});

// ========== Search Functionality ========== //
(function initSearch() {
    const input = document.getElementById('search-input');
    const container = input.parentElement;
    let timeout;

    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear';
    clearBtn.className = 'clear-search-btn';
    clearBtn.style.display = 'none';
    container.appendChild(clearBtn);

    input.addEventListener('input', () => {
        clearTimeout(timeout);
        clearBtn.style.display = input.value ? 'inline-block' : 'none';
        timeout = setTimeout(() => {
            const term = input.value.toLowerCase();
            const results = products.filter(p => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term));
            renderProducts(results);
            attachViewButtons();
            if (results.length === 0) {
                document.getElementById('product-list').innerHTML += `<p class="no-results">No products found for <strong>${input.value}</strong>.</p>`;
            }
        }, 600);
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        clearBtn.style.display = 'none';
        renderProducts(products);
        attachViewButtons();
    });
})();

// ========== Cart Management ========== //
let cart = [];

const alertEl = document.getElementById('alert');
const cartContainer = document.getElementById('cart');
const cartCount = document.getElementById('cart-count');

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    cart.push(product);
    showAlert(`${product.name} added to cart!`);
    updateCartDisplay();
}

function showAlert(message) {
    alertEl.textContent = message;
    alertEl.classList.remove('show-alert');
    alertEl.classList.add('show-alert');
    setTimeout(() => alertEl.classList.remove('show-alert'), 3000);
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
        document.getElementById('cart-total').style.display = 'none';
        document.getElementById('checkout-button').style.display = 'none';
    } else {
        cart.forEach(item => {
            const el = document.createElement('div');
            el.className = 'cart-item';
            el.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Price: $${item.price}</p>
                </div>
                <button onclick="confirmRemove(${item.id}, '${item.name}')"><i class="fa-solid fa-xmark"></i></button>
            `;
            cartItems.appendChild(el);
        });

        const total = cart.reduce((sum, item) => sum + item.price, 0);
        document.getElementById('cart-total').textContent = `Total: $${total.toFixed(2)}`;
        document.getElementById('cart-total').style.display = 'block';
        document.getElementById('checkout-button').style.display = 'block';
    }

    cartCount.textContent = `Cart (${cart.length})`;
}

function confirmRemove(id, name) {
    const modal = document.getElementById('confirm-remove-modal');
    document.getElementById('remove-item-name').textContent = name;
    modal.classList.add('show-modal');

    document.getElementById('confirm-remove-button').onclick = () => {
        cart = cart.filter(p => p.id !== id);
        updateCartDisplay();
        showAlert(`${name} removed from cart!`);
        modal.classList.remove('show-modal');
    };

    ['cancel-remove-button', 'close-modal'].forEach(id => {
        document.getElementById(id).onclick = () => modal.classList.remove('show-modal');
    });
}

// ========== Cart Toggle ========== //
document.getElementById('cart-icon').addEventListener('click', () => {
    cartContainer.classList.toggle('show-cart');
});
document.getElementById('close-cart').addEventListener('click', () => {
    cartContainer.classList.remove('show-cart');
});

// ========== Init App ========== //
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    attachViewButtons();
    updateCartDisplay();
    cartCount.textContent = 'Cart (0)';
});
