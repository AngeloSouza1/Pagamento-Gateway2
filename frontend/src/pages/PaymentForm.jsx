import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axiosConfig"; 
import "./PaymentForm.css";



const PaymentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: "",
    paymentMethod: "pix",
    cardNumber: "",
    expirationMonth: "",
    expirationYear: "",
    securityCode: "",
    identificationType: "CPF",
    identificationNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mercadoPagoInstance, setMercadoPagoInstance] = useState(null);
  const navigate = useNavigate();

    const handleLogout = () => {
      localStorage.removeItem("authToken");
      navigate("/login");
    };
  

  useEffect(() => {
    const loadMercadoPago = () => {
      if (window.MercadoPago) {
        const mp = new window.MercadoPago(
          process.env.MERCADOPAGO_PUBLIC_KEY,
          { locale: "pt-BR" }
        );
        setMercadoPagoInstance(mp);
      } else {
        console.error("MercadoPago SDK não foi carregado.");
      }
    };

    if (!window.MercadoPago) {
      const script = document.createElement("script");
      script.src = "https://sdk.mercadopago.com/js/v2";
      script.async = true;
      script.onload = loadMercadoPago;
      script.onerror = () =>
        console.error("Falha ao carregar o SDK do MercadoPago.");
      document.body.appendChild(script);
    } else {
      loadMercadoPago();
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const paymentData = {
        payment: {
          name: formData.name,
          email: formData.email,
          amount: parseFloat(formData.amount),
        },
        payment_method: formData.paymentMethod,
      };

      if (formData.paymentMethod === "credit_card") {
        const cardToken = await generateCardToken();
        paymentData.card_token = cardToken;
        paymentData.card_number = formData.cardNumber;
        paymentData.identification_type = formData.identificationType;
        paymentData.identification_number = formData.identificationNumber;
      }

      if (formData.paymentMethod === "bolbradesco") {
        paymentData.identification_number = formData.identificationNumber;
      }

      const response = await api.post("/payments", paymentData); 

      if (response.data.success) {
        navigate("/confirmation", {
          state: {
            message: response.data.message,
            boleto_url: response.data.boleto_url,
            pix_qr_code: response.data.pix_qr_code,
            pix_qr_code_link: response.data.pix_qr_code_link,
            paymentMethod: formData.paymentMethod,
            amount: formData.amount,
            name: formData.name,
            email: formData.email,
            transactionId: response.data.transaction_id,
            status: response.data.status,
          },
        });
      } else {
        setError(response.data.message || "Falha ao processar pagamento.");
      }
    } catch (err) {
      console.error("Erro ao processar pagamento:", err);
      setError("Erro ao enviar os dados. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const generateCardToken = async () => {
    if (!mercadoPagoInstance) {
      throw new Error("MercadoPago instance não está inicializada.");
    }

    try {
      const cardData = {
        cardNumber: formData.cardNumber,
        cardholderName: formData.name,
        cardExpirationMonth: formData.expirationMonth,
        cardExpirationYear: formData.expirationYear,
        securityCode: formData.securityCode,
        identificationType: formData.identificationType,
        identificationNumber: formData.identificationNumber,
      };

      const response = await mercadoPagoInstance.createCardToken(cardData);
      console.log("Token gerado com sucesso:", response.id);
      return response.id;
    } catch (err) {
      console.error("Erro ao gerar token do cartão:", err);
      throw new Error("Falha ao gerar token do cartão");
    }
  };

  return (
    <div className="payment-form-container">
      <button onClick={handleLogout} className="logout-user-button">
        Logout   
      </button>
      <h1 className="title">Pagamento Seguro</h1>
      <form onSubmit={handleSubmit} className="payment-form">
        <input
          name="name"
          placeholder="Nome completo"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          required
        />
        <input
          name="amount"
          placeholder="Valor (R$)"
          value={formData.amount}
          onChange={handleChange}
          type="number"
          required
        />
        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          required
        >
          <option value="pix">Pix</option>
          <option value="bolbradesco">Boleto</option>
          <option value="credit_card">Cartão de Crédito</option>
        </select>

        {formData.paymentMethod === "credit_card" && (
          <div className="credit-card-section">
            <input
              name="cardNumber"
              placeholder="Número do cartão"
              value={formData.cardNumber}
              onChange={handleChange}
              required
            />
            <div className="input-group">
              <input
                name="expirationMonth"
                placeholder="Mês (MM)"
                value={formData.expirationMonth}
                onChange={handleChange}
                required
              />
              <input
                name="expirationYear"
                placeholder="Ano (YYYY)"
                value={formData.expirationYear}
                onChange={handleChange}
                required
              />
            </div>
            <input
              name="securityCode"
              placeholder="CVV"
              value={formData.securityCode}
              onChange={handleChange}
              required
            />
            <input
              name="identificationType"
              placeholder="Tipo (CPF)"
              value={formData.identificationType}
              onChange={handleChange}
              required
            />
            <input
              name="identificationNumber"
              placeholder="Número"
              value={formData.identificationNumber}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {formData.paymentMethod === "bolbradesco" && (
          <div>
            <input
              name="identificationNumber"
              placeholder="CPF (ex.: 12345678909)"
              value={formData.identificationNumber}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Processando..." : "Pagar"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default PaymentForm;
