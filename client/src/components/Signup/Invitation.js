import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Validation } from "../../utils";
import jwt from "jsonwebtoken";
// Semantic UI Form elements
import {
  Container,
  Segment,
  Input,
  Form,
  Button,
  Header,
  Message
} from "semantic-ui-react";
import { addFlashMessage } from "../../actions/flashMessageActions";
import { graphql } from "react-apollo";
import { REGISTER_INVITED_USER_MUTATION } from "../../graphql/authentications";

// Localization
import T from "i18n-react";

import logo from "../../images/logo-square.png";

class Invitation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      token: null,
      account: "",
      errors: {},
      isLoading: false
    };
  }

  componentDidMount = () => {
    const url = new URL(window.location.href);
    let token = url.searchParams.get("token");

    const { email, account } = jwt.verify(token, process.env.JWTSECRET1);

    this.setState({ email, token, account });
  };

  handleChange = (name, value) => {
    if (this.state.errors[name]) {
      // Clone errors form state to local variable
      let errors = Object.assign({}, this.state.errors);
      delete errors[name];

      this.setState({
        [name]: value,
        errors
      });
    } else {
      this.setState({
        [name]: value
      });
    }
  };

  isValid() {
    const { errors, isValid } = Validation.validateInvitationRegistrationInput(
      this.state
    );

    let updatedErrors = Object.assign({}, this.state.errors);
    updatedErrors = errors;

    if (!isValid) {
      this.setState({ errors: updatedErrors });
    }

    return isValid;
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.isValid()) {
      this.setState({ isLoading: true });

      const { firstName, lastName, email, password, token } = this.state;

      this.props
        .mutate({ variables: { firstName, lastName, email, password, token } })
        .then(res => {
          const { success, account, errors } = res.data.registerInvitedUser;

          if (success) {
            this.props.addFlashMessage({
              type: "success",
              text: T.translate("sign_up.success_create")
            });

            // Redirect to login
            window.location.href = `${
              process.env.CLIENT_PROTOCOL
            }${account.subdomain.replace("_", "-")}.${
              process.env.CLIENT_HOST
            }/login`;
          } else {
            let errorsList = {};
            errors.map(error => (errorsList[error.path] = error.message));
            this.setState({ errors: errorsList, isLoading: false });
          }
        })
        .catch(err => this.setState({ errors: err, isLoading: false }));
    }
  }

  render() {
    const {
      firstName,
      email,
      lastName,
      password,
      confirmPassword,
      account,
      errors,
      isLoading
    } = this.state;

    return (
      <Container text>
        <Header as="h2" image className="turquoise">
          <img src={logo} className="image" alt="logo-square" />
          <Header.Content>{T.translate("sign_up.header")}</Header.Content>
        </Header>

        <Segment>
          {!!errors.subdomain && (
            <Message negative>
              <p>{errors.subdomain}</p>
            </Message>
          )}
          <Message
            info
            icon="info"
            header={T.translate("sign_up.complete_invitation_sign_up", {
              account: (
                <h3 className="capitalize d-inline-block">
                  {account.replace("_", "-")}
                </h3>
              )
            })}
          />
          <Form loading={isLoading} onSubmit={this.handleSubmit.bind(this)}>
            {!!errors.message && (
              <Message message>
                <p>{errors.message}</p>
              </Message>
            )}

            <Form.Field>
              <label>{T.translate("sign_up.first_name")}</label>
              <Input
                placeholder={T.translate("sign_up.first_name")}
                name="firstName"
                value={firstName}
                onChange={(e, { value }) =>
                  this.handleChange("firstName", value)
                }
                error={!!errors.firstName}
              />
              <span className="red">{errors.firstName}</span>
            </Form.Field>

            <Form.Field>
              <label>{T.translate("sign_up.last_name")}</label>
              <Input
                placeholder={T.translate("sign_up.last_name")}
                name="lastName"
                value={lastName}
                onChange={(e, { value }) =>
                  this.handleChange("lastName", value)
                }
                error={!!errors.lastName}
              />
              <span className="red">{errors.lastName}</span>
            </Form.Field>

            <Form.Field error={!!errors.email}>
              <label>{T.translate("sign_up.email")}</label>
              <Input
                placeholder={T.translate("sign_up.email")}
                name="email"
                value={email}
                disabled
                onChange={(e, { value }) => this.handleChange("email", value)}
                error={!!errors.email}
              />
              <span className="red">{errors.email}</span>
            </Form.Field>

            <Form.Field error={!!errors.password}>
              <label>{T.translate("sign_up.password")}</label>
              <Input
                placeholder={T.translate("sign_up.password")}
                name="password"
                value={password}
                onChange={(e, { value }) =>
                  this.handleChange("password", value)
                }
                type="password"
                error={!!errors.password}
              />
              <span className="red">{errors.password}</span>
            </Form.Field>

            <Form.Field error={!!errors.confirmPassword}>
              <label>{T.translate("sign_up.confirm_password")}</label>
              <Input
                placeholder={T.translate("sign_up.confirm_password")}
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e, { value }) =>
                  this.handleChange("confirmPassword", value)
                }
                type="password"
                error={!!errors.confirmPassword}
              />
              <span className="red">{errors.confirmPassword}</span>
            </Form.Field>

            <Button primary fluid disabled={isLoading}>
              {T.translate("sign_up.sign_up")}
            </Button>
          </Form>
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

// Proptypes definition
Invitation.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
};

export default connect(null, { addFlashMessage })(
  graphql(REGISTER_INVITED_USER_MUTATION)(Invitation)
);
