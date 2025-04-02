import React, { useState, useEffect } from "react";
import { Button, Form, Alert, InputGroup } from "react-bootstrap";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../api/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { Eye, EyeSlash } from "react-bootstrap-icons";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (currentUser) {
      navigate("/products");
    }
  }, [currentUser, navigate]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (!value) {
      setEmailError("");
    } else if (!validateEmail(value)) {
      setEmailError(t("loginPage.errors.invalidEmail"));
    } else {
      setEmailError("");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError(t("loginPage.errors.fillAllFields"));
      return;
    }

    if (emailError) {
      return;
    }

    try {
      setError("");
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/products");
    } catch (err) {
      const error = err as { code: string };
      console.error("Login error:", err);

      switch (error.code) {
        case "auth/invalid-email":
          setError(t("loginPage.errors.invalidEmail"));
          break;
        case "auth/user-disabled":
          setError(t("loginPage.errors.accountDisabled"));
          break;
        case "auth/user-not-found":
          setError(t("loginPage.errors.userNotFound"));
          break;
        case "auth/wrong-password":
          setError(t("loginPage.errors.wrongPassword"));
          break;
        default:
          setError(t("loginPage.errors.generalError"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">
            {t("loginPage.title")}
          </h2>

          {error && (
            <Alert variant="danger" onClose={() => setError("")} dismissible>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>{t("loginPage.emailLabel")}</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder={t("loginPage.emailPlaceholder")}
                isInvalid={!!emailError}
                required
              />
              <Form.Control.Feedback type="invalid">
                {emailError}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{t("loginPage.passwordLabel")}</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("loginPage.passwordPlaceholder")}
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={togglePasswordVisibility}
                  aria-label={
                    showPassword
                      ? t("common.hidePassword")
                      : t("common.showPassword")
                  }
                >
                  {showPassword ? <EyeSlash /> : <Eye />}
                </Button>
              </InputGroup>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 mt-3"
              disabled={loading || !!emailError}
            >
              {loading ? t("loginPage.loggingIn") : t("loginPage.loginButton")}
            </Button>
          </Form>

          <div className="mt-3 text-center">
            <p className="mb-1">
              {t("loginPage.noAccount")}{" "}
              <a href="/register">{t("loginPage.registerLink")}</a>
            </p>
            <p>
              <a href="/forgot-password">{t("loginPage.forgotPassword")}</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
