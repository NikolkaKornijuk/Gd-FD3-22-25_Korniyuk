import React from "react";
import { Row, Col, Card, Badge } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Activity,
  Box,
  CheckCircle,
  Percent,
} from "react-bootstrap-icons";

interface StatItemProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
}

const StatItem: React.FC<StatItemProps> = ({ title, value, change, icon }) => {
  return (
    <Card className="h-100 shadow-sm border-0">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="text-muted mb-0">{title}</h6>
          <div className="icon-circle bg-light-primary">{icon}</div>
        </div>
        <div className="d-flex align-items-end">
          <h3 className="mb-0 me-2">{value}</h3>
          {change !== 0 && (
            <Badge bg={change > 0 ? "success" : "danger"} className="mb-1">
              {change > 0 ? (
                <ArrowUpCircle size={14} />
              ) : (
                <ArrowDownCircle size={14} />
              )}{" "}
              {Math.abs(change).toFixed(1)}%
            </Badge>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

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

  return (
    <Row className="mb-4 g-3">
      <Col md={3}>
        <StatItem
          title={t("stats.summary.totalProducts")}
          value={stats.totalProducts.current}
          change={stats.totalProducts.change}
          icon={<Box size={20} />}
        />
      </Col>
      <Col md={3}>
        <StatItem
          title={t("stats.summary.totalOrders")}
          value={stats.totalOrders.current}
          change={stats.totalOrders.change}
          icon={<Activity size={20} />}
        />
      </Col>
      <Col md={3}>
        <StatItem
          title={t("stats.summary.completedOrders")}
          value={stats.completedOrders.current}
          change={stats.completedOrders.change}
          icon={<CheckCircle size={20} />}
        />
      </Col>
      <Col md={3}>
        <StatItem
          title={t("stats.summary.conversionRate")}
          value={`${stats.conversionRate.current.toFixed(1)}%`}
          change={stats.conversionRate.change}
          icon={<Percent size={20} />}
        />
      </Col>
    </Row>
  );
};

export default StatsSummary;
