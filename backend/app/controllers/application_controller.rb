class ApplicationController < ActionController::API
  def authenticate_user!
    token = request.headers['Authorization']
    decoded = JWT.decode(token, Rails.application.secrets.secret_key_base)[0]
    @current_user = User.find(decoded['user_id'])
  rescue
    render json: { error: 'Unauthorized' }, status: :unauthorized
  end

  def authenticate_admin!
    authenticate_user!
    render json: { error: 'Forbidden' }, status: :forbidden unless @current_user.role == 'admin'
  end
end
