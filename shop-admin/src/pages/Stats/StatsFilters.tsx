import React from "react";
import { Row, Col, Card, ButtonGroup, Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";

interface StatsFiltersProps {
  timeRange: "week" | "month" | "year";
  selectedProduct: string;
  products: Array<{ id: string; name: string }>;
  onTimeRangeChange: (range: "week" | "month" | "year") => void;
  onProductChange: (productId: string) => void;
}

const StatsFilters: React.FC<StatsFiltersProps> = ({
  timeRange,
  selectedProduct,
  products,
  onTimeRangeChange,
  onProductChange,
}) => {
  const { t } = useTranslation();

  return (
    <Card className="mb-4">
      <Card.Body>
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>{t("stats.filters.timeRange")}</Form.Label>
              <div>
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
                </ButtonGroup>
              </div>
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
