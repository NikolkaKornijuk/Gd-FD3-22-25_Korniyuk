import React, { useMemo } from "react";
import { Card, ListGroup, Badge } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Trophy } from "react-bootstrap-icons";

interface TopProductsProps {
  products: Array<{ id: string; name: string }>;
  orders: Array<{ productId: string }>;
}

const TopProducts: React.FC<TopProductsProps> = ({ products, orders }) => {
  const { t } = useTranslation();

  const topProducts = useMemo(() => {
    const productCounts = orders.reduce((acc, order) => {
      acc[order.productId] = (acc[order.productId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return products
      .map((product) => ({
        ...product,
        orderCount: productCounts[product.id] || 0,
      }))
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, 5);
  }, [products, orders]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-sm border-0">
        <Card.Header className="d-flex align-items-center">
          <Trophy className="me-2 text-warning" size={20} />
          <h5 className="mb-0">{t("stats.topProducts.title")}</h5>
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            {topProducts.map((product, index) => (
              <ListGroup.Item key={product.id} className="py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <Badge
                      bg={index < 3 ? "warning" : "light"}
                      text={index < 3 ? "dark" : "dark"}
                      className="me-3"
                      style={{
                        width: "30px",
                        height: "30px",
                        fontSize: "1rem",
                      }}
                    >
                      {index + 1}
                    </Badge>
                    <span>{product.name}</span>
                  </div>
                  <Badge bg="primary" pill>
                    {product.orderCount} {t("stats.topProducts.orders")}
                  </Badge>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default TopProducts;
