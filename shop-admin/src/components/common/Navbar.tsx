import React from "react";
import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../api/firebase";
import { useAuth } from "../../context/AuthContext";
import { useTranslation, getI18n } from "react-i18next";

const AppNavbar: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const i18n = getI18n();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error(t("navbar.logoutError"), error);
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          {t("navbar.brand")}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {currentUser && (
              <>
                <Nav.Link as={Link} to="/products">
                  {t("navbar.products")}
                </Nav.Link>
                <Nav.Link as={Link} to="/orders">
                  {t("navbar.orders")}
                </Nav.Link>
                <Nav.Link as={Link} to="/stats">
                  <i className="bi bi-bar-chart me-2"></i>
                  {t("navbar.statistics")}
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav className="align-items-center">
            <Dropdown className="me-2">
              <Dropdown.Toggle variant="outline-light" id="dropdown-language">
                {i18n.language.toUpperCase()}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => changeLanguage("en")}>
                  English
                </Dropdown.Item>
                <Dropdown.Item onClick={() => changeLanguage("ru")}>
                  Русский
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {currentUser ? (
              <Button variant="outline-light" onClick={handleLogout}>
                {t("navbar.logout")}
              </Button>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  {t("navbar.login")}
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  {t("navbar.register")}
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
