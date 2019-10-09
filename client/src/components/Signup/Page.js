import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import Form from "./Form";
// Semantic React UI
import { Container, Segment, Header } from "semantic-ui-react";
import Invitation from "./Invitation";
import { Authorization } from "../../utils";
import FlashMessage from "../../flash/FlashMessage";

// Localization
import T from "i18n-react";

import logo from "../../images/logo-square.png";

class Page extends PureComponent {
  render() {
    const { signupRequest, isSubdomainExist, isUserExist, match } = this.props;

    let form;

    if (match && match.params.token) {
      form = (
        <Invitation signupRequest={signupRequest} isUserExist={isUserExist} />
      );

      // Set Invitation token to Req header
      Authorization.setInvitationToken(match.params.token);
    } else {
      form = (
        <Form
          signupRequest={signupRequest}
          isSubdomainExist={isSubdomainExist}
          isUserExist={isUserExist}
        />
      );
    }

    return (
      <Container text>
        <Header as="h2" image className="turquoise">
          <Link className="" to="/">
            <img src={logo} className="image" alt="logo-square" />
          </Link>
          <Header.Content>{T.translate("sign_up.header")}</Header.Content>
        </Header>

        <FlashMessage />

        {form}

        <Segment>
          {T.translate("sign_up.already_a_user")}&nbsp;
          <Link to="/subdomain">{T.translate("sign_up.log_in_here")}</Link>
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
