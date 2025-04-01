import React from "react";
import { Container, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";

interface LoadingErrorStateProps {
  loading: boolean;
  error?: string | null;
}

const LoadingErrorState: React.FC<LoadingErrorStateProps> = ({
  loading,
  error,
}) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" role="status" />
        <p className="mt-2">{t("common.loading")}</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4 text-center text-danger">
        <p>{t("common.errorLoading")}</p>
        <p>{error}</p>
      </Container>
    );
  }

  return null;
};

export default LoadingErrorState;
