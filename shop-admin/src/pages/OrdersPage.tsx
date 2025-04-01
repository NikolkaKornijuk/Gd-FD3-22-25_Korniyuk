import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Table,
  Form,
  InputGroup,
  Badge,
  Pagination,
  Dropdown,
} from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchOrders, deleteOrder } from "../store/slices/ordersSlice";
import OrderModal from "../components/Orders/OrderModal";
import { addOrder, updateOrder } from "../api/client/orders";
import { Order, Product } from "../types";
import { FaSort, FaSortUp, FaSortDown, FaSearch } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

type SortDirection = "asc" | "desc";
type SortableField = keyof Pick<
  Order,
  | "quantity"
  | "customerName"
  | "customerEmail"
  | "status"
  | "createdAt"
  | "updatedAt"
>;
type SearchableField =
  | keyof Pick<Order, "customerName" | "customerEmail" | "status">
  | "productName";

const pageSizeOptions = [5, 10, 20, 50, 100];
const orderStatuses = ["pending", "completed", "cancelled"];

const searchFields = [
  { value: "customerName", label: "Имя клиента" },
  { value: "customerEmail", label: "Email клиента" },
  { value: "status", label: "Статус" },
  { value: "productName", label: "Товар" },
];

const OrdersPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    items: orders,
    loading,
    error,
  } = useAppSelector((state) => state.orders);
  const products = useAppSelector((state) => state.products.items);
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] =
    useState<SearchableField>("customerName");
  const [sortConfig, setSortConfig] = useState<{
    key: SortableField;
    direction: SortDirection;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const getProductName = (productId: string): string => {
    const product = products.find((p: Product) => p.id === productId);
    return product ? product.name : t("orders.unknownProduct");
  };

  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return "-";
    try {
      return dayjs(dateString).format("YYYY-MM-DD");
    } catch {
      return dateString;
    }
  };

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchTerm, searchField]);

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

  const processedOrders = useMemo(() => {
    let filteredOrders = [...orders];

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filteredOrders = filteredOrders.filter((order) => {
        if (searchField === "productName") {
          const productName = getProductName(order.productId).toLowerCase();
          return productName.includes(lowerSearchTerm);
        }
        const fieldValue = String(
          order[searchField as keyof Order]
        ).toLowerCase();
        return fieldValue.includes(lowerSearchTerm);
      });
    }

    if (sortConfig !== null) {
      filteredOrders.sort((a, b) => {
        let aValue: string | number | Date | undefined = a[sortConfig.key];
        let bValue: string | number | Date | undefined = b[sortConfig.key];

        if (sortConfig.key === "createdAt" || sortConfig.key === "updatedAt") {
          const aDate = aValue ? new Date(aValue).getTime() : 0;
          const bDate = bValue ? new Date(bValue).getTime() : 0;
          aValue = aDate;
          bValue = bDate;
        }

        if (aValue === undefined || bValue === undefined) return 0;
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredOrders;
  }, [orders, searchTerm, searchField, sortConfig, products, getProductName]);

  const handleStatusSelect = (status: string) => {
    setSearchTerm(status);
  };

  const renderSearchInput = () => {
    if (searchField === "status") {
      return (
        <Dropdown>
          <Dropdown.Toggle
            variant="outline-secondary"
            id="dropdown-status-search"
          >
            {searchTerm
              ? t(`orders.status.${searchTerm}`)
              : t("orders.selectStatus")}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {orderStatuses.map((status) => (
              <Dropdown.Item
                key={status}
                active={searchTerm === status}
                onClick={() => handleStatusSelect(status)}
              >
                {t(`orders.status.${status}`)}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      );
    }

    return (
      <>
        <Form.Control
          type="text"
          placeholder={t(`orders.searchPlaceholder.${searchField}`)}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <InputGroup.Text>
          <FaSearch />
        </InputGroup.Text>
      </>
    );
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleItemsPerPageChange = (size: number) => {
    setItemsPerPage(size);
  };

  const handleAddOrder = () => {
    setCurrentOrder(undefined);
    setShowModal(true);
  };

  const handleEditOrder = (order: Order) => {
    setCurrentOrder(order);
    setShowModal(true);
  };

  const handleDeleteOrder = async (id: string) => {
    if (window.confirm(t("orders.deleteConfirm"))) {
      try {
        await dispatch(deleteOrder(id));
      } catch (error) {
        console.error(t("orders.deleteError"), error);
      }
    }
  };

  const handleSubmit = async (orderData: Omit<Order, "id">) => {
    try {
      if (currentOrder) {
        await updateOrder(currentOrder.id, orderData);
      } else {
        await addOrder(orderData);
      }
      await dispatch(fetchOrders());
      setShowModal(false);
    } catch (error) {
      console.error(t("orders.saveError"), error);
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = processedOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(processedOrders.length / itemsPerPage);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{t("orders.title")}</h2>
        <div className="d-flex">
          <InputGroup className="me-3" style={{ width: "400px" }}>
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-secondary"
                id="dropdown-search-field"
              >
                {searchFields.find((f) => f.value === searchField)?.label}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {searchFields.map((field) => (
                  <Dropdown.Item
                    key={field.value}
                    active={searchField === field.value}
                    onClick={() => {
                      setSearchField(field.value as SearchableField);
                      setSearchTerm("");
                    }}
                  >
                    {t(`orders.searchFields.${field.value}`)}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            {renderSearchInput()}
          </InputGroup>
          <Button variant="primary" onClick={handleAddOrder}>
            {t("orders.addButton")}
          </Button>
        </div>
      </div>

      <div className="table-responsive">
        <Table striped bordered hover className="mt-3">
          <thead className="table-dark">
            <tr>
              <th>{t("orders.columns.id")}</th>
              <th>{t("orders.columns.product")}</th>
              <th
                onClick={() => requestSort("quantity")}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  {t("orders.columns.quantity")}
                  {getSortIcon("quantity")}
                </div>
              </th>
              <th
                onClick={() => requestSort("customerName")}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  {t("orders.columns.customer")}
                  {getSortIcon("customerName")}
                </div>
              </th>
              <th
                onClick={() => requestSort("customerEmail")}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  {t("orders.columns.email")}
                  {getSortIcon("customerEmail")}
                </div>
              </th>
              <th
                onClick={() => requestSort("createdAt")}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  {t("orders.columns.createdAt")}
                  {getSortIcon("createdAt")}
                </div>
              </th>
              <th
                onClick={() => requestSort("updatedAt")}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  {t("orders.columns.updatedAt")}
                  {getSortIcon("updatedAt")}
                </div>
              </th>
              <th
                onClick={() => requestSort("status")}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  {t("orders.columns.status")}
                  {getSortIcon("status")}
                </div>
              </th>
              <th>{t("orders.columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{getProductName(order.productId)}</td>
                  <td>{order.quantity}</td>
                  <td>{order.customerName}</td>
                  <td>{order.customerEmail}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{formatDate(order.updatedAt)}</td>
                  <td>
                    <Badge
                      bg={
                        {
                          pending: "warning",
                          completed: "success",
                          cancelled: "danger",
                        }[order.status]
                      }
                    >
                      {t(`orders.status.${order.status}`)}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEditOrder(order)}
                      className="me-2"
                    >
                      {t("common.edit")}
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      {t("common.delete")}
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center">
                  {t("orders.noOrders")}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {processedOrders.length > 0 && (
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
              {Math.min(indexOfLastItem, processedOrders.length)}{" "}
              {t("pagination.of")} {processedOrders.length}
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

      <OrderModal
        show={showModal}
        onHide={() => setShowModal(false)}
        order={currentOrder}
        products={products}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default OrdersPage;
