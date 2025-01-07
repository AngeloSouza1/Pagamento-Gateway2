# app/controllers/auth_controller.rb
class AuthController < ApplicationController
  def login
    user = User.find_by(email: params[:email])

    if user&.authenticate(params[:password])
      secret_key = Rails.application.credentials.secret_key_base || ENV['SECRET_KEY_BASE']
      
      token = JWT.encode(
        { user_id: user.id, role: user.role, exp: 24.hours.from_now.to_i },
        secret_key
      )

      render json: { 
        token: token, 
        user: { id: user.id, email: user.email, role: user.role } 
      }, status: :ok
    else
      render json: { error: 'Credenciais inválidas' }, status: :unauthorized
    end
  end
end
