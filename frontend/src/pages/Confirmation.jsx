import React from "react";
import { useLocation, Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import "./Confirmation.css"; 

const Confirmation = () => {
  const location = useLocation();
  const {
    message,
    boleto_url,
    pix_qr_code,
    pix_qr_code_link,
    paymentMethod,
    amount,
    name,
    email,
    transactionId,
    status,
  } = location.state || {};

  return (
    <div className="confirmation-container">
      {/* Título */}
      <h1 className="confirmation-title">Confirmação de Pagamento</h1>

      {/* Mensagem Principal */}
      <p className="confirmation-status">
        <strong>Status:</strong> {message || "Sem detalhes disponíveis"}
      </p>

      {/* Informações em Colunas */}
      <div className="confirmation-row">
        {/* Dados do Cliente */}
        <div className="confirmation-box">
          <h2>Dados do Cliente</h2>
          <p><strong>Nome:</strong> {name || "N/A"}</p>
          <p><strong>Email:</strong> {email || "N/A"}</p>
        </div>

        {/* Detalhes da Operação */}
        <div className="confirmation-box">
          <h2>Detalhes da Operação</h2>
          <p><strong>Valor:</strong> {amount ? `R$ ${parseFloat(amount).toFixed(2)}` : "N/A"}</p>
          <p><strong>Método:</strong> {paymentMethod || "N/A"}</p>
          {transactionId && <p><strong>ID da Transação:</strong> {transactionId}</p>}
          {status && <p><strong>Status:</strong> {status}</p>}
        </div>
      </div>

      {/* Seção de Boleto */}
      {paymentMethod === "bolbradesco" && boleto_url && (
        <div className="confirmation-section">
          <h3>Boleto</h3>
          <p>Seu boleto foi gerado com sucesso. Acesse pelo link abaixo:</p>
          <a href={boleto_url} target="_blank" rel="noopener noreferrer" className="link-button">
            Acessar Boleto
          </a>
        </div>
      )}

      {/* Seção de Pix */}
      {paymentMethod === "pix" && (
        <div className="confirmation-section">
          <h3>Pagamento via Pix</h3>
          {pix_qr_code && (
            <>
              <div className="pix-section">
                <h4 className="pix-label">Linha Digitável</h4>
                <p className="pix-code">{pix_qr_code}</p>
              </div>
              <div className="qr-code-container">
                <QRCodeCanvas value={pix_qr_code} size={180} level="H" />
              </div>
              <p className="qr-code-link">
                {pix_qr_code_link && (
                  <a href={pix_qr_code_link} target="_blank" rel="noopener noreferrer" className="link-button">
                    Abrir QR Code Pix
                  </a>
                )}
              </p>
            </>
          )}
          <p><strong>ID da Transação:</strong> {transactionId}</p>
        </div>
      )}

      {/* Seção de Cartão de Crédito */}
      {paymentMethod === "credit_card" && (
        <div className="confirmation-section">
          <h3>Cartão de Crédito</h3>
          <p>Pagamento aprovado com sucesso.</p>
          <p><strong>ID da Transação:</strong> {transactionId}</p>
        </div>
      )}

      {/* Botão de Voltar */}
      <div className="confirmation-actions">
        <Link to="/payment" className="back-button">
          Voltar para o Pagamento
        </Link>
      </div>
    </div>
  );
};

export default Confirmation;
