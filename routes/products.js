const express = require('express');
const jwt = require('jsonwebtoken');
const { 
  getAllProducts, 
  getProductById, 
  addToCart, 
  removeFromCart, 
  updateCartItemQuantity, 
  getUserCart, 
  clearCart, 
  checkout 
} = require('../data/products');

const router = express.Router();

// Chave secreta para JWT (em produção, deve estar em variável de ambiente)
const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-aqui';

/**
 * Middleware para verificar token JWT
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token não fornecido'
    });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do produto
 *         name:
 *           type: string
 *           description: Nome do produto
 *         description:
 *           type: string
 *           description: Descrição do produto
 *         price:
 *           type: number
 *           description: Preço do produto
 *         category:
 *           type: string
 *           description: Categoria do produto
 *         image:
 *           type: string
 *           description: URL da imagem do produto
 *         stock:
 *           type: integer
 *           description: Quantidade em estoque
 *     CartItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do item no carrinho
 *         productId:
 *           type: integer
 *           description: ID do produto
 *         name:
 *           type: string
 *           description: Nome do produto
 *         price:
 *           type: number
 *           description: Preço unitário
 *         quantity:
 *           type: integer
 *           description: Quantidade
 *         total:
 *           type: number
 *           description: Total do item
 *         image:
 *           type: string
 *           description: URL da imagem
 *     AddToCartRequest:
 *       type: object
 *       required:
 *         - productId
 *       properties:
 *         productId:
 *           type: integer
 *           description: ID do produto
 *         quantity:
 *           type: integer
 *           description: Quantidade (padrão 1)
 *           default: 1
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Listar todos os produtos
 *     description: Retorna a lista de todos os produtos disponíveis
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */
router.get('/', (req, res) => {
  const products = getAllProducts();
  res.json({
    success: true,
    products: products
  });
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obter produto por ID
 *     description: Retorna os detalhes de um produto específico
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Detalhes do produto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 */
router.get('/:id', (req, res) => {
  const product = getProductById(req.params.id);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Produto não encontrado'
    });
  }
  
  res.json({
    success: true,
    product: product
  });
});

/**
 * @swagger
 * /api/products/cart:
 *   get:
 *     summary: Obter carrinho do usuário
 *     description: Retorna os itens no carrinho do usuário autenticado
 *     tags: [Carrinho]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrinho do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 cart:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/CartItem'
 *                     total:
 *                       type: number
 *                       description: Total do carrinho
 *                     itemCount:
 *                       type: integer
 *                       description: Número de itens
 *       401:
 *         description: Não autorizado
 */
router.get('/cart', authenticateToken, (req, res) => {
  const cart = getUserCart(req.user.userId);
  res.json({
    success: true,
    cart: cart
  });
});

/**
 * @swagger
 * /api/products/cart:
 *   post:
 *     summary: Adicionar item ao carrinho
 *     description: Adiciona um produto ao carrinho do usuário autenticado
 *     tags: [Carrinho]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddToCartRequest'
 *     responses:
 *       200:
 *         description: Item adicionado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Item adicionado ao carrinho"
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.post('/cart', authenticateToken, (req, res) => {
  const { productId, quantity = 1 } = req.body;
  
  if (!productId) {
    return res.status(400).json({
      success: false,
      message: 'ID do produto é obrigatório'
    });
  }
  
  const result = addToCart(req.user.userId, productId, quantity);
  
  if (!result.success) {
    return res.status(400).json(result);
  }
  
  res.json(result);
});

/**
 * @swagger
 * /api/products/cart/{itemId}:
 *   put:
 *     summary: Atualizar quantidade do item no carrinho
 *     description: Atualiza a quantidade de um item específico no carrinho
 *     tags: [Carrinho]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do item no carrinho
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 description: Nova quantidade
 *     responses:
 *       200:
 *         description: Quantidade atualizada
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.put('/cart/:itemId', authenticateToken, (req, res) => {
  const { quantity } = req.body;
  
  if (!quantity || quantity < 1) {
    return res.status(400).json({
      success: false,
      message: 'Quantidade deve ser maior que zero'
    });
  }
  
  const result = updateCartItemQuantity(req.user.userId, req.params.itemId, quantity);
  
  if (!result.success) {
    return res.status(400).json(result);
  }
  
  res.json(result);
});

/**
 * @swagger
 * /api/products/cart/{itemId}:
 *   delete:
 *     summary: Remover item do carrinho
 *     description: Remove um item específico do carrinho do usuário
 *     tags: [Carrinho]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do item no carrinho
 *     responses:
 *       200:
 *         description: Item removido com sucesso
 *       401:
 *         description: Não autorizado
 */
router.delete('/cart/:itemId', authenticateToken, (req, res) => {
  const result = removeFromCart(req.user.userId, req.params.itemId);
  
  if (!result.success) {
    return res.status(400).json(result);
  }
  
  res.json(result);
});

/**
 * @swagger
 * /api/products/cart:
 *   delete:
 *     summary: Limpar carrinho
 *     description: Remove todos os itens do carrinho do usuário
 *     tags: [Carrinho]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrinho limpo com sucesso
 *       401:
 *         description: Não autorizado
 */
router.delete('/cart', authenticateToken, (req, res) => {
  const result = clearCart(req.user.userId);
  res.json(result);
});

/**
 * @swagger
 * /api/products/checkout:
 *   post:
 *     summary: Finalizar compra
 *     description: Finaliza a compra e limpa o carrinho
 *     tags: [Carrinho]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Compra finalizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Compra finalizada com sucesso"
 *                 orderId:
 *                   type: integer
 *                   description: ID do pedido
 *                 total:
 *                   type: number
 *                   description: Total da compra
 *       400:
 *         description: Erro na finalização
 *       401:
 *         description: Não autorizado
 */
router.post('/checkout', authenticateToken, (req, res) => {
  const result = checkout(req.user.userId);
  
  if (!result.success) {
    return res.status(400).json(result);
  }
  
  res.json(result);
});

module.exports = router; 