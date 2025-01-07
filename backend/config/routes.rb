Rails.application.routes.draw do
  # Verificar saúde da aplicação
  get "up", to: "rails/health#show", as: :rails_health_check

  # Página inicial direcionada para o formulário de pagamento
  root "payments#new"

  # Rotas para autenticação geral
  post '/auth/login', to: 'auth#login' # Login com suporte a role (unificado para usuários e admins)

  # Rotas específicas para sessões de usuários comuns
  scope :auth do
    post "/login", to: "sessions#create"      # Login para usuários comuns
    delete "/logout", to: "sessions#destroy"  # Logout para usuários comuns
  end

  # Rotas específicas para sessões de administradores
  scope :admin_auth do
    post "/login", to: "sessions#create", defaults: { user_type: "admin" } # Login para administradores
    delete "/logout", to: "sessions#destroy"                              # Logout para administradores
  end

  # Rotas para pagamentos
  resources :payments, only: [:new, :create, :show]

  # Rotas protegidas para administradores
  namespace :admin do
    # Pagamentos
    resources :payments, only: [:index] # Listar pagamentos
    resources :users, only: [:new, :create] #novos usurios

    # Gerenciamento de usuários
    resources :users, only: [:index, :create, :destroy]        # Usuários comuns
    resources :admin_users, only: [:index, :create, :destroy]  # Administradores
  end
end
