class SessionsController < ApplicationController
  def encode_token(payload)
    JWT.encode(payload, ENV['JWT_SECRET_KEY'])
  end

  def create
    user = User.find_by(email: params[:email]) || AdminUser.find_by(email: params[:email])

    if user&.authenticate(params[:password])
 
      token = encode_token({ user_id: user.id })

        is_admin = user.is_a?(AdminUser)

      render json: { message: "Usuário logado com sucesso!", token: token, admin: is_admin }, status: :ok
    else
      render json: { error: "Credenciais inválidas" }, status: :unauthorized
    end
  rescue StandardError => e
    render json: { error: "Erro no servidor: #{e.message}" }, status: :internal_server_error
  end
end
