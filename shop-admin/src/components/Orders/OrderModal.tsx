import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Product, Order } from "../../types";
import { useTranslation } from "react-i18next";

interface OrderModalProps {
  show: boolean;
  onHide: () => void;
  order?: Order;
  products: Product[];
  onSubmit: (order: Omit<Order, "id">) => Promise<void> | void;
}

const OrderModal: React.FC<OrderModalProps> = ({
  show,
  onHide,
  order,
  products,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [status, setStatus] = useState<"pending" | "completed" | "cancelled">(
    "pending"
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setProductId(
        order?.productId && products.some((p) => p.id === order.productId)
          ? order.productId
          : ""
      );
      setQuantity(order?.quantity || 1);
      setCustomerName(order?.customerName || "");
      setCustomerEmail(order?.customerEmail || "");
      setStatus(order?.status || "pending");
      setEmailError("");
    }
  }, [order, show, products]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(customerEmail)) {
      setEmailError(t("orderModal.errors.invalidEmail"));
      return;
    }

    if (!productId) {
      return;
    }

    setIsLoading(true);
    setEmailError("");

    try {
      await onSubmit({
        productId,
        quantity,
        customerName,
        customerEmail,
        status,
      });
      onHide();
    } catch (error) {
      console.error(t("orderModal.errors.submitError"), error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "pending" || value === "completed" || value === "cancelled") {
      setStatus(value);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {order ? t("orderModal.editTitle") : t("orderModal.addTitle")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>{t("orderModal.productLabel")}</Form.Label>
            <Form.Select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
              disabled={isLoading}
            >
              <option value="">{t("orderModal.selectProduct")}</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({t("common.currencySymbol")}
                  {product.price})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("orderModal.quantityLabel")}</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
              disabled={isLoading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("orderModal.customerNameLabel")}</Form.Label>
            <Form.Control
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              disabled={isLoading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("orderModal.customerEmailLabel")}</Form.Label>
            <Form.Control
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              required
              disabled={isLoading}
              isInvalid={!!emailError}
            />
            {emailError && (
              <Form.Control.Feedback type="invalid">
                {emailError}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>{t("orderModal.statusLabel")}</Form.Label>
            <Form.Select
              value={status}
              onChange={handleStatusChange}
              required
              disabled={isLoading}
            >
              <option value="pending">{t("orderStatus.pending")}</option>
              <option value="completed">{t("orderStatus.completed")}</option>
              <option value="cancelled">{t("orderStatus.cancelled")}</option>
            </Form.Select>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onHide} disabled={isLoading}>
              {t("common.cancel")}
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isLoading || !productId}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  {t("common.saving")}
                </>
              ) : (
                t("common.save")
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default OrderModal;
