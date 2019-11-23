import React from "react";
import { Route, Link } from "react-router-dom";
// Semantic UI JS
import {
  Segment,
  Container,
  Header,
  Image,
  Sidebar,
  Menu,
  Item
} from "semantic-ui-react";

// Localization
import T from "i18n-react";

// Images
import logoPlaceholderMedium from "../../images/logo-placeholder.svg";

const ActiveLink = ({ label, to, icon, activeOnlyWhenExact }) => (
  <Route
    path={to}
    exact={activeOnlyWhenExact}
    children={({ match }) => (
      <Link className={match ? "active item" : "item"} to={to}>
        <i className={icon} />
        <span>{label}</span>
      </Link>
    )}
  />
);

export function InnerSidebar({ visibleInnerSidebar, currentAccount }) {
  return (
    <Sidebar
      as={Menu}
      animation="slide along"
      visible={visibleInnerSidebar}
      vertical
      inverted
    >
      <Segment vertical textAlign="center" className="account">
        <Link to="/settings">
          <Image
            centered
            rounded
            size="tiny"
            className="mt-3"
            src={logoPlaceholderMedium}
            alt="logo-placeholder-medium"
          />
        </Link>
        <Header
          as="h4"
          className="capitalize mt-3 mb-0"
          style={{ color: "inherit" }}
        >
          {currentAccount.subdomain.replace("_", "-")}
        </Header>
        <p className="capitalize mb-2">
          {currentAccount.firstName} {currentAccount.isAdmin ? "(Admin)" : ""}
        </p>
      </Segment>
      <ActiveLink
        activeOnlyWhenExact
        to="/dashboard"
        icon="dashboard icon"
        label={T.translate("dashboard.header")}
      />
      <ActiveLink
        activeOnlyWhenExact
        to="/customers"
        icon="users icon"
        label={T.translate("customers.page.header")}
      />
      <ActiveLink
        activeOnlyWhenExact
        to="/projects"
        icon="suitcase icon"
        label={T.translate("projects.page.header")}
      />
      <ActiveLink
        activeOnlyWhenExact
        to="/sales"
        icon="cart icon"
        label={T.translate("sales.page.header")}
      />
      <ActiveLink
        activeOnlyWhenExact
        to="/invoices"
        icon="file text outline icon"
        label={T.translate("invoices.page.header")}
      />
      <ActiveLink
        activeOnlyWhenExact
        to="/users"
        icon="user icon"
        label={T.translate("users.page.header")}
      />
      <ActiveLink
        activeOnlyWhenExact
        to="/events"
        icon="calendar alternate icon"
        label={T.translate("events.page.header")}
      />
    </Sidebar>
  );
}

export function OuterSidebarScrollableHeader({ visibleOuterSidebar }) {
  return [
    <Sidebar
      key="sidebar"
      as={Menu}
      animation="overlay"
      width="thin"
      visible={visibleOuterSidebar}
      vertical
      inverted
      className="nav-link"
    >
      <a className="item" href="#home">
        {T.translate("landing.home.header")}
      </a>
      <a className="item" href="#features">
        {T.translate("landing.features.header")}
      </a>
      <a className="item" href="#clients">
        {T.translate("landing.clients.header")}
      </a>
      <a className="item" href="#testimonial">
        {T.translate("landing.testimonial.header")}
      </a>
      <a className="item" href="#pricing">
        {T.translate("landing.pricing.header")}
      </a>
      <a className="item" to="#contacts">
        {T.translate("landing.contacts.header")}
      </a>
    </Sidebar>,
    <Menu
      key="scroll-header-nav"
      fixed="top"
      pointing
      size="large"
      style={{ display: "none" }}
    >
      <Container>
        <Menu.Menu position="left" className="nav-link">
          <Link className="item" to={{ pathname: "#home" }}>
            {T.translate("landing.home.header")}
          </Link>
          <Link className="item" to={{ pathname: "#features" }}>
            {T.translate("landing.features.header")}
          </Link>
          <Link className="item" to={{ pathname: "#clients" }}>
            {T.translate("landing.clients.header")}
          </Link>
          <Link className="item" to={{ pathname: "#testimonial" }}>
            {T.translate("landing.testimonial.header")}
          </Link>
          <Link className="item" to={{ pathname: "#pricing" }}>
            {T.translate("landing.pricing.header")}
          </Link>
          <Link className="item" to={{ pathname: "#contacts" }}>
            {T.translate("landing.contacts.header")}
          </Link>
        </Menu.Menu>

        <Menu.Menu position="right">
          <Item>
            <Link className="ui primary outline button" to="/subdomain">
              {T.translate("log_in.log_in")}
            </Link>
          </Item>
          <Item>
            <a
              href={`${process.env.CLIENT_PROTOCOL}${process.env.CLIENT_HOST}/signup`}
              className="ui primary outline button"
            >
              {T.translate("sign_up.sign_up")}
            </a>
          </Item>
        </Menu.Menu>
      </Container>
    </Menu>
  ];
}
