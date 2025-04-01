import React, { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { createUserWithEmailAndPassword, AuthError } from "firebase/auth";
import { auth } from "../api/firebase";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError(t("register.errors.passwordMismatch"));
      return;
    }

    if (password.length < 6) {
      setError(t("register.errors.passwordLength"));
      return;
    }

    try {
      setError("");
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/products");
    } catch (err) {
      const error = err as AuthError;
      switch (error.code) {
        case "auth/email-already-in-use":
          setError(t("register.errors.emailInUse"));
          break;
        case "auth/invalid-email":
          setError(t("register.errors.invalidEmail"));
          break;
        case "auth/weak-password":
          setError(t("register.errors.weakPassword"));
          break;
        default:
          setError(t("register.errors.generalError"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">{t("register.title")}</h2>

          {error && (
            <Alert variant="danger" onClose={() => setError("")} dismissible>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>{t("register.form.emailLabel")}</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("register.form.emailPlaceholder")}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{t("register.form.passwordLabel")}</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("register.form.passwordPlaceholder")}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{t("register.form.confirmPasswordLabel")}</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("register.form.confirmPasswordPlaceholder")}
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}
            >
              {loading
                ? t("register.registeringButton")
                : t("register.registerButton")}
            </Button>
          </Form>

          <div className="mt-3 text-center">
            <p className="mb-0">
              {t("register.loginPrompt")}{" "}
              <Link to="/login">{t("register.loginLink")}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
