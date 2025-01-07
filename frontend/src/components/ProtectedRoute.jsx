import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("authToken");

  // 1. Verifica se o token está presente
  if (!token) {
    console.warn("Token ausente. Redirecionando para /login.");
    return <Navigate to="/login" />;
  }

  try {
    // 2. Decodifica o payload do token JWT
    const payload = JSON.parse(atob(token.split(".")[1])); // Decodifica o token
    const userRole = payload.role; // Obtém o papel do usuário

    // 3. Valida o papel do usuário, se especificado
    if (role && userRole !== role) {
      console.warn(`Acesso negado: necessário ${role}, papel do usuário é ${userRole}`);
      return <Navigate to="/not-authorized" />;
    }
  } catch (err) {
    console.error("Erro ao processar o token JWT:", err);
    return <Navigate to="/login" />;
  }

  // 4. Permite o acesso ao componente filho se todas as condições forem atendidas
  return children;
};

export default ProtectedRoute;
