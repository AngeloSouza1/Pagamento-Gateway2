import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";
import "./CreateUserForm.css";

const CreateUserForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessages([]);

    try {
      await axios.post("/admin/users", { user: formData });

      setSuccessMessage("🎉 Usuário criado com sucesso!");
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "user",
      });
    } catch (err) {
      console.error("Erro ao criar usuário:", err);

      const backendErrors = err.response?.data?.errors || ["Erro ao criar usuário."];
      setErrorMessages(backendErrors);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="form-container">
      <h1 className="form-title">👤 Criar Novo Usuário</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="input-group">
          <label htmlFor="name">📝 Nome</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Digite o nome"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">💌 Email</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Digite o email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">🔒 Senha</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Digite a senha"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="input-group">
          <label htmlFor="role">👥 Papel</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="form-select"
          >
            <option value="user">Usuário</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <button type="submit" className="form-button primary">
          🚀 Criar Usuário
        </button>
        <button type="button" className="form-button secondary" onClick={handleBack}>
          ↩️ Voltar
        </button>
      </form>
      {successMessage && <p className="form-success">{successMessage}</p>}
      {errorMessages.length > 0 && (
        <ul className="form-errors">
          {errorMessages.map((error, index) => (
            <li key={index}>❌ {error}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CreateUserForm;
