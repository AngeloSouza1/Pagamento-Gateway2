class User < ApplicationRecord
  has_secure_password

  validates :email, presence: true, uniqueness: { case_sensitive: false }
  validates :password, presence: true, length: { minimum: 6 }, if: :password_required?
  validates :role, presence: true, inclusion: { in: %w[user admin] }

  # Define um valor padrão para o role
  after_initialize do
    self.role ||= 'user'
  end

  private

  # Exige a senha somente ao criar um novo usuário ou ao alterar a senha
  def password_required?
    new_record? || password.present?
  end
end
