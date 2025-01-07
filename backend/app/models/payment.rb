# app/models/payment.rb
class Payment < ApplicationRecord
  validates :name, :email, :amount, presence: true
end