// Armazenamento em memória dos produtos e carrinhos
let products = [];
let carts = new Map(); // userId -> cart items

/**
 * Inicializa os dados de produtos
 */
function initializeProducts() {
  products = [
    {
      id: 1,
      name: 'Smartphone Galaxy S23',
      description: 'Smartphone Samsung Galaxy S23 128GB',
      price: 2999.99,
      category: 'Celular',
      image: 'https://via.placeholder.com/300x300?text=Galaxy+S23',
      stock: 50
    },
    {
      id: 2,
      name: 'iPad Pro 11"',
      description: 'Tablet Apple iPad Pro 11" 128GB Wi-Fi',
      price: 5499.99,
      category: 'Tablet',
      image: 'https://via.placeholder.com/300x300?text=iPad+Pro',
      stock: 30
    },
    {
      id: 3,
      name: 'iPhone 15 Pro',
      description: 'Smartphone Apple iPhone 15 Pro 128GB',
      price: 6999.99,
      category: 'Celular',
      image: 'https://via.placeholder.com/300x300?text=iPhone+15+Pro',
      stock: 25
    },
    {
      id: 4,
      name: 'Samsung Galaxy Tab S9',
      description: 'Tablet Samsung Galaxy Tab S9 11" 128GB',
      price: 3999.99,
      category: 'Tablet',
      image: 'https://via.placeholder.com/300x300?text=Galaxy+Tab+S9',
      stock: 20
    }
  ];
  
  console.log('Produtos inicializados com sucesso');
}

/**
 * Obtém todos os produtos
 */
function getAllProducts() {
  return products;
}

/**
 * Obtém um produto por ID
 */
function getProductById(id) {
  return products.find(p => p.id === parseInt(id));
}

/**
 * Adiciona um item ao carrinho
 */
function addToCart(userId, productId, quantity = 1) {
  const product = getProductById(productId);
  
  if (!product) {
    return { success: false, message: 'Produto não encontrado' };
  }
  
  if (product.stock < quantity) {
    return { success: false, message: 'Quantidade indisponível em estoque' };
  }
  
  // Inicializa o carrinho do usuário se não existir
  if (!carts.has(userId)) {
    carts.set(userId, []);
  }
  
  const userCart = carts.get(userId);
  const existingItem = userCart.find(item => item.productId === parseInt(productId));
  
  if (existingItem) {
    // Atualiza quantidade se o item já existe
    const newQuantity = existingItem.quantity + quantity;
    if (product.stock < newQuantity) {
      return { success: false, message: 'Quantidade indisponível em estoque' };
    }
    existingItem.quantity = newQuantity;
    existingItem.total = existingItem.quantity * product.price;
  } else {
    // Adiciona novo item
    userCart.push({
      id: Date.now(), // ID único para o item do carrinho
      productId: parseInt(productId),
      name: product.name,
      price: product.price,
      quantity: quantity,
      total: quantity * product.price,
      image: product.image
    });
  }
  
  return { success: true, message: 'Item adicionado ao carrinho' };
}

/**
 * Remove um item do carrinho
 */
function removeFromCart(userId, itemId) {
  if (!carts.has(userId)) {
    return { success: false, message: 'Carrinho não encontrado' };
  }
  
  const userCart = carts.get(userId);
  const itemIndex = userCart.findIndex(item => item.id === parseInt(itemId));
  
  if (itemIndex === -1) {
    return { success: false, message: 'Item não encontrado no carrinho' };
  }
  
  userCart.splice(itemIndex, 1);
  
  return { success: true, message: 'Item removido do carrinho' };
}

/**
 * Atualiza a quantidade de um item no carrinho
 */
function updateCartItemQuantity(userId, itemId, quantity) {
  if (!carts.has(userId)) {
    return { success: false, message: 'Carrinho não encontrado' };
  }
  
  const userCart = carts.get(userId);
  const item = userCart.find(item => item.id === parseInt(itemId));
  
  if (!item) {
    return { success: false, message: 'Item não encontrado no carrinho' };
  }
  
  const product = getProductById(item.productId);
  if (product.stock < quantity) {
    return { success: false, message: 'Quantidade indisponível em estoque' };
  }
  
  item.quantity = quantity;
  item.total = quantity * item.price;
  
  return { success: true, message: 'Quantidade atualizada' };
}

/**
 * Obtém o carrinho de um usuário
 */
function getUserCart(userId) {
  if (!carts.has(userId)) {
    return [];
  }
  
  const userCart = carts.get(userId);
  const total = userCart.reduce((sum, item) => sum + item.total, 0);
  
  return {
    items: userCart,
    total: total,
    itemCount: userCart.length
  };
}

/**
 * Limpa o carrinho de um usuário
 */
function clearCart(userId) {
  if (carts.has(userId)) {
    carts.delete(userId);
  }
  return { success: true, message: 'Carrinho limpo' };
}

/**
 * Finaliza a compra (simula checkout)
 */
function checkout(userId) {
  if (!carts.has(userId)) {
    return { success: false, message: 'Carrinho vazio' };
  }
  
  const userCart = carts.get(userId);
  
  // Verifica estoque para todos os itens
  for (const item of userCart) {
    const product = getProductById(item.productId);
    if (product.stock < item.quantity) {
      return { success: false, message: `Produto ${product.name} não tem estoque suficiente` };
    }
  }
  
  // Atualiza estoque
  for (const item of userCart) {
    const product = getProductById(item.productId);
    product.stock -= item.quantity;
  }
  
  // Limpa o carrinho
  carts.delete(userId);
  
  return { 
    success: true, 
    message: 'Compra finalizada com sucesso',
    orderId: Date.now(),
    total: userCart.reduce((sum, item) => sum + item.total, 0)
  };
}

module.exports = {
  initializeProducts,
  getAllProducts,
  getProductById,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  getUserCart,
  clearCart,
  checkout
}; 