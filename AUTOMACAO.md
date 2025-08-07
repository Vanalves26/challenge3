# 🤖 Sistema de Automação - Login e Carrinho

## 📋 Funcionalidades da Automação

### ✅ Automação Completa
O sistema agora inclui automação completa que:

1. **Preenche automaticamente** o formulário de login
2. **Realiza login** com as credenciais `admim` / `123`
3. **Carrega os produtos** disponíveis
4. **Adiciona automaticamente** 1 celular e 1 tablet ao carrinho
5. **Exibe o carrinho** com os produtos adicionados

## 🚀 Como Usar

### Método 1: Automação Automática
1. Abra o navegador em `http://localhost:3000`
2. A automação iniciará automaticamente após 2 segundos
3. Observe o processo completo acontecer

### Método 2: Botão de Automação
1. Abra o navegador em `http://localhost:3000`
2. Clique no botão **"Iniciar Automação"**
3. A automação será executada imediatamente

### Método 3: Console do Navegador
1. Abra o navegador em `http://localhost:3000`
2. Pressione `F12` para abrir as ferramentas do desenvolvedor
3. Vá para a aba **Console**
4. Digite um dos comandos:

```javascript
// Automação completa
startAutomation()

// Apenas login
performLogin()

// Apenas adicionar produtos
addProductsToCart()

// Produtos de exemplo (função legada)
addSampleProducts()
```

## 📊 Processo da Automação

### Passo 1: Preenchimento do Formulário
- Limpa os campos de usuário e senha
- Simula digitação caractere por caractere
- Preenche: `admim` no usuário e `123` na senha

### Passo 2: Login Automático
- Envia requisição POST para `/api/auth/login`
- Armazena o token JWT no localStorage
- Exibe mensagem de sucesso

### Passo 3: Carregamento de Produtos
- Aguarda o carregamento dos produtos da API
- Verifica se os produtos foram carregados corretamente
- Exibe os produtos na interface

### Passo 4: Adição ao Carrinho
- Adiciona 1x Galaxy S23 (ID: 1) - Celular
- Adiciona 1x iPad Pro (ID: 2) - Tablet
- Recarrega o carrinho para exibir os itens

## 🎯 Resultado Esperado

Após a automação, você verá:

1. **Login realizado** com o usuário `admim`
2. **Dashboard carregado** com informações do usuário
3. **Produtos exibidos** na grade de produtos
4. **Carrinho com 2 itens:**
   - 1x Galaxy S23 - R$ 2.999,99
   - 1x iPad Pro - R$ 5.499,99
   - **Total: R$ 8.499,98**

## 🔧 Configuração

### Credenciais de Teste
- **Usuário:** `admim`
- **Senha:** `123`

### Produtos Disponíveis
- **ID 1:** Galaxy S23 (Celular) - R$ 2.999,99
- **ID 2:** iPad Pro (Tablet) - R$ 5.499,99
- **ID 3:** iPhone 15 Pro (Celular) - R$ 6.999,99
- **ID 4:** Galaxy Tab S9 (Tablet) - R$ 3.999,99

## 🐛 Solução de Problemas

### Se a automação não funcionar:

1. **Verifique se o servidor está rodando:**
   ```bash
   npm start
   ```

2. **Verifique o console do navegador (F12)** para erros

3. **Teste a API manualmente:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admim","password":"123"}'
   ```

4. **Limpe o localStorage e tente novamente:**
   ```javascript
   localStorage.clear()
   location.reload()
   ```

## 📝 Logs da Automação

A automação exibe logs detalhados no console:

```
🚀 Iniciando automação...
📝 Preenchendo formulário de login...
✅ Formulário preenchido
🔐 Realizando login...
✅ Login realizado com sucesso
⏳ Aguardando carregamento dos produtos...
✅ 4 produtos carregados
🛒 Adicionando produtos ao carrinho...
📱 Adicionando celular...
📱 Adicionando tablet...
✅ Produtos adicionados ao carrinho
✅ Automação concluída com sucesso!
```

## 🎉 Funcionalidades Extras

- **Simulação de digitação** realista
- **Tratamento de erros** robusto
- **Feedback visual** com alertas
- **Logs detalhados** no console
- **Funções modulares** para reutilização

---

**Desenvolvido com ❤️ para demonstração de automação web** 