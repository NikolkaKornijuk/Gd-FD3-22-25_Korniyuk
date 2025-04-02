import React from "react";
import {
  Row,
  Col,
  Card,
  ButtonGroup,
  Button,
  Form,
  InputGroup,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { DatePicker } from "react-rainbow-components";

interface StatsFiltersProps {
  timeRange: "week" | "month" | "year" | "custom";
  selectedProduct: string;
  products: Array<{ id: string; name: string }>;
  startDate: Date | null;
  endDate: Date | null;
  onTimeRangeChange: (range: "week" | "month" | "year" | "custom") => void;
  onProductChange: (productId: string) => void;
  onDateChange: (start: Date | null, end: Date | null) => void;
}

const StatsFilters: React.FC<StatsFiltersProps> = ({
  timeRange,
  selectedProduct,
  products,
  startDate,
  endDate,
  onTimeRangeChange,
  onProductChange,
  onDateChange,
}) => {
  const { t } = useTranslation();

  // Функции для преобразования Date | null в Value и обратно
  const handleStartDateChange = (value: Date | undefined) => {
    onDateChange(value || null, endDate);
  };

  const handleEndDateChange = (value: Date | undefined) => {
    onDateChange(startDate, value || null);
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>{t("stats.filters.timeRange")}</Form.Label>
              <div className="mb-3">
                <ButtonGroup>
                  <Button
                    variant={
                      timeRange === "week" ? "primary" : "outline-secondary"
                    }
                    onClick={() => onTimeRangeChange("week")}
                  >
                    {t("stats.filters.week")}
                  </Button>
                  <Button
                    variant={
                      timeRange === "month" ? "primary" : "outline-secondary"
                    }
                    onClick={() => onTimeRangeChange("month")}
                  >
                    {t("stats.filters.month")}
                  </Button>
                  <Button
                    variant={
                      timeRange === "year" ? "primary" : "outline-secondary"
                    }
                    onClick={() => onTimeRangeChange("year")}
                  >
                    {t("stats.filters.year")}
                  </Button>
                  <Button
                    variant={
                      timeRange === "custom" ? "primary" : "outline-secondary"
                    }
                    onClick={() => onTimeRangeChange("custom")}
                  >
                    {t("stats.filters.custom")}
                  </Button>
                </ButtonGroup>
              </div>
              {timeRange === "custom" && (
                <InputGroup className="mb-3">
                  <DatePicker
                    value={startDate || undefined}
                    onChange={handleStartDateChange}
                    label={t("stats.filters.startDate")}
                    className="me-2"
                  />
                  <DatePicker
                    value={endDate || undefined}
                    onChange={handleEndDateChange}
                    label={t("stats.filters.endDate")}
                  />
                </InputGroup>
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>{t("stats.filters.product")}</Form.Label>
              <Form.Select
                value={selectedProduct}
                onChange={(e) => onProductChange(e.target.value)}
              >
                <option value="all">{t("stats.filters.allProducts")}</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default StatsFilters;
