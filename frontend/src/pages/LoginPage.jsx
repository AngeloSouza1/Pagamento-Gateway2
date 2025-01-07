import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css"; // Arquivo CSS atualizado

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        { email, password },
        { withCredentials: true }
      );

      console.log("Usuário logado:", response.data);
      localStorage.setItem("authToken", response.data.token);

      if (response.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/payment");
      }
    } catch (err) {
      console.error(err);
      setError("Credenciais inválidas");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">👋 Bem-vindo(a)!</h1>
        <p className="login-subtitle">Por favor, faça login para continuar.</p>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email">💌 Email</label>
            <input
              id="email"
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">🔒 Senha</label>
            <input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
          </div>
          <button type="submit" className="login-button">
            🔑 Entrar
          </button>
        </form>
        {error && <p className="login-error">❗ {error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
