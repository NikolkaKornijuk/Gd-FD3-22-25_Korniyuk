import React, { useEffect, useState, useMemo } from "react";
import {
  Button,
  Table,
  Form,
  InputGroup,
  Pagination,
  Dropdown,
} from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProducts, deleteProduct } from "../store/slices/productsSlice";
import ProductModal from "../components/Products/ProductModal";
import { addProduct, updateProduct } from "../api/client/products";
import { Product } from "../types";
import { FaSort, FaSortUp, FaSortDown, FaSearch } from "react-icons/fa";
import { useTranslation } from "react-i18next";

type SortDirection = "asc" | "desc";
type SortableField = keyof Pick<Product, "name" | "price" | "quantity">;

const pageSizeOptions = [5, 10, 20, 50, 100];

const ProductsPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    items: products,
    loading,
    error,
  } = useAppSelector((state) => state.products);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: SortableField;
    direction: SortDirection;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Reset to first page when itemsPerPage or search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchTerm]);

  const requestSort = (key: SortableField) => {
    let direction: SortDirection = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortableField) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <FaSort />;
    }
    return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  const processedProducts = useMemo(() => {
    let filteredProducts = [...products];

    if (searchTerm) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig !== null) {
      filteredProducts.sort((a, b) => {
        const aValue = a[sortConfig.key] ?? "";
        const bValue = b[sortConfig.key] ?? "";

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredProducts;
  }, [products, searchTerm, sortConfig]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = processedProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleItemsPerPageChange = (size: number) => {
    setItemsPerPage(size);
  };

  const handleAddProduct = () => {
    setCurrentProduct(undefined);
    setShowModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm(t("products.deleteConfirm"))) {
      dispatch(deleteProduct(id));
    }
  };

  const handleSubmit = async (productData: Omit<Product, "id">) => {
    try {
      if (currentProduct) {
        await updateProduct(currentProduct.id, productData);
      } else {
        await addProduct(productData);
      }
      dispatch(fetchProducts());
    } catch (err) {
      console.error(t("products.saveError"), err);
    }
  };

  if (loading)
    return <div className="text-center my-5">{t("common.loading")}</div>;
  if (error)
    return (
      <div className="alert alert-danger">
        {t("common.error")}: {error}
      </div>
    );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3 align-items-center">
        <h2>{t("products.title")}</h2>
        <div className="d-flex">
          <InputGroup className="me-3" style={{ width: "300px" }}>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder={t("products.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          <Button variant="primary" onClick={handleAddProduct}>
            {t("products.addButton")}
          </Button>
        </div>
      </div>

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead className="table-dark">
            <tr>
              <th>{t("products.columns.id")}</th>
              <th
                onClick={() => requestSort("name")}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  {t("products.columns.name")}
                  {getSortIcon("name")}
                </div>
              </th>
              <th
                onClick={() => requestSort("price")}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  {t("products.columns.price")}
                  {getSortIcon("price")}
                </div>
              </th>
              <th>{t("products.columns.description")}</th>
              <th
                onClick={() => requestSort("quantity")}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  {t("products.columns.quantity")}
                  {getSortIcon("quantity")}
                </div>
              </th>
              <th>{t("products.columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.description || "-"}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleEditProduct(product)}
                      className="me-2"
                    >
                      {t("common.edit")}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      {t("common.delete")}
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">
                  {t("products.noProducts")}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {processedProducts.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="d-flex align-items-center">
            <span className="me-2">{t("pagination.itemsPerPage")}:</span>
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-secondary"
                id="dropdown-items-per-page"
              >
                {itemsPerPage}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {pageSizeOptions.map((size) => (
                  <Dropdown.Item
                    key={size}
                    active={itemsPerPage === size}
                    onClick={() => handleItemsPerPageChange(size)}
                  >
                    {size}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="d-flex align-items-center">
            <span className="me-3">
              {t("pagination.showing")} {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, processedProducts.length)}{" "}
              {t("pagination.of")} {processedProducts.length}
            </span>
            <Pagination>
              <Pagination.First
                onClick={() => paginate(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Pagination.Item
                    key={pageNum}
                    active={pageNum === currentPage}
                    onClick={() => paginate(pageNum)}
                  >
                    {pageNum}
                  </Pagination.Item>
                );
              })}
              <Pagination.Next
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => paginate(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        </div>
      )}

      <ProductModal
        show={showModal}
        onHide={() => setShowModal(false)}
        product={currentProduct}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ProductsPage;
