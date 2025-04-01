import React from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Container className="not-found-container d-flex flex-column align-items-center justify-content-center">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Row className="text-center mb-4">
          <Col>
            <div className="not-found-icon mb-3">
              <i className="bi bi-exclamation-triangle-fill"></i>
            </div>
            <h1 className="display-1 text-primary fw-bold">404</h1>
            <h2 className="mt-3 fw-normal">{t("notFound.title")}</h2>
            <p className="lead text-muted mt-3">{t("notFound.message")}</p>
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate("/")}
              className="not-found-btn px-4 py-2"
            >
              <i className="bi bi-house-door me-2"></i>
              {t("notFound.homeButton")}
            </Button>
          </Col>
        </Row>
      </motion.div>
    </Container>
  );
};

export default NotFoundPage;
