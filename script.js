const form = document.getElementById('product-form');
const productList = document.getElementById('product-list');
const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const stockInput = document.getElementById('stock');
const editIndexInput = document.getElementById('edit-index');
const categoryInput = document.getElementById('category');
const searchBar = document.getElementById('searchBar');
const categoryFilter = document.getElementById('categoryFilter');

let products = [];

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  renderProducts();
  searchBar.addEventListener('input', filterAndRender);
  categoryFilter.addEventListener('change', filterAndRender);
});

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const price = parseFloat(priceInput.value).toFixed(2);
  const stock = parseInt(stockInput.value);
  const category = categoryInput.value;
  const editIndex = editIndexInput.value;

  if (name && price && stock >= 0 && category) {
    if (editIndex === '') {
      const lastId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
      const newId = lastId + 1;

      products.push({ id: newId, name, price, stock, category });
    } else {
      const existingId = products[editIndex].id;
      products[editIndex] = { id: existingId, name, price, stock, category };
      editIndexInput.value = '';
    }

    saveProducts();
    renderProducts();
    form.reset();
  }
});

function renderProducts(productArray = products) {
  productList.innerHTML = '';

  productArray.forEach((product, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div>
        <strong>${product.name}</strong> (ID: ${product.id})<br>
        Categoría: ${product.category} <br>
        Precio: $${product.price} | Stock: ${product.stock}
      </div>
      <span class="actions">
        <button onclick="editProduct(${index})">✏️</button>
        <button onclick="deleteProduct(${index})">🗑️</button>
      </span>
    `;
    productList.appendChild(li);
  });
}

function filterAndRender() {
  const searchTerm = searchBar.value.toLowerCase();
  const selectedCategory = categoryFilter.value;

  const filtered = products.filter(p => {
    const matchName = p.name.toLowerCase().includes(searchTerm);
    const matchCategory = selectedCategory === '' || p.category === selectedCategory;
    return matchName && matchCategory;
  });

  renderProducts(filtered);
}

function saveProducts() {
  localStorage.setItem('products', JSON.stringify(products));
}

function loadProducts() {
  const stored = localStorage.getItem('products');
  if (stored) {
    products = JSON.parse(stored);
  }
}

function deleteProduct(index) {
  if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
    products.splice(index, 1);
    saveProducts();
    renderProducts();
  }
}

function editProduct(index) {
  const product = products[index];
  nameInput.value = product.name;
  priceInput.value = product.price;
  stockInput.value = product.stock;
  categoryInput.value = product.category;
  editIndexInput.value = index;
}
