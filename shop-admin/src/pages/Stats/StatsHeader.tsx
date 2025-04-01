import React from "react";
import { ButtonGroup, Button } from "react-bootstrap";
import { FiRefreshCw } from "react-icons/fi";
import { useTranslation } from "react-i18next";

interface StatsHeaderProps {
  onRefresh: () => void;
  onExport: (type: "csv" | "json") => void;
}

const StatsHeader: React.FC<StatsHeaderProps> = ({ onRefresh, onExport }) => {
  const { t } = useTranslation();

  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2>{t("stats.title")}</h2>
      <div>
        <ButtonGroup className="me-2">
          <Button variant="outline-primary" size="sm" onClick={onRefresh}>
            <FiRefreshCw className="me-1" />
            {t("common.refresh")}
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => onExport("json")}
          >
            {t("stats.export.json")}
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => onExport("csv")}
          >
            {t("stats.export.csv")}
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

export default StatsHeader;
