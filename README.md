MercadoPago Integration

Este é um projeto de integração com o MercadoPago, desenvolvido com Ruby on Rails no backend e React no frontend. Ele permite que os usuários realizem pagamentos e os administradores gerenciem transações e usuários.
Recursos

   - Login de Usuários:
       - Login de usuários comuns e administradores.
       - Redirecionamento com base no papel do usuário.

   - Gerenciamento de Usuários:
        - Criar novos usuários diretamente na interface de administração.

   - Pagamentos:
        - Integração com a API do MercadoPago para processar pagamentos.

Tecnologias Utilizadas

   - Backend: Ruby on Rails
   - Frontend: React com Vite
   - Banco de Dados: PostgreSQL
   - Autenticação: JWT
   - Bibliotecas: HTTParty, Axios

Configuração do Projeto
Requisitos

 -  Ruby (>= 3.3.4)
 -  Node.js (>= 16.0)
 -  PostgreSQL
 -  Yarn ou NPM
 -  MercadoPago API Key e Public Key

Passos para Configuração
  
  1. Clone o Repositório
  ```
   git clone https://github.com/seu-usuario/mercadopago-integration.git
   cd mercadopago-integration
  ```

2. Configuração do Backend

   - 1 Instale as dependências:
     
    ```
    cd backend
    bundle install
    ```
    - 2 Configure o banco de dados:
       
     ```
     rails db:create db:migrate db:seed
     ```
    - 3 Adicione as variáveis de ambiente: Crie um arquivo .env na pasta backend:

    ```
    MERCADOPAGO_ACCESS_TOKEN=YOUR_ACCESS_TOKEN
    MERCADOPAGO_PUBLIC_KEY=YOUR_PUBLIC_KEY
    ```
  
   - 4 Inicie o servidor:
 
    ```
    cd frontend
    npm install
    ```
    
3. Configuração do Frontend

   - 1 Instale as dependências:
     
    ```
    cd frontend
    npm install
    ```
    - 2 Adicione as variáveis de ambiente: Crie um arquivo .env.local na pasta frontend:
       
     ```
     REACT_APP_MERCADOPAGO_PUBLIC_KEY=YOUR_PUBLIC_KEY
     ```
    - 3 Inicie o servidor:

    ```
    npm run dev
    ```
    Variáveis de Ambiente
    
    Certifique-se de configurar as seguintes variáveis:
    
        Backend:
            MERCADOPAGO_ACCESS_TOKEN: Token de acesso privado da API do MercadoPago.
        Frontend:
            REACT_APP_MERCADOPAGO_PUBLIC_KEY: Chave pública para o SDK do MercadoPago.
    
    Rotas Principais
    Frontend
    
        /login: Tela de login.
        /payment: Formulário de pagamento.
        /confirmation: Confirmação de pagamento.
        /admin: Painel administrativo.
        /admin/create-user: Formulário de criação de usuários.
    
    Backend
    
        POST /auth/login: Login de usuários.
        POST /admin/users: Criar um novo usuário.
        POST /payments: Processar um pagamento via MercadoPago.
  
 

















