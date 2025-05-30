//Menu toggle functionality
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-links');
const navLinks = document.querySelectorAll('.nav-link');
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    if (navMenu.classList.contains('active')) {
        menuToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>'; 
    } else {
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>'; 
    }
});

// Close the menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {  
        navMenu.classList.remove('active');
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
});


// Product data and rendering logic

// Sample product data
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


// Render products to the DOM
function renderProducts(productList) {
    const container = document.getElementById('product-list');
    container.innerHTML = '';
    productList.forEach(product => {
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

// Product details modal functionality
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        // Populate modal content
        document.getElementById('modal-product-title').textContent = product.name;
        document.getElementById('modal-product-price').textContent = `$${product.price}`;
        document.getElementById('modal-product-image').src = product.image;
        document.getElementById('modal-product-description').textContent = product.description;

        const addToCartBtn = document.getElementById('modal-add-to-cart');
        addToCartBtn.setAttribute('data-id', product.id);

        // Show modal
        document.getElementById('product-modal').style.display = 'flex';
    }
}

function attachViewButtons() {
    document.querySelectorAll('.view-product').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            openProductModal(productId);
        });
    });
}


// Add to cart button functionality in modal
document.getElementById('modal-add-to-cart').addEventListener('click', (e) => {
    const productId = parseInt(e.target.getAttribute('data-id'));
    addToCart(productId);
    document.getElementById('product-modal').classList.remove('show-modal');
});

// Close product modal functionality
document.querySelectorAll('.close-product-modal').forEach(btn => {
    btn.addEventListener('click', () => {
        document.getElementById('product-modal').style.display = 'none';
    });
});


// Product search functionality
const searchInput = document.getElementById('search-input');
const searchContainer = searchInput.parentElement;
let searchTimeout;

// Create clear button
const clearBtn = document.createElement('button');
clearBtn.type = 'button';
clearBtn.textContent = 'Clear';
clearBtn.className = 'clear-search-btn';
clearBtn.style.display = 'none';
searchContainer.appendChild(clearBtn);

searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    clearBtn.style.display = searchInput.value ? 'inline-block' : 'none';
    searchTimeout = setTimeout(() => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm)
        );
        renderProducts(filteredProducts);
        attachViewButtons(); // Reattach view buttons after filtering
        // Show message if no products found
        const container = document.getElementById('product-list');
        if (filteredProducts.length === 0) {
            container.innerHTML += `<p class="no-results">No products found for <strong>${searchInput.value}</strong>. <br> Please try a different search term.</p>`;
        }
    }, 600); 


});

clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    renderProducts(products);
});


// Cart functionality
// Initialize cart as an empty array
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
    }
    renderCartItem();
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
            <button onclick="
            const productName = '${item.name}';
            removeItemName.textContent = productName;
            removeFromCart(${item.id})"><i class="fa-solid fa-xmark"></i></button>
        `;
        cartItemContainer.appendChild(cartItem);
    });

    document.getElementById('cart-total').style.display = 'block';
    document.getElementById('checkout-button').style.display = 'block';
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('cart-total').textContent = `Total: $${total.toFixed(2)}`;
    document.getElementById('cart-count').textContent = `Cart (${cart.length})`;
    // document.getElementById('cart').classList.add('show-cart'); 
    
}

// Remove item from cart
const confirmRemoveModal = document.getElementById('confirm-remove-modal');
const confirmRemoveButton = document.getElementById('confirm-remove-button');
const cancelRemoveButton = document.getElementById('cancel-remove-button');
const closeModalButton = document.getElementById('close-modal');
const removeItemName = document.getElementById('remove-item-name');


function removeFromCart(productId) {
    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex > -1) {
        const productName = cart[productIndex].name;
        confirmRemoveModal.classList.add('show-modal');
        
        confirmRemoveButton.onclick = () => {
            cart.splice(productIndex, 1);
            renderCartItem();
            confirmRemoveModal.classList.remove('show-modal');
            
            // Show alert for removal
            alertEl.textContent = `${productName} removed from cart!`;
            alertEl.classList.remove('show-alert');
            alertEl.classList.add('show-alert');
            setTimeout(() => {
                alertEl.classList.remove('show-alert');
            }, 3000); 
        };

        cancelRemoveButton.onclick = () => {
            confirmRemoveModal.classList.remove('show-modal');
        };
        closeModalButton.onclick = () => {
            confirmRemoveModal.classList.remove('show-modal');
        };
    }
}


// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    attachViewButtons();
    renderCartItem();
    
    const cartCountElement = document.getElementById('cart-count');
    cartCountElement.textContent = 'Cart (0)';
});



