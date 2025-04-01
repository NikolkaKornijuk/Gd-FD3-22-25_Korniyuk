import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { Bar, Pie, Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { ChartOptions } from "chart.js";

interface StatsChartsProps {
  chartsData: {
    productQuantity: any;
    orderStatus: any;
    productSales: any;
    ordersOverTime: any;
  };
  chartOptions: ChartOptions;
}

const StatsCharts: React.FC<StatsChartsProps> = ({
  chartsData,
  chartOptions,
}) => {
  const { t } = useTranslation();

  const barChartOptions: ChartOptions<"bar"> = {
    ...chartOptions,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      ...chartOptions.plugins,
      datalabels: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  const pieChartOptions: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        position: "right",
      },
      datalabels: {
        formatter: (value: number, context: any) => {
          const dataset = context.dataset;
          const percentages = dataset.percentages;
          return percentages && percentages[context.dataIndex] > 0
            ? `${value}\n(${percentages[context.dataIndex]}%)`
            : "";
        },
        color: "#fff",
        font: {
          weight: "bold",
          size: 12,
        },
      },
    },
  };

  const lineChartOptions: ChartOptions<"line"> = {
    ...chartOptions,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      ...chartOptions.plugins,
      datalabels: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <>
      <Row className="g-4 mb-4">
        <Col lg={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>{t("stats.charts.productQuantity.title")}</Card.Title>
              <div style={{ height: "300px" }}>
                <Bar
                  data={chartsData.productQuantity}
                  options={barChartOptions}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>{t("stats.charts.orderStatus.title")}</Card.Title>
              <div style={{ height: "300px" }}>
                <Pie data={chartsData.orderStatus} options={pieChartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col lg={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>{t("stats.charts.productSales.title")}</Card.Title>
              <div style={{ height: "300px" }}>
                <Bar
                  data={chartsData.productSales}
                  options={{
                    ...barChartOptions,
                    plugins: {
                      ...barChartOptions.plugins,
                      datalabels: {
                        ...barChartOptions.plugins?.datalabels,
                        display: (context: any) => {
                          const data = context.dataset.data as number[];
                          const value = data[context.dataIndex];
                          const maxValue = Math.max(...data);
                          return value > maxValue * 0.2;
                        },
                      },
                    },
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>{t("stats.charts.ordersOverTime.title")}</Card.Title>
              <div style={{ height: "300px" }}>
                <Line
                  data={chartsData.ordersOverTime}
                  options={lineChartOptions}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default StatsCharts;
