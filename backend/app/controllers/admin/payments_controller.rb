class Admin::PaymentsController < ApplicationController

  def index
    @payments = Payment
                  .select(:id, :name, :email, :amount, :status, :created_at)
                  .order(created_at: :desc) 
    render json: @payments.to_json
  end
  
end
