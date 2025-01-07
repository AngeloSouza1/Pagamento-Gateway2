import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axiosConfig";
import Navbar from "../components/Navbar";
import "./AdminView.css";

const AdminView = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    // Verificar se o token está presente
    if (!authToken) {
      setError("Acesso negado: token ausente");
      navigate("/login");
      return;
    }

    // Validar o token e carregar os pagamentos
    const fetchData = async () => {
      try {
        const response = await api.get("/admin/payments", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setPayments(response.data);
        setFilteredPayments(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Sessão expirada. Faça login novamente.");
          localStorage.removeItem("authToken");
          navigate("/login");
        } else {
          setError("Erro ao carregar os pagamentos.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Lógica de pesquisa com debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      const query = searchQuery.toLowerCase();
      const filtered = payments.filter((payment) => {
        const translatedStatus =
          payment.status === "approved" ? "aprovado" : "rejeitado";

        return (
          payment.name?.toLowerCase().includes(query) ||
          payment.email?.toLowerCase().includes(query) ||
          payment.amount?.toString().includes(query) ||
          translatedStatus.includes(query)
        );
      });
      setFilteredPayments(filtered);
    }, 300); // 300ms de debounce

    return () => clearTimeout(timeout);
  }, [searchQuery, payments]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  if (loading) {
    return <p className="loading">Carregando pagamentos...</p>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error">{error}</p>
        <button onClick={handleLogout} className="logout-button">
          Fazer logout
        </button>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Navbar */}
      <Navbar />

      {/* Pesquisa */}
      <div className="admin-header">
        <input
          type="text"
          placeholder="Pesquisar pagamentos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="admin-search-wide"
        />
      </div>

      {/* Tabela de pagamentos */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Criado em</th>
            
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id || "Não informado"}</td>
                  <td>{payment.name || "Não informado"}</td>
                  <td>{payment.email || "Não informado"}</td>
                  <td>
                    {payment.amount && !isNaN(payment.amount)
                      ? `R$ ${parseFloat(payment.amount).toFixed(2)}`
                      : "Valor inválido"}
                  </td>
                  <td
                    className={
                      payment.status === "approved"
                        ? "status-approved"
                        : "status-failed"
                    }
                  >
                    {payment.status === "approved" ? "Aprovado" : "Rejeitado"}
                  </td>
                  <td>
                    {payment.created_at
                      ? new Date(payment.created_at).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Não informado"}
                  </td>
                  
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-payments">
                  Nenhum pagamento encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

     
    </div>
  );
};

export default AdminView;
