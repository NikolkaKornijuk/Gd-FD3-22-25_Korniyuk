import React, { useEffect, useState, useMemo } from "react";
import { Container } from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchProducts } from "../../store/slices/productsSlice";
import { fetchOrders } from "../../store/slices/ordersSlice";
import { useTranslation } from "react-i18next";
import StatsHeader from "./StatsHeader";
import StatsFilters from "./StatsFilters";
import StatsSummary from "./StatsSummary";
import StatsCharts from "./StatsCharts";
import LoadingErrorState from "./LoadingErrorState";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  ChartDataLabels
);

interface ChartData {
  labels: string[];
  datasets: {
    label?: string;
    data: number[];
    percentages?: number[];
    backgroundColor: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    tension?: number;
    fill?: boolean;
  }[];
}

interface StatsData {
  totalProducts: { current: number; previous: number; change: number };
  totalOrders: { current: number; previous: number; change: number };
  completedOrders: { current: number; previous: number; change: number };
  conversionRate: { current: number; previous: number; change: number };
}

const StatsPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    items: products,
    loading: productsLoading,
    error: productsError,
  } = useAppSelector((state) => state.products);
  const {
    items: orders,
    loading: ordersLoading,
    error: ordersError,
  } = useAppSelector((state) => state.orders);

  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">(
    "month"
  );
  const [selectedProduct, setSelectedProduct] = useState<string>("all");

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    const now = new Date();
    const cutoffDate = new Date();

    if (timeRange === "week") {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (timeRange === "month") {
      cutoffDate.setMonth(now.getMonth() - 1);
    } else {
      cutoffDate.setFullYear(now.getFullYear() - 1);
    }

    result = result.filter(
      (order) => new Date(order.createdAt || "") >= cutoffDate
    );

    if (selectedProduct !== "all") {
      result = result.filter((order) => order.productId === selectedProduct);
    }

    return result;
  }, [orders, timeRange, selectedProduct]);

  const stats = useMemo<StatsData>(() => {
    const prevPeriodOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt || "");
      const now = new Date();
      const cutoffDate = new Date();

      if (timeRange === "week") {
        cutoffDate.setDate(now.getDate() - 14);
      } else if (timeRange === "month") {
        cutoffDate.setMonth(now.getMonth() - 2);
      } else {
        cutoffDate.setFullYear(now.getFullYear() - 2);
      }

      const prevCutoffDate = new Date(cutoffDate);
      if (timeRange === "week") {
        prevCutoffDate.setDate(cutoffDate.getDate() - 7);
      } else if (timeRange === "month") {
        prevCutoffDate.setMonth(cutoffDate.getMonth() - 1);
      } else {
        prevCutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
      }

      return orderDate >= prevCutoffDate && orderDate < cutoffDate;
    }).length;

    const currentOrdersCount = filteredOrders.length;
    const previousOrdersCount = prevPeriodOrders;
    const ordersChange = previousOrdersCount
      ? ((currentOrdersCount - previousOrdersCount) / previousOrdersCount) * 100
      : 0;

    return {
      totalProducts: {
        current: products.length,
        previous: 0,
        change: 0,
      },
      totalOrders: {
        current: currentOrdersCount,
        previous: previousOrdersCount,
        change: ordersChange,
      },
      completedOrders: {
        current: filteredOrders.filter((o) => o.status === "completed").length,
        previous: 0,
        change: 0,
      },
      conversionRate: {
        current: filteredOrders.length
          ? (filteredOrders.filter((o) => o.status === "completed").length /
              filteredOrders.length) *
            100
          : 0,
        previous: 0,
        change: 0,
      },
    };
  }, [products, filteredOrders, orders, timeRange]);

  const calculatePercentages = (data: number[]) => {
    const total = data.reduce((a, b) => a + b, 0);
    return data.map((value) =>
      total > 0 ? Math.round((value / total) * 100) : 0
    );
  };

  const chartsData = useMemo<{
    productQuantity: ChartData;
    orderStatus: ChartData;
    productSales: ChartData;
    ordersOverTime: ChartData;
  }>(() => {
    const orderStatusData = [
      filteredOrders.filter((o) => o.status === "pending").length,
      filteredOrders.filter((o) => o.status === "completed").length,
      filteredOrders.filter((o) => o.status === "cancelled").length,
    ];

    const productSalesData = products.map(
      (product) =>
        filteredOrders.filter((order) => order.productId === product.id).length
    );

    const ordersOverTimeData = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      return filteredOrders.filter((order) => {
        const orderDate = new Date(order.createdAt || "");
        return (
          orderDate.getMonth() === date.getMonth() &&
          orderDate.getFullYear() === date.getFullYear()
        );
      }).length;
    });

    return {
      productQuantity: {
        labels: products.map((p) => p.name),
        datasets: [
          {
            label: t("stats.charts.productQuantity.label"),
            data: products.map((p) => p.quantity),
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      orderStatus: {
        labels: [
          t("orders.status.pending"),
          t("orders.status.completed"),
          t("orders.status.cancelled"),
        ],
        datasets: [
          {
            data: orderStatusData,
            percentages: calculatePercentages(orderStatusData),
            backgroundColor: [
              "rgba(255, 206, 86, 0.5)",
              "rgba(75, 192, 192, 0.5)",
              "rgba(255, 99, 132, 0.5)",
            ],
            borderColor: [
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(255, 99, 132, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      productSales: {
        labels: products.map((p) => p.name),
        datasets: [
          {
            label: t("stats.charts.productSales.label"),
            data: productSalesData,
            percentages: calculatePercentages(productSalesData),
            backgroundColor: "rgba(153, 102, 255, 0.5)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
          },
        ],
      },
      ordersOverTime: {
        labels: Array.from({ length: 12 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - (11 - i));
          return t(`months.${date.getMonth()}`);
        }),
        datasets: [
          {
            label: t("stats.charts.ordersOverTime.label"),
            data: ordersOverTimeData,
            percentages: calculatePercentages(ordersOverTimeData),
            borderColor: "rgba(255, 159, 64, 1)",
            backgroundColor: "rgba(255, 159, 64, 0.5)",
            tension: 0.1,
            fill: true,
          },
        ],
      },
    };
  }, [products, filteredOrders, t]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        display: true,
        color: "#fff",
        font: {
          weight: "bold" as const,
          size: 12,
        },
        formatter: (value: number, context: any) => {
          const dataset = context.dataset;
          const percentages = dataset.percentages;
          return percentages && percentages[context.dataIndex] > 0
            ? `${percentages[context.dataIndex]}%`
            : "";
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || "";
            const value = context.raw || 0;
            return `${label}: ${value}`;
          },
          afterLabel: (context: any) => {
            const dataset = context.dataset;
            const percentages = dataset.percentages;
            return percentages
              ? `${t("stats.percentage")}: ${percentages[context.dataIndex]}%`
              : "";
          },
        },
      },
      legend: {
        position: "top" as const,
      },
    },
  };

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleExport = (type: "csv" | "json") => {
    const data = {
      products,
      orders: filteredOrders,
      stats,
      chartsData,
      filters: {
        timeRange,
        selectedProduct,
      },
    };

    if (type === "json") {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `stats-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
    } else {
      const headers = [
        t("stats.export.headers.id"),
        t("stats.export.headers.product"),
        t("stats.export.headers.customer"),
        t("stats.export.headers.status"),
        t("stats.export.headers.date"),
      ];
      const csvRows = [
        headers.join(","),
        ...filteredOrders.map((order) =>
          [
            order.id,
            products.find((p) => p.id === order.productId)?.name ||
              t("stats.unknownProduct"),
            order.customerName,
            t(`orders.status.${order.status}`),
            order.createdAt,
          ]
            .map((field) => `"${field}"`)
            .join(",")
        ),
      ];

      const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders-export-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
    }
  };

  const handleRefresh = () => {
    dispatch(fetchProducts());
    dispatch(fetchOrders());
  };

  if (productsLoading || ordersLoading) {
    return <LoadingErrorState loading={true} />;
  }

  if (productsError || ordersError) {
    return (
      <LoadingErrorState error={productsError || ordersError} loading={false} />
    );
  }

  return (
    <Container className="py-4">
      <StatsHeader onRefresh={handleRefresh} onExport={handleExport} />

      <StatsFilters
        timeRange={timeRange}
        selectedProduct={selectedProduct}
        products={products}
        onTimeRangeChange={setTimeRange}
        onProductChange={setSelectedProduct}
      />

      <StatsSummary stats={stats} />

      <StatsCharts chartsData={chartsData} chartOptions={chartOptions} />
    </Container>
  );
};

export default StatsPage;
