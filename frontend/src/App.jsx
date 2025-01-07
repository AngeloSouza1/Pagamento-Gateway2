import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaymentForm from "./pages/PaymentForm";
import Confirmation from "./pages/Confirmation";
import LoginPage from "./pages/LoginPage";
import AdminView from "./pages/AdminView";
import CreateUserForm from "./pages/CreateUserForm"; 
import NotAuthorized from "./components/NotAuthorized";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rotas protegidas para usuários comuns */}
        <Route
          path="/payment"
          element={
            <ProtectedRoute role="user">
              <PaymentForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/confirmation"
          element={
            <ProtectedRoute role="user">
              <Confirmation />
            </ProtectedRoute>
          }
        />

        {/* Rotas protegidas para administradores */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create-user"
          element={
            <ProtectedRoute role="admin">
              <CreateUserForm />
            </ProtectedRoute>
          }
        />

        {/* Página de acesso negado */}
        <Route path="/not-authorized" element={<NotAuthorized />} />

        {/* Redireciona a rota raiz para o login */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;
