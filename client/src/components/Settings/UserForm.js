import React, { Component } from "react";
import PropTypes from "prop-types";
require("babel-polyfill");
import { connect } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import Dropzone from "react-dropzone";
import { Validation } from "../../utils";
import { addFlashMessage } from "../../actions/flashMessageActions";
// Semantic UI Form elements
import {
  Item,
  Card,
  Input,
  Form,
  Dimmer,
  Image,
  Message,
  Header,
  Button,
  Icon,
  Divider
} from "semantic-ui-react";
import { Image as CloudinaryImage } from "cloudinary-react";
import classnames from "classnames";
import { graphql, compose } from "react-apollo";
import {
  GET_USER_BY_EMAIL_QUERY,
  UPDATE_USER_MUTATION,
  UPDATE_USER_PASSWORD_MUTATION
} from "../../graphql/users";

// Localization
import T from "i18n-react";

import moment from "moment";

// Avatar placeholder
import avatarPlaceholderLarge from "../../images/avatar-placeholder-large.png";

class UserForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: this.props.data.getUserByEmail
        ? this.props.data.getUserByEmail.firstName
        : "",
      lastName: this.props.data.getUserByEmail
        ? this.props.data.getUserByEmail.lastName
        : "",
      email: this.props.data.getUserByEmail
        ? this.props.data.getUserByEmail.email
        : "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      avatarUrl: this.props.data.getUserByEmail
        ? this.props.data.getUserByEmail.avatarUrl
        : "",
      file: null,
      errors: {},
      active: false,
      isLoadingAvatar: false,
      isLoadingForm: false,
      isLoadingPasswordForm: false
    };
  }

  UNSAFE_componentWillReceiveProps = nextProps => {
    if (nextProps.data.getUserByEmail) {
      this.setState({
        firstName: nextProps.data.getUserByEmail.firstName,
        lastName: nextProps.data.getUserByEmail.lastName,
        email: nextProps.data.getUserByEmail.email,
        avatarUrl: nextProps.data.getUserByEmail.avatarUrl
      });
    }
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
    const { errors, isValid } = Validation.validateUserInput(this.state);

    let updatedErrors = Object.assign({}, this.state.errors);
    updatedErrors = errors;

    if (!isValid) {
      this.setState({ errors: updatedErrors });
    }

    return isValid;
  }

  isPasswordValid() {
    const { errors, isValid } = Validation.validateUserPasswordInput(
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
      // Empty errros state for each submit
      this.setState({ errros: {}, isLoadingForm: true });

      const { firstName, lastName, email, avatarUrl } = this.state;
      // Make submit
      this.props
        .updateUserMutation({
          variables: { firstName, lastName, email, avatarUrl }
        })
        .then(res => {
          const { success, errors } = res.data.updateUser;

          if (success) {
            this.props.addFlashMessage({
              type: "success",
              text: T.translate("settings.user.flash.success_update")
            });
            this.setState({ isLoadingForm: false });
          } else {
            let errorsList = {};
            errors.map(error => (errorsList[error.path] = error.message));
            this.setState({ errors: errorsList, isLoadingForm: false });
          }
        })
        .catch(err => this.setState({ errors: err, isLoadingForm: false }));
    }
  }

  handlePasswordChangeSubmit(e) {
    e.preventDefault();

    if (this.isPasswordValid()) {
      // Empty errros state for each submit
      this.setState({ errros: {}, isLoadingPasswordForm: true });

      const { currentPassword, newPassword } = this.state;
      // Make submit
      this.props
        .updateUserPasswordMutation({
          variables: { currentPassword, newPassword }
        })
        .then(res => {
          const { success, errors } = res.data.updateUserPassword;

          if (success) {
            this.props.addFlashMessage({
              type: "success",
              text: T.translate("settings.user.flash.success_password_update")
            });
            this.setState({
              isLoadingPasswordForm: false,
              currentPassword: "",
              newPassword: "",
              confirmNewPassword: ""
            });
          } else {
            let errorsList = {};
            errors.map(error => (errorsList[error.path] = error.message));
            this.setState({ errors: errorsList, isLoadingPasswordForm: false });
          }
        })
        .catch(err =>
          this.setState({ errors: err, isLoadingPasswordForm: false })
        );
    }
  }

  uploadToServer = async public_id => {
    this.setState({
      avatarUrl: public_id
    });

    const { email, avatarUrl } = this.state;

    this.props
      .updateUserMutation({ variables: { email, avatarUrl } })
      .then(res => {
        const { success, errors } = res.data.updateUser;

        if (success) {
          this.props.addFlashMessage({
            type: "success",
            text: T.translate("settings.user.flash.success_update")
          });
          this.setState({ isLoadingAvatar: false, file: null, active: false });
        } else {
          let errorsList = {};
          errors.map(error => (errorsList[error.path] = error.message));
          this.setState({ errors: errorsList, isLoadingAvatar: false });
        }
      })
      .catch(err => this.setState({ errors: err, isLoadingAvatar: false }));
  };

  formatFileName = filename => {
    const date = moment().format("DDMMYYYY");
    const randomString = Math.random()
      .toString(36)
      .substring(2, 7);
    const cleanFileName = filename.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const newFileName = `avatars/${date}-${randomString}-${cleanFileName}`;
    return newFileName.substring(0, 60);
  };

  handleOnDrop = async files => {
    this.setState({
      file: files[0],
      active: true
    });
  };

  handleSubmitImage = async () => {
    const { file } = this.state;
    let response;
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.CLOUDINARY_PRESET_AVATARS);

      this.setState({ isLoadingAvatar: true });

      response = await axios.post(
        process.env.CLOUDINARY_API_URL_IMAGE,
        formData
      );
      const { public_id } = response.data;
      await this.uploadToServer(public_id);
    } else {
      this.props.addFlashMessage({
        type: "error",
        text: T.translate("settings.user.flash.upload_first")
      });
    }
  };

  toggleShow = () => this.setState(state => ({ active: !state.active }));

  render() {
    const {
      firstName,
      lastName,
      avatarUrl,
      email,
      currentPassword,
      newPassword,
      confirmNewPassword,
      errors,
      active,
      file,
      isLoadingAvatar,
      isLoadingForm,
      isLoadingPasswordForm
    } = this.state;

    return (
      <Item className="mt-5">
        <Item.Image>
          <Card
            className={classnames("ui circular image form", {
              loading: isLoadingAvatar
            })}
            style={{ height: "175px" }}
          >
            <Dimmer.Dimmable
              onMouseEnter={this.toggleShow}
              onMouseLeave={this.toggleShow}
              blurring
            >
              {avatarUrl ? (
                <CloudinaryImage
                  cloudName="toolsio"
                  publicId={avatarUrl}
                  width="175"
                  height="175"
                  crop="thumb"
                />
              ) : (
                <Image
                  size="medium"
                  src={avatarPlaceholderLarge}
                  alt="avatarPlaceholderLarge"
                />
              )}
              <Dimmer active={file ? true : active}>
                {file ? (
                  <small className="ui inverted">{file.name}</small>
                ) : (
                  <Dropzone
                    onDrop={this.handleOnDrop.bind(this)}
                    multiple={false}
                    className="ignore ui inverted button"
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div
                        className="ignore ui inverted button"
                        {...getRootProps()}
                      >
                        <input {...getInputProps()} />
                        {T.translate("settings.user.select_avatar")}
                      </div>
                    )}
                  </Dropzone>
                )}
              </Dimmer>
            </Dimmer.Dimmable>
          </Card>

          <Button
            disabled={isLoadingAvatar}
            onClick={this.handleSubmitImage.bind(this)}
            fluid
            primary
          >
            <Icon className="upload" />
            &nbsp;{T.translate("settings.user.upload")}
          </Button>
        </Item.Image>
        <Item.Content>
          <Header as="h1" className="mt-2 mb-3">
            {T.translate("settings.user.header")}
          </Header>

          <Form
            className="profile"
            loading={isLoadingForm}
            onSubmit={this.handleSubmit.bind(this)}
            autoComplete="off"
          >
            <input
              autoComplete="false"
              name="hidden"
              type="text"
              style={{ display: "none" }}
            />

            {!!errors.message && typeof errors.message === "string" && (
              <Message negative>
                <p>{errors.message}</p>
              </Message>
            )}

            <Form.Field>
              <label>{T.translate("settings.user.first_name")}</label>
              <Input
                placeholder={T.translate("settings.user.first_name")}
                name="firstName"
                value={firstName}
                onChange={(e, { value }) =>
                  this.handleChange("firstName", value)
                }
                autoComplete="off"
              />
              <span className="red">{errors.firstName}</span>
            </Form.Field>

            <Form.Field>
              <label>{T.translate("settings.user.last_name")}</label>
              <Input
                placeholder={T.translate("settings.user.last_name")}
                name="lastName"
                value={lastName}
                onChange={(e, { value }) =>
                  this.handleChange("lastName", value)
                }
                autoComplete="off"
              />
              <span className="red">{errors.lastName}</span>
            </Form.Field>

            <Form.Field error={!!errors.email}>
              <label>{T.translate("settings.user.email")}</label>
              <Input
                placeholder={T.translate("settings.user.email")}
                value={email}
                type="email"
                onChange={(e, { value }) => this.handleChange("email", value)}
                error={!!errors.email}
                autoComplete="off"
              />
              <span className="red">{errors.email}</span>
            </Form.Field>

            <div className="field">
              <Link className="ui primary outline button" to="/dashboard">
                <i className="minus circle icon" />
                {T.translate("settings.user.cancel")}
              </Link>
              <button disabled={isLoadingForm} className="ui primary button">
                <i className="check circle outline icon" aria-hidden="true" />
                &nbsp;{T.translate("settings.user.edit")}
              </button>
            </div>
          </Form>

          <Divider />

          <Form
            className="password"
            loading={isLoadingPasswordForm}
            onSubmit={this.handlePasswordChangeSubmit.bind(this)}
            autoComplete="off"
          >
            <input
              autoComplete="false"
              name="hidden"
              type="text"
              style={{ display: "none" }}
            />

            {!!errors.message && typeof errors.message === "string" && (
              <Message negative>
                <p>{errors.message}</p>
              </Message>
            )}

            <fieldset className="custom-fieldset">
              <legend className="custom-legend">
                {T.translate("settings.user.password_change")}
              </legend>
              <Form.Field error={!!errors.currentPassword}>
                <label>{T.translate("settings.user.current_password")}</label>
                <Input
                  placeholder={T.translate("settings.user.current_password")}
                  name="currentPassword"
                  value={currentPassword}
                  onChange={(e, { value }) =>
                    this.handleChange("currentPassword", value)
                  }
                  autoComplete="off"
                  type="password"
                  error={!!errors.currentPassword}
                />
                <span className="red">{errors.currentPassword}</span>
              </Form.Field>

              <Form.Field error={!!errors.newPassword}>
                <label>{T.translate("settings.user.new_password")}</label>
                <Input
                  placeholder={T.translate("settings.user.new_password")}
                  name="newPassword"
                  value={newPassword}
                  onChange={(e, { value }) =>
                    this.handleChange("newPassword", value)
                  }
                  autoComplete="off"
                  type="password"
                  error={!!errors.newPassword}
                />
                <span className="red">{errors.newPassword}</span>
              </Form.Field>

              <Form.Field error={!!errors.confirmNewPassword}>
                <label>
                  {T.translate("settings.user.confirm_new_password")}
                </label>
                <Input
                  placeholder={T.translate(
                    "settings.user.confirm_new_password"
                  )}
                  name="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e, { value }) =>
                    this.handleChange("confirmNewPassword", value)
                  }
                  autoComplete="off"
                  type="password"
                  error={!!errors.confirmNewPassword}
                />
                <span className="red">{errors.confirmNewPassword}</span>
              </Form.Field>
            </fieldset>

            <div className="field">
              <Link className="ui primary outline button" to="/dashboard">
                <Icon name="minus circle" />
                {T.translate("settings.user.cancel")}
              </Link>
              <Button disabled={isLoadingForm} primary>
                <Icon name="check circle outline" />
                &nbsp;{T.translate("settings.user.edit")}
              </Button>
            </div>
          </Form>
        </Item.Content>
      </Item>
    );
  }
}

UserForm.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
};

const MutationQuery = compose(
  graphql(UPDATE_USER_MUTATION, {
    name: "updateUserMutation"
  }),
  graphql(UPDATE_USER_PASSWORD_MUTATION, {
    name: "updateUserPasswordMutation"
  }),
  graphql(GET_USER_BY_EMAIL_QUERY, {
    options: props => ({
      variables: {
        email: props.email
      }
    })
  })
)(UserForm);

export default connect(
  null,
  { addFlashMessage }
)(MutationQuery);
