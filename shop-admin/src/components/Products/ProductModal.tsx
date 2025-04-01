import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Product } from "../../types";
import { useTranslation } from "react-i18next";

interface ProductModalProps {
  show: boolean;
  onHide: () => void;
  product?: Product;
  onSubmit: (product: Omit<Product, "id">) => Promise<void> | void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  show,
  onHide,
  product,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    description: "",
    quantity: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    price: false,
    quantity: false,
  });

  useEffect(() => {
    if (show) {
      setFormData({
        name: product?.name || "",
        price: product?.price || 0,
        description: product?.description || "",
        quantity: product?.quantity || 0,
      });
      setTouched({
        name: false,
        price: false,
        quantity: false,
      });
      setIsLoading(false);
    }
  }, [product, show]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price"
          ? parseFloat(value) || 0
          : name === "quantity"
          ? parseInt(value) || 0
          : value,
    }));

    if (name in touched) {
      setTouched((prev) => ({ ...prev, [name]: true }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit(formData);
      onHide();
    } catch (error) {
      console.error(t("productModal.errors.saveError"), error);
    } finally {
      setIsLoading(false);
    }
  };

  const isNameValid = formData.name.trim().length > 0;
  const isPriceValid = formData.price >= 0;
  const isQuantityValid = formData.quantity >= 0;
  const isFormValid = isNameValid && isPriceValid && isQuantityValid;

  return (
    <Modal show={show} onHide={onHide} backdrop={isLoading ? "static" : true}>
      <Modal.Header closeButton={!isLoading}>
        <Modal.Title>
          {product ? t("productModal.editTitle") : t("productModal.addTitle")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>{t("productModal.nameLabel")}</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              isInvalid={touched.name && !isNameValid}
              required
              disabled={isLoading}
            />
            <Form.Control.Feedback type="invalid">
              {t("productModal.errors.nameRequired")}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              {t("productModal.priceLabel", {
                currency: t("common.currencySymbol"),
              })}
            </Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              isInvalid={touched.price && !isPriceValid}
              required
              min="0"
              step="0.01"
              disabled={isLoading}
            />
            <Form.Control.Feedback type="invalid">
              {t("productModal.errors.priceInvalid")}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("productModal.descriptionLabel")}</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>{t("productModal.quantityLabel")}</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              isInvalid={touched.quantity && !isQuantityValid}
              required
              min="0"
              disabled={isLoading}
            />
            <Form.Control.Feedback type="invalid">
              {t("productModal.errors.quantityInvalid")}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onHide} disabled={isLoading}>
              {t("common.cancel")}
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
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

export default ProductModal;
