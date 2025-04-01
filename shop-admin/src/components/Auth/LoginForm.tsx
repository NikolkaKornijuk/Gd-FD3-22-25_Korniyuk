import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../api/firebase";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/products");
    } catch (err) {
      const error = err as Error;
      setError(getLocalizedErrorMessage(error.message));
    }
  };

  const getLocalizedErrorMessage = (errorMessage: string): string => {
    if (errorMessage.includes("invalid-email")) {
      return t("login.errors.invalidEmail");
    }
    if (errorMessage.includes("user-not-found")) {
      return t("login.errors.userNotFound");
    }
    if (errorMessage.includes("wrong-password")) {
      return t("login.errors.wrongPassword");
    }
    return t("login.errors.generalError");
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4">{t("login.title")}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>{t("login.form.emailLabel")}</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder={t("login.form.emailPlaceholder")}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>{t("login.form.passwordLabel")}</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder={t("login.form.passwordPlaceholder")}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100">
          {t("login.submitButton")}
        </Button>
      </Form>
      <div className="mt-3 text-center">
        <p>
          {t("login.registerPrompt")}{" "}
          <a href="/register">{t("login.registerLink")}</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
