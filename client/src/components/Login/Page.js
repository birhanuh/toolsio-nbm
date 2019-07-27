import React, { Component } from "react";
import { Link } from "react-router-dom";
import Form from "./Form";
// Semantic React UI
import { Container, Segment, Header } from "semantic-ui-react";
import FlashMessage from "../../flash/FlashMessage";

// Localization
import T from "i18n-react";

import logo from "../../images/logo-square.png";

class Page extends Component {
  render() {
    return (
      <Container text>
        <Header as="h2" image className="turquoise">
          <Link className="" to="/">
            <img src={logo} className="image" alt="logo-square" />
          </Link>
          <Header.Content>{T.translate("log_in.header")}</Header.Content>
        </Header>

        <FlashMessage />

        <Form {...this.props} />

        <Segment>
          <span>
            {T.translate("log_in.new_to_us")}&nbsp;
            <a
              href={
                process.env.CLIENT_PROTOCOL +
                process.env.CLIENT_HOST +
                "/signup"
              }
            >
              {T.translate("sign_up.sign_up")}
            </a>
          </span>
          <span style={{ float: "right" }}>
            <Link to="/login/forgot-password-request">
              {T.translate("log_in.forgot_your_password")}
            </Link>
          </span>
        </Segment>
        <Segment vertical align="center">
          <small className="d-block">
            {T.translate("landing.footer.copy_right")}
          </small>
          <small className="d-block">
            {T.translate("landing.footer.address")}
          </small>
        </Segment>
      </Container>
    );
  }
}

export default Page;
