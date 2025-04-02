import React, { useState } from "react";
import {
  Button,
  Form,
  Alert,
  ProgressBar,
  ListGroup,
  InputGroup,
} from "react-bootstrap";
import { createUserWithEmailAndPassword, AuthError } from "firebase/auth";
import { auth } from "../api/firebase";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Eye, EyeSlash } from "react-bootstrap-icons";

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 6) {
      errors.push(t("register.errors.passwordLength"));
    }
    if (!/[A-Z]/.test(password)) {
      errors.push(t("register.errors.passwordUppercase"));
    }
    if (!/[a-z]/.test(password)) {
      errors.push(t("register.errors.passwordLowercase"));
    }
    if (!/[0-9]/.test(password)) {
      errors.push(t("register.errors.passwordNumber"));
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push(t("register.errors.passwordSpecial"));
    }
    return errors;
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    return strength;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (!value) {
      setEmailError("");
    } else if (!validateEmail(value)) {
      setEmailError(t("register.errors.invalidEmail"));
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    const errors = validatePassword(value);
    setPasswordErrors(errors);
    setPasswordStrength(calculatePasswordStrength(value));

    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError(t("register.errors.passwordMismatch"));
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (password !== value) {
      setConfirmPasswordError(t("register.errors.passwordMismatch"));
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      setError(t("register.errors.fillAllFields"));
      return;
    }

    if (emailError || passwordErrors.length > 0 || confirmPasswordError) {
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

  const getPasswordStrengthVariant = () => {
    if (passwordStrength < 40) return "danger";
    if (passwordStrength < 80) return "warning";
    return "success";
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
                onChange={handleEmailChange}
                placeholder={t("register.form.emailPlaceholder")}
                isInvalid={!!emailError}
                required
              />
              <Form.Control.Feedback type="invalid">
                {emailError}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{t("register.form.passwordLabel")}</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder={t("register.form.passwordPlaceholder")}
                  isInvalid={passwordErrors.length > 0}
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
              {password && (
                <>
                  <ProgressBar
                    className="mt-2"
                    now={passwordStrength}
                    variant={getPasswordStrengthVariant()}
                    label={`${passwordStrength}%`}
                  />
                  <ListGroup className="mt-2">
                    {[
                      t("register.rules.minLength"),
                      t("register.rules.uppercase"),
                      t("register.rules.lowercase"),
                      t("register.rules.number"),
                      t("register.rules.specialChar"),
                    ].map((rule, index) => (
                      <ListGroup.Item
                        key={index}
                        variant={
                          passwordErrors.includes(rule) ? "danger" : "success"
                        }
                        className="py-1 px-2"
                      >
                        <small>
                          {passwordErrors.includes(rule) ? "✗" : "✓"} {rule}
                        </small>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{t("register.form.confirmPasswordLabel")}</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder={t("register.form.confirmPasswordPlaceholder")}
                  isInvalid={!!confirmPasswordError}
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={toggleConfirmPasswordVisibility}
                  aria-label={
                    showConfirmPassword
                      ? t("common.hidePassword")
                      : t("common.showPassword")
                  }
                >
                  {showConfirmPassword ? <EyeSlash /> : <Eye />}
                </Button>
              </InputGroup>
              <Form.Control.Feedback type="invalid">
                {confirmPasswordError}
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={
                loading ||
                !!emailError ||
                passwordErrors.length > 0 ||
                !!confirmPasswordError ||
                !email ||
                !password ||
                !confirmPassword
              }
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
