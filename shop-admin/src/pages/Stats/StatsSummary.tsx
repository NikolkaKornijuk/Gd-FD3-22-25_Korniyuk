import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";

interface StatItem {
  title: string;
  value: string | number;
  change: number;
}

interface StatsSummaryProps {
  stats: {
    totalProducts: { current: number; change: number };
    totalOrders: { current: number; change: number };
    completedOrders: { current: number; change: number };
    conversionRate: { current: number; change: number };
  };
}

const StatsSummary: React.FC<StatsSummaryProps> = ({ stats }) => {
  const { t } = useTranslation();

  const statItems: StatItem[] = [
    {
      title: t("stats.summary.totalProducts"),
      value: stats.totalProducts.current,
      change: stats.totalProducts.change,
    },
    {
      title: t("stats.summary.totalOrders"),
      value: stats.totalOrders.current,
      change: stats.totalOrders.change,
    },
    {
      title: t("stats.summary.completedOrders"),
      value: stats.completedOrders.current,
      change: stats.completedOrders.change,
    },
    {
      title: t("stats.summary.conversionRate"),
      value: `${stats.conversionRate.current.toFixed(1)}%`,
      change: stats.conversionRate.change,
    },
  ];

  return (
    <Row className="mb-4">
      {statItems.map((stat, idx) => (
        <Col md={3} key={idx} className="mb-3">
          <Card className="h-100">
            <Card.Body className="text-center">
              <h5 className="text-muted mb-3">{stat.title}</h5>
              <h2 className="mb-2">{stat.value}</h2>
              {stat.change !== 0 && (
                <small
                  className={stat.change > 0 ? "text-success" : "text-danger"}
                >
                  {stat.change > 0 ? "↑" : "↓"}{" "}
                  {Math.abs(stat.change).toFixed(1)}%
                </small>
              )}
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatsSummary;
