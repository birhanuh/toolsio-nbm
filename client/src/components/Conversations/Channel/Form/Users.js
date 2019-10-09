import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Validation } from "../../../../utils";
// Semantic UI Form elements
import { Form, Dropdown, Message, Icon, Button } from "semantic-ui-react";
import { graphql, compose } from "react-apollo";
// eslint-disable-next-line no-unused-vars
import {
  GET_CHANNELS_USERS_COUNT_QUERY,
  ADD_MEMBER_MUTATION
} from "../../../../graphql/conversations/channels";

// Localization
import T from "i18n-react";

class Users extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      members: [],
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
    const { errors, isValid } = Validation.validateAddUserInput(this.state);

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
      const { members } = this.state;
      const { channelId } = this.props;
      console.log("me");
      this.setState({ isLoading: true });

      this.props
        .addMemberMutation({
          variables: { members, channelId },
          update: (proxy, { data: { addMember } }) => {
            const { success, members } = addMember;

            if (!success) {
              return;
            }

            // Read the data from our cache for this query.
            const data = proxy.readQuery({
              query: GET_CHANNELS_USERS_COUNT_QUERY
            });
            let updatedGetChannelsUsersCount = data.getChannelsUsersCount.map(
              channelUserCount => {
                if (channelUserCount.id === parseInt(channelId)) {
                  return {
                    ...channelUserCount,
                    usersCount:
                      parseInt(channelUserCount.usersCount) + members.length
                  };
                }

                return channelUserCount;
              }
            );
            data.getChannelsUsersCount = updatedGetChannelsUsersCount;

            // Read the dataChannelUsers from our cache for this query.
            //const dataChannelUsers = proxy.readQuery({ query: GET_CHANNEL_USERS_QUERY })
            //console.log('updatedDataChannelUsers: ', dataChannelUsers)
            // let updatedDataChannelUsers = dataChannelUsers.getChannel.usersNotInChannel.map(user => {
            //   members.map(item => {
            //     if (user.id !== item) {
            //       return user
            //     }
            //   })
            // })
            // dataChannelUsers.getChannel.usersNotInChannel = updatedDataChannelUsers

            // Write our data back to the cache.
            proxy.writeQuery({ query: GET_CHANNELS_USERS_COUNT_QUERY, data });
            //proxy.writeQuery({ query: GET_CHANNEL_USERS_QUERY, dataChannelUsers })
          }
        })
        .then(res => {
          // this.props.addFlashMessage({
          //   type: 'success',
          //   text: T.translate("conversations.form.flash.success_compose")
          // })

          const { success, errors } = res.data.addMember;

          if (success) {
            this.setState({ isLoading: false });

            // Close modal on success
            this.props.onClose();
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
    const { members, errors, isLoading } = this.state;

    const { usersNotInChannel } = this.props;

    const usersOptions = usersNotInChannel.map(user => ({
      key: user.id,
      value: user.id,
      text: user.email
    }));

    return (
      <Form loading={isLoading} onSubmit={this.handleSubmit.bind(this)}>
        {!!errors.message && (
          <Message negative>
            <p>{errors.message}</p>
          </Message>
        )}

        <Form.Field>
          {usersOptions && (
            <Dropdown
              name="members"
              value={members}
              placeholder={T.translate("conversations.form.select_users")}
              fluid
              multiple
              search
              selection
              options={usersOptions}
              error={!!errors.members}
              onChange={(e, { value }) => this.handleChange("members", value)}
            />
          )}
          <span className="red">{errors.members}</span>
        </Form.Field>

        <Button disabled={isLoading} className="ui primary button">
          <Icon name="check circle outline" />
          &nbsp;{T.translate("conversations.form.add")}
        </Button>
      </Form>
    );
  }
}

Users.propTypes = {
  usersNotInChannel: PropTypes.array.isRequired
};

const Mutation = compose(
  graphql(ADD_MEMBER_MUTATION, {
    name: "addMemberMutation"
  })
)(Users);

export default Mutation;
