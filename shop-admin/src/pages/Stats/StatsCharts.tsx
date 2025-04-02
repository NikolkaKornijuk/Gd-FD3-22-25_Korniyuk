import React from "react";
import { Card, Tabs, Tab } from "react-bootstrap";
import { Bar, Pie, Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { BarChartFill, PieChartFill, GraphUp } from "react-bootstrap-icons";
import { motion } from "framer-motion";

interface StatsChartsProps {
  chartsData: {
    productSales: any;
    orderStatus: any;
    ordersOverTime: any;
  };
  chartOptions: any;
}

const StatsCharts: React.FC<StatsChartsProps> = ({
  chartsData,
  chartOptions,
}) => {
  const { t } = useTranslation();

  const chartTabs = [
    {
      key: "product",
      title: (
        <>
          <BarChartFill className="me-2" />
          {t("stats.charts.productSales.title")}
        </>
      ),
      chart: (
        <Bar
          data={chartsData.productSales}
          options={chartOptions}
          height={300}
        />
      ),
    },
    {
      key: "status",
      title: (
        <>
          <PieChartFill className="me-2" />
          {t("stats.charts.orderStatus.title")}
        </>
      ),
      chart: (
        <Pie
          data={chartsData.orderStatus}
          options={chartOptions}
          height={300}
        />
      ),
    },
    {
      key: "timeline",
      title: (
        <>
          <GraphUp className="me-2" />
          {t("stats.charts.ordersOverTime.title")}
        </>
      ),
      chart: (
        <Line
          data={chartsData.ordersOverTime}
          options={chartOptions}
          height={300}
        />
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-sm border-0">
        <Card.Body>
          <Tabs defaultActiveKey="product" className="mb-3">
            {chartTabs.map((tab) => (
              <Tab key={tab.key} eventKey={tab.key} title={tab.title}>
                <div style={{ height: "400px" }}>{tab.chart}</div>
              </Tab>
            ))}
          </Tabs>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default StatsCharts;
