
// const productModal = document.getElementById('product-modal');
// const productCard = document.querySelectorAll('.view-product');

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


document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    attachViewButtons();
    renderCartItem();
});


document.getElementById('modal-add-to-cart').addEventListener('click', (e) => {
    const productId = parseInt(e.target.getAttribute('data-id'));
    addToCart(productId);
    document.getElementById('product-modal').classList.remove('show-modal');
});


document.querySelectorAll('.close-product-modal').forEach(btn => {
    btn.addEventListener('click', () => {
        document.getElementById('product-modal').style.display = 'none';
    });
});
