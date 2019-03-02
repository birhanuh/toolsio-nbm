import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { Validation } from "../../../../utils";
import { addFlashMessage } from "../../../../actions/flashMessageActions";
// Semantic UI Form elements
import { Input, Form, Message, Button, Icon } from "semantic-ui-react";
import { graphql, compose } from "react-apollo";
import {
  GET_CHANNELS_USERS_COUNT_QUERY,
  CREATE_CHANNEL_MUTATION
} from "../../../../graphql/conversations/channels";

// Localization
import T from "i18n-react";

class Channel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      isPublic: true,
      errors: {},
      isLoading: false
    };
  }

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
    const { errors, isValid } = Validation.validateChannelInput(this.state);

    let updatedErrors = Object.assign({}, this.state.errors);
    updatedErrors = errors;

    if (!isValid) {
      this.setState({
        errors: updatedErrors
      });
    }

    return isValid;
  }

  handleSubmit = e => {
    e.preventDefault();

    // Validation
    if (this.isValid()) {
      const { name, isPublic } = this.state;

      this.setState({ isLoading: true });

      this.props
        .createChannelMutation({
          variables: { name, isPublic },
          update: (proxy, { data: { createChannel } }) => {
            const { success, channel } = createChannel;

            if (!success) {
              return;
            }
            // Read the data from our cache for this query.
            const data = proxy.readQuery({
              query: GET_CHANNELS_USERS_COUNT_QUERY
            });
            // Add our comment from the mutation to the end.
            channel.usersCount = 1;
            data.getChannelsUsersCount.push(channel);
            // Write our data back to the cache.
            proxy.writeQuery({ query: GET_CHANNELS_USERS_COUNT_QUERY, data });
          }
        })
        .then(res => {
          const { success, channel, errors } = res.data.createChannel;

          if (success) {
            this.props.addFlashMessage({
              type: "success",
              text: T.translate(
                "conversations.form.flash.success_create_channel",
                { name: channel.name }
              )
            });
            this.setState({ isLoading: false });
            this.props.toggleCreateChannelModal();
            this.context.router.history.push(
              `/conversations/channel/${channel.id}`
            );
          } else {
            let errorsList = {};
            errors.map(error => (errorsList[error.path] = error.message));

            this.setState({ errors: errorsList, isLoading: false });
          }
        })
        .catch(err => this.setState({ errors: err, isLoading: false }));
    }
  };

  render() {
    const { name, errors, isLoading } = this.state;

    return (
      <Form
        loading={isLoading}
        className="p-3"
        onSubmit={this.handleSubmit.bind(this)}
      >
        {!!errors.message && (
          <Message negative>
            <p>{errors.message}</p>
          </Message>
        )}

        <Form.Field>
          <label className={classnames({ red: !!errors.name })}>
            {T.translate("conversations.form.name")}
          </label>
          <Input
            placeholder={T.translate("conversations.form.name")}
            name="name"
            value={name}
            onChange={(e, { value }) => this.handleChange("name", value)}
            error={!!errors.name}
            fluid
          />
          <span className="red">{errors.name}</span>
        </Form.Field>

        <Button primary disabled={isLoading}>
          <Icon name="check circle outline" />
          &nbsp;{T.translate("conversations.form.create")}
        </Button>
      </Form>
    );
  }
}

Channel.propTypes = {
  addFlashMessage: PropTypes.func.isRequired,
  toggleCreateChannelModal: PropTypes.func.isRequired
};

Channel.contextTypes = {
  router: PropTypes.object.isRequired
};

const MutationsAndQuery = compose(
  graphql(CREATE_CHANNEL_MUTATION, {
    name: "createChannelMutation"
  }),
  graphql(GET_CHANNELS_USERS_COUNT_QUERY)
)(Channel);

export default connect(
  null,
  { addFlashMessage }
)(MutationsAndQuery);
