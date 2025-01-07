class Admin::UsersController < ApplicationController
  before_action :authenticate_admin!

  def create

    Rails.logger.debug "Parâmetros recebidos: #{params.inspect}"

    user = User.new(user_params)

    if user.save
      render json: { message: 'Usuário criado com sucesso.', user: user }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :role)
  end

  def authenticate_admin!
    token = request.headers['Authorization']&.split(' ')&.last
    decoded_token = JWT.decode(token, Rails.application.credentials.secret_key_base)[0]
    current_user = User.find(decoded_token['user_id'])

    render json: { error: 'Acesso não autorizado' }, status: :unauthorized unless current_user.role == 'admin'
  rescue
    render json: { error: 'Token inválido' }, status: :unauthorized
  end
end
