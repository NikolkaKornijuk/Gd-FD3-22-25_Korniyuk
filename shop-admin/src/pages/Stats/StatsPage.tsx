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
import {
  subDays,
  subMonths,
  subYears,
  isAfter,
  isBefore,
  format,
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import TopProducts from "./TopProducts";

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

  const [timeRange, setTimeRange] = useState<
    "week" | "month" | "year" | "custom"
  >("month");
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const [startDate, setStartDate] = useState<Date | null>(
    subMonths(new Date(), 1)
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const filteredOrders = useMemo(() => {
    let result = [...orders];
    const now = new Date();

    // Фильтрация по дате
    if (timeRange !== "custom") {
      let cutoffDate = new Date();

      if (timeRange === "week") {
        cutoffDate = subDays(now, 7);
      } else if (timeRange === "month") {
        cutoffDate = subMonths(now, 1);
      } else if (timeRange === "year") {
        cutoffDate = subYears(now, 1);
      }

      result = result.filter(
        (order) =>
          order.createdAt && isAfter(new Date(order.createdAt), cutoffDate)
      );
    } else if (startDate && endDate) {
      result = result.filter((order) => {
        if (!order.createdAt) return false;
        const orderDate = new Date(order.createdAt);
        return isAfter(orderDate, startDate) && isBefore(orderDate, endDate);
      });
    }

    // Фильтрация по продукту
    if (selectedProduct !== "all") {
      result = result.filter((order) => order.productId === selectedProduct);
    }

    return result;
  }, [orders, timeRange, selectedProduct, startDate, endDate]);

  const getPreviousPeriodOrders = useMemo(() => {
    if (timeRange === "custom" && startDate && endDate) {
      const diff = endDate.getTime() - startDate.getTime();
      const prevStartDate = new Date(startDate.getTime() - diff);
      const prevEndDate = new Date(startDate);

      return orders.filter((order) => {
        if (!order.createdAt) return false;
        const orderDate = new Date(order.createdAt);
        return (
          isAfter(orderDate, prevStartDate) && isBefore(orderDate, prevEndDate)
        );
      });
    }

    let prevCutoffDate = new Date();
    let cutoffDate = new Date();

    if (timeRange === "week") {
      cutoffDate = subDays(prevCutoffDate, 7);
      prevCutoffDate = subDays(cutoffDate, 7);
    } else if (timeRange === "month") {
      cutoffDate = subMonths(prevCutoffDate, 1);
      prevCutoffDate = subMonths(cutoffDate, 1);
    } else {
      cutoffDate = subYears(prevCutoffDate, 1);
      prevCutoffDate = subYears(cutoffDate, 1);
    }

    return orders.filter((order) => {
      if (!order.createdAt) return false;
      const orderDate = new Date(order.createdAt);
      return (
        isAfter(orderDate, prevCutoffDate) && isBefore(orderDate, cutoffDate)
      );
    });
  }, [orders, timeRange, startDate, endDate]);

  const stats = useMemo<StatsData>(() => {
    const prevPeriodFilteredOrders =
      selectedProduct !== "all"
        ? getPreviousPeriodOrders.filter(
            (order) => order.productId === selectedProduct
          )
        : getPreviousPeriodOrders;

    // Текущие значения
    const currentOrdersCount = filteredOrders.length;
    const currentCompleted = filteredOrders.filter(
      (o) => o.status === "completed"
    ).length;
    const currentConversion = currentOrdersCount
      ? (currentCompleted / currentOrdersCount) * 100
      : 0;

    // Предыдущие значения
    const previousOrdersCount = prevPeriodFilteredOrders.length;
    const previousCompleted = prevPeriodFilteredOrders.filter(
      (o) => o.status === "completed"
    ).length;
    const previousConversion = previousOrdersCount
      ? (previousCompleted / previousOrdersCount) * 100
      : 0;

    // Расчет изменений
    const calculateChange = (current: number, previous: number) =>
      previous !== 0
        ? ((current - previous) / previous) * 100
        : current !== 0
        ? 100
        : 0;

    return {
      totalProducts: {
        current: products.length,
        previous: products.length,
        change: 0,
      },
      totalOrders: {
        current: currentOrdersCount,
        previous: previousOrdersCount,
        change: calculateChange(currentOrdersCount, previousOrdersCount),
      },
      completedOrders: {
        current: currentCompleted,
        previous: previousCompleted,
        change: calculateChange(currentCompleted, previousCompleted),
      },
      conversionRate: {
        current: currentConversion,
        previous: previousConversion,
        change: calculateChange(currentConversion, previousConversion),
      },
    };
  }, [products, filteredOrders, getPreviousPeriodOrders, selectedProduct]);

  const calculatePercentages = (data: number[]) => {
    const total = data.reduce((a, b) => a + b, 0);
    return data.map((value) =>
      total > 0 ? Math.round((value / total) * 100) : 0
    );
  };

  const chartsData = useMemo(() => {
    const orderStatusData = [
      filteredOrders.filter((o) => o.status === "pending").length,
      filteredOrders.filter((o) => o.status === "completed").length,
      filteredOrders.filter((o) => o.status === "cancelled").length,
    ];

    const productSalesData = products.map(
      (product) =>
        filteredOrders.filter((order) => order.productId === product.id).length
    );

    // Группировка по дням/неделям/месяцам в зависимости от выбранного периода
    let groupFormat = "MMM yyyy";
    if (
      timeRange === "week" ||
      (timeRange === "custom" &&
        startDate &&
        endDate &&
        endDate.getTime() - startDate.getTime() < 30 * 24 * 60 * 60 * 1000)
    ) {
      groupFormat = "dd MMM";
    }

    const ordersByDate: Record<string, number> = {};
    filteredOrders.forEach((order) => {
      if (!order.createdAt) return;
      const dateKey = format(new Date(order.createdAt), groupFormat);
      ordersByDate[dateKey] = (ordersByDate[dateKey] || 0) + 1;
    });

    const sortedDates = Object.keys(ordersByDate).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

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
        labels: sortedDates,
        datasets: [
          {
            label: t("stats.charts.ordersOverTime.label"),
            data: sortedDates.map((date) => ordersByDate[date]),
            borderColor: "rgba(255, 159, 64, 1)",
            backgroundColor: "rgba(255, 159, 64, 0.5)",
            tension: 0.1,
            fill: true,
          },
        ],
      },
    };
  }, [products, filteredOrders, t, timeRange, startDate, endDate]);

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

  const handleExport = (type: "json") => {
    const data = {
      products,
      orders: filteredOrders,
      stats,
      chartsData,
      filters: {
        timeRange,
        selectedProduct,
        startDate,
        endDate,
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stats-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const handleRefresh = () => {
    dispatch(fetchProducts());
    dispatch(fetchOrders());
  };

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchOrders());
  }, [dispatch]);

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
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <StatsHeader onRefresh={handleRefresh} onExport={handleExport} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <StatsFilters
              timeRange={timeRange}
              selectedProduct={selectedProduct}
              products={products}
              startDate={startDate}
              endDate={endDate}
              onTimeRangeChange={setTimeRange}
              onProductChange={setSelectedProduct}
              onDateChange={(start, end) => {
                setStartDate(start);
                setEndDate(end);
                if (start && end) setTimeRange("custom");
              }}
            />
          </motion.div>

          <StatsSummary stats={stats} />

          <StatsCharts chartsData={chartsData} chartOptions={chartOptions} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-4"
          >
            <TopProducts products={products} orders={filteredOrders} />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </Container>
  );
};

export default StatsPage;
