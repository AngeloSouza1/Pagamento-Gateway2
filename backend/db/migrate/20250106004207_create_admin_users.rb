class CreateAdminUsers < ActiveRecord::Migration[7.2]
  def change
    create_table :admin_users do |t|
      t.string :email
      t.string :password_digest
      t.boolean :admin

      t.timestamps
    end
  end
end
