class AdminController < ApplicationController
  before_action :authenticate_admin

  def payments
    payments = Payment.all
    render json: payments
  end

  private

  def authenticate_admin
    user = User.find_by(id: session[:user_id])
    unless user&.admin
      render json: { message: "Acesso negado" }, status: :forbidden
    end
  end
end
