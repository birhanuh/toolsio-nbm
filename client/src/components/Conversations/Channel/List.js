import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import classnames from "classnames";
import { addFlashMessage } from "../../../actions/flashMessageActions";
// Semantic UI Form elements
import {
  Segment,
  Button,
  Icon,
  Label,
  Modal,
  Dropdown
} from "semantic-ui-react";
import { graphql, compose } from "react-apollo";
import {
  GET_CHANNELS_USERS_COUNT_QUERY,
  DELETE_CHANNEL_MUTATION
} from "../../../graphql/conversations/channels";

// Localization
import T from "i18n-react";

// jQuery
import $ from "jquery";

// Downshift
import FormChannel from "./Form/Channel";

const AddChannelModal = ({ open, onClose, toggleCreateChannelModal }) => (
  <Modal
    size="small"
    className="add-channel"
    open={open}
    onClose={e => {
      onClose(e);
    }}
  >
    <Modal.Header>
      {T.translate("conversations.form.create_channel")}
    </Modal.Header>
    <Modal.Content>
      <FormChannel
        onClose={onClose}
        toggleCreateChannelModal={toggleCreateChannelModal}
      />
    </Modal.Content>
    <Modal.Actions>
      <Button
        onClick={e => {
          onClose(e);
        }}
      >
        {T.translate("conversations.form.cancel")}
      </Button>
    </Modal.Actions>
  </Modal>
);

class List extends PureComponent {
  state = {
    openCreateChannelModal: false,
    openConfirmationModal: false
  };

  componentDidMount() {
    $(".ui .item").on("click", function() {
      $(".ui .item").removeClass("active");
      $(this).addClass("active");
    });
  }

  toggleCreateChannelModal = e => {
    if (e) {
      e.preventDefault();
    }

    this.setState(state => ({
      openCreateChannelModal: !state.openCreateChannelModal
    }));
  };

  toggleConfirmationModal = () => {
    this.setState(state => ({
      openConfirmationModal: !state.openConfirmationModal
    }));
  };

  handleDelete(id, event) {
    event.preventDefault();

    this.props
      .deleteChannelMutation({
        variables: { channelId: parseInt(id) },
        update: (store, { data: { deleteChannel } }) => {
          const { success } = deleteChannel;

          if (!success) {
            return;
          }

          // Read the data from our cache for this query.
          const data = store.readQuery({
            query: GET_CHANNELS_USERS_COUNT_QUERY
          });

          // Filter out deleted channel from store.
          let updatedGetChannelsUsersCount = data.getChannelsUsersCount.filter(
            channel => channel.id !== parseInt(id)
          );
          data.getChannelsUsersCount = updatedGetChannelsUsersCount;

          // Write our data back to the cache.
          store.writeQuery({
            query: GET_CHANNELS_USERS_COUNT_QUERY,
            data
          });
        }
      })
      .then(res => {
        const { success, errors } = res.data.deleteChannel;

        if (success) {
          this.props.addFlashMessage({
            type: "success",
            text: T.translate("conversations.channel.flash.success_delete")
          });

          this.setState({ openConfirmationModal: false });

          this.props.history.push("/conversations");
        } else {
          let errorsList = {};
          errors.map(error => (errorsList[error.path] = error.message));

          this.setState({ errors: errorsList, isLoading: false });
        }
      })
      .catch(() => {
        this.props.addFlashMessage({
          type: "error",
          text: T.translate("conversations.channel.flash.error_delete")
        });
      });
  }

  render() {
    const { openCreateChannelModal, openConfirmationModal } = this.state;
    const {
      data: { getChannelsUsersCount },
      channelId
    } = this.props;

    const channelList =
      getChannelsUsersCount &&
      getChannelsUsersCount.map(channel => (
        <div key={channel.id} className="name-label-elpsis-container">
          <Link
            to={`/conversations/channel/${channel.id}`}
            className={classnames("item", {
              active: channelId && parseInt(channelId) === channel.id
            })}
          >
            <Label className="blue">
              {T.translate("conversations.channel.members")}
              <div className="detail">{channel.usersCount}</div>
            </Label>

            <div>
              <i className="bullhorn icon" />
              &nbsp;
              {channel.name}
            </div>
          </Link>
          <Dropdown floating icon="ellipsis vertical" className="icon">
            <Dropdown.Menu>
              <Dropdown.Item
                className="delete-channel"
                onClick={this.toggleConfirmationModal.bind(this)}
              >
                <Icon name="trash alternate" />
                {T.translate("conversations.channel.delete_channel")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      ));

    return [
      <Segment key="create-channel" vertical textAlign="center">
        <Button
          primary
          size="small"
          onClick={this.toggleCreateChannelModal.bind(this)}
        >
          <Icon name="add circle" />
          {T.translate("conversations.page.create_channel")}
        </Button>
      </Segment>,

      channelList,

      <AddChannelModal
        onClose={this.toggleCreateChannelModal.bind(this)}
        open={openCreateChannelModal}
        toggleCreateChannelModal={this.toggleCreateChannelModal}
        key="add-channel-modal"
      />,

      <Modal
        key="modal"
        size="small"
        className="customer"
        open={openConfirmationModal}
      >
        <Modal.Header>
          {T.translate("conversations.channel.confirmation_header")}
        </Modal.Header>
        <Modal.Content>
          <p className="red">
            {T.translate("conversations.channel.confirmation_msg")}
          </p>
        </Modal.Content>
        <Modal.Actions>
          <button className="ui button" onClick={this.toggleConfirmationModal}>
            {T.translate("conversations.channel.cancel")}
          </button>
          <button
            className="ui negative button"
            onClick={this.handleDelete.bind(this, channelId)}
          >
            {T.translate("conversations.channel.delete")}
          </button>
        </Modal.Actions>
      </Modal>
    ];
  }
}

List.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
};

const MutationQuery = compose(
  graphql(GET_CHANNELS_USERS_COUNT_QUERY),
  graphql(DELETE_CHANNEL_MUTATION, {
    name: "deleteChannelMutation"
  })
)(List);

export default connect(
  null,
  { addFlashMessage }
)(withRouter(MutationQuery));
