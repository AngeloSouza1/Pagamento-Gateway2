import React from "react";
import { Link } from "react-router-dom";

const NotAuthorized = () => {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Acesso Negado</h1>
      <p>Você não tem permissão para acessar esta página.</p>
      <Link to="/login" style={{ color: "#4CAF50", textDecoration: "none" }}>
        Voltar para o Login
      </Link>
    </div>
  );
};

export default NotAuthorized;
