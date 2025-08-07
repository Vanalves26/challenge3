const express = require('express');
const jwt = require('jsonwebtoken');
const { 
  authenticateUser, 
  generateResetToken, 
  resetPassword 
} = require('../data/users');

const router = express.Router();

// Chave secreta para JWT (em produção, deve estar em variável de ambiente)
const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-aqui';

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Nome de usuário
 *           example: "usuario1"
 *         password:
 *           type: string
 *           description: Senha do usuário
 *           example: "senha123"
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indica se o login foi bem-sucedido
 *         message:
 *           type: string
 *           description: Mensagem de resposta
 *         token:
 *           type: string
 *           description: Token JWT (apenas em caso de sucesso)
 *         user:
 *           type: object
 *           description: Dados do usuário (apenas em caso de sucesso)
 *     ForgotPasswordRequest:
 *       type: object
 *       required:
 *         - username
 *       properties:
 *         username:
 *           type: string
 *           description: Nome de usuário para reset de senha
 *           example: "usuario1"
 *     ResetPasswordRequest:
 *       type: object
 *       required:
 *         - token
 *         - newPassword
 *       properties:
 *         token:
 *           type: string
 *           description: Token de reset de senha
 *         newPassword:
 *           type: string
 *           description: Nova senha
 *           example: "novaSenha123"
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autenticar usuário
 *     description: Autentica um usuário com username e senha, retornando um token JWT
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login bem-sucedido
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
 *                   example: "Login realizado com sucesso"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: "usuario1"
 *                     email:
 *                       type: string
 *                       example: "usuario1@teste.com"
 *                     name:
 *                       type: string
 *                       example: "Usuário Teste 1"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Username e password são obrigatórios"
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Usuário não encontrado"
 *       423:
 *         description: Conta bloqueada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Conta bloqueada. Tente novamente em 15 minutos."
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validação dos campos obrigatórios
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username e password são obrigatórios'
    });
  }

  // Autenticar usuário
  const authResult = authenticateUser(username, password);

  if (!authResult.success) {
    // Se a conta está bloqueada, retorna status 423 (Locked)
    if (authResult.message.includes('bloqueada')) {
      return res.status(423).json({
        success: false,
        message: authResult.message
      });
    }
    
    return res.status(401).json({
      success: false,
      message: authResult.message
    });
  }

  // Gerar token JWT
  const token = jwt.sign(
    { 
      userId: authResult.user.id,
      username: authResult.user.username 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    message: 'Login realizado com sucesso',
    token: token,
    user: authResult.user
  });
});

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Solicitar reset de senha
 *     description: Gera um token para reset de senha do usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *     responses:
 *       200:
 *         description: Token gerado com sucesso
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
 *                   example: "Token de reset gerado com sucesso"
 *                 token:
 *                   type: string
 *                   example: "abc123def456"
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Usuário não encontrado"
 */
router.post('/forgot-password', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({
      success: false,
      message: 'Username é obrigatório'
    });
  }

  const result = generateResetToken(username);

  if (!result.success) {
    return res.status(404).json({
      success: false,
      message: result.message
    });
  }

  res.json({
    success: true,
    message: 'Token de reset gerado com sucesso',
    token: result.token
  });
});

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Resetar senha
 *     description: Reseta a senha do usuário usando o token fornecido
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
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
 *                   example: "Senha alterada com sucesso"
 *       400:
 *         description: Token inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Token inválido"
 */
router.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Token e nova senha são obrigatórios'
    });
  }

  const result = resetPassword(token, newPassword);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.message
    });
  }

  res.json({
    success: true,
    message: result.message
  });
});

/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     summary: Verificar token JWT
 *     description: Verifica se um token JWT é válido
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
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
 *                   example: "Token válido"
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: "usuario1"
 *       401:
 *         description: Token inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Token inválido"
 */
router.get('/verify', (req, res) => {
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
    res.json({
      success: true,
      message: 'Token válido',
      user: decoded
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
});

module.exports = router; 