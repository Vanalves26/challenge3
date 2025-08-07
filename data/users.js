const bcrypt = require('bcryptjs');

// Armazenamento em memória dos usuários
let users = [];
let loginAttempts = new Map(); // username -> { count: number, blockedUntil: Date }
let resetTokens = new Map(); // token -> { username: string, expiresAt: Date }

/**
 * Inicializa os dados de usuários com senhas criptografadas
 */
function initializeUsers() {
  const saltRounds = 10;
  
  // Criar senhas criptografadas
  const password1 = bcrypt.hashSync('senha123', saltRounds);
  const password2 = bcrypt.hashSync('admin456', saltRounds);
  const password3 = bcrypt.hashSync('teste789', saltRounds);
  
  users = [
    {
      id: 1,
      username: 'usuario1',
      password: password1,
      email: 'usuario1@teste.com',
      name: 'Usuário Teste 1'
    },
    {
      id: 2,
      username: 'admin',
      password: password2,
      email: 'admin@teste.com',
      name: 'Administrador'
    },
    {
      id: 3,
      username: 'teste',
      password: password3,
      email: 'teste@teste.com',
      name: 'Usuário Teste 2'
    },
    {
      id: 4,
      username: 'admim',
      password: bcrypt.hashSync('123', saltRounds),
      email: 'admim@teste.com',
      name: 'Usuário Admim'
    }
  ];
  
  console.log('Usuários inicializados com sucesso');
}

/**
 * Verifica se um usuário está bloqueado
 */
function isUserBlocked(username) {
  const attempts = loginAttempts.get(username);
  if (!attempts) return false;
  
  if (attempts.blockedUntil && new Date() < attempts.blockedUntil) {
    return true;
  }
  
  // Se o bloqueio expirou, limpa as tentativas
  if (attempts.blockedUntil && new Date() >= attempts.blockedUntil) {
    loginAttempts.delete(username);
    return false;
  }
  
  return false;
}

/**
 * Registra uma tentativa de login
 */
function recordLoginAttempt(username, success) {
  if (success) {
    // Login bem-sucedido, limpa as tentativas
    loginAttempts.delete(username);
    return;
  }
  
  const attempts = loginAttempts.get(username) || { count: 0 };
  attempts.count++;
  
  // Bloqueia após 3 tentativas por 15 minutos
  if (attempts.count >= 3) {
    attempts.blockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
  }
  
  loginAttempts.set(username, attempts);
}

/**
 * Verifica as credenciais do usuário
 */
function authenticateUser(username, password) {
  const user = users.find(u => u.username === username);
  
  if (!user) {
    return { success: false, message: 'Usuário não encontrado' };
  }
  
  if (isUserBlocked(username)) {
    const attempts = loginAttempts.get(username);
    const remainingTime = Math.ceil((attempts.blockedUntil - new Date()) / 1000 / 60);
    return { 
      success: false, 
      message: `Conta bloqueada. Tente novamente em ${remainingTime} minutos.` 
    };
  }
  
  const isValidPassword = bcrypt.compareSync(password, user.password);
  
  if (!isValidPassword) {
    recordLoginAttempt(username, false);
    const attempts = loginAttempts.get(username);
    const remainingAttempts = 3 - attempts.count;
    
    if (remainingAttempts > 0) {
      return { 
        success: false, 
        message: `Senha incorreta. Tentativas restantes: ${remainingAttempts}` 
      };
    } else {
      return { 
        success: false, 
        message: 'Conta bloqueada por 15 minutos devido a múltiplas tentativas incorretas.' 
      };
    }
  }
  
  // Login bem-sucedido
  recordLoginAttempt(username, true);
  return { 
    success: true, 
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name
    }
  };
}

/**
 * Gera um token de reset de senha
 */
function generateResetToken(username) {
  const user = users.find(u => u.username === username);
  if (!user) {
    return { success: false, message: 'Usuário não encontrado' };
  }
  
  // Remove tokens antigos para este usuário
  for (const [token, data] of resetTokens.entries()) {
    if (data.username === username) {
      resetTokens.delete(token);
    }
  }
  
  const token = Math.random().toString(36).substring(2, 15) + 
                Math.random().toString(36).substring(2, 15);
  
  resetTokens.set(token, {
    username: username,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutos
  });
  
  return { success: true, token: token };
}

/**
 * Verifica se um token de reset é válido
 */
function validateResetToken(token) {
  const resetData = resetTokens.get(token);
  
  if (!resetData) {
    return { success: false, message: 'Token inválido' };
  }
  
  if (new Date() > resetData.expiresAt) {
    resetTokens.delete(token);
    return { success: false, message: 'Token expirado' };
  }
  
  return { success: true, username: resetData.username };
}

/**
 * Reseta a senha do usuário
 */
function resetPassword(token, newPassword) {
  const validation = validateResetToken(token);
  
  if (!validation.success) {
    return validation;
  }
  
  const user = users.find(u => u.username === validation.username);
  if (!user) {
    return { success: false, message: 'Usuário não encontrado' };
  }
  
  // Criptografa a nova senha
  const saltRounds = 10;
  user.password = bcrypt.hashSync(newPassword, saltRounds);
  
  // Remove o token usado
  resetTokens.delete(token);
  
  return { success: true, message: 'Senha alterada com sucesso' };
}

/**
 * Obtém informações de um usuário por username
 */
function getUserByUsername(username) {
  return users.find(u => u.username === username);
}

module.exports = {
  initializeUsers,
  authenticateUser,
  generateResetToken,
  validateResetToken,
  resetPassword,
  getUserByUsername,
  isUserBlocked
}; 