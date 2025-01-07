# app/models/admin_user.rb
class AdminUser < ApplicationRecord
  has_secure_password

  validates :email, presence: true, uniqueness: true
  validates :admin, inclusion: { in: [true, false] }
end
