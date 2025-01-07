# db/seeds.rb

puts "Seeding database..."

# Cria um usuário administrador
User.find_or_create_by!(email: "admin@example.com") do |user|
  user.name = "Admin User"
  user.password = "password"
  user.role = "admin"
end

# Cria dois usuários comuns
User.find_or_create_by!(email: "user1@example.com") do |user|
  user.name = "Common User 1"
  user.password = "password"
  user.role = "user"
end

User.find_or_create_by!(email: "user2@example.com") do |user|
  user.name = "Common User 2"
  user.password = "password"
  user.role = "user"
end

puts "Seeding complete!"
