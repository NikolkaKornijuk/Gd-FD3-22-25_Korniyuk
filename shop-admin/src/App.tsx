import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import Navbar from "./components/common/Navbar";
import { useEffect } from "react";
import { useAppDispatch } from "./store/hooks";
import { listenToAuthChanges } from "./store/slices/authSlice";
import StatsPage from "./pages/Stats/StatsPage";
import NotFoundPage from "./pages/NotFoundPage";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentUser } = useAuth();
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(listenToAuthChanges());
  }, [dispatch]);
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <AuthProvider>
          <Navbar />
          <div className="container mt-4">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/products"
                element={
                  <PrivateRoute>
                    <ProductsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <PrivateRoute>
                    <OrdersPage />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Navigate to="/products" />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </I18nextProvider>
  );
};

export default App;
