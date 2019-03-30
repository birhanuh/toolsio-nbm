import React, { Component } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
// Semantic React UI
import { Segment, Label, Button, Icon, Modal } from "semantic-ui-react";
import { graphql, compose } from "react-apollo";
import {
  GET_DIRECT_MESSAGE_USERS_QUERY,
  GET_UNREAD_DIRECT_MESSAGES_COUNT_SENDER_QUERY
} from "../../../graphql/conversations/directMessages";

// Localization
import T from "i18n-react";

// jQuery
import $ from "jquery";

import UserDropdownSearchSelection from "./Form/UserDropdownSearchSelection";

const AddUserModal = ({ open, onClose }) => (
  <Modal
    size="small"
    className="add-user"
    open={open}
    onClose={e => {
      onClose(e);
    }}
  >
    <Modal.Header>
      {T.translate("conversations.messages.add_user")}
    </Modal.Header>
    <Modal.Content>
      <UserDropdownSearchSelection onClose={onClose} />
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

class List extends Component {
  state = {
    openAddUserModal: false
  };

  componentDidMount() {
    $(".ui .item").on("click", function() {
      $(".ui .item").removeClass("active");
      $(this).addClass("active");
    });
  }

  toggleAddUserModal = e => {
    if (e) {
      e.preventDefault();
    }

    this.setState(state => ({ openAddUserModal: !state.openAddUserModal }));
  };

  render() {
    const { openAddUserModal } = this.state;

    const {
      data: { getUnreadDirectMessagesCountSender },
      getDirectMessageUsersQuery: { getDirectMessageUsers },
      receiverId
    } = this.props;

    let countSender =
      getUnreadDirectMessagesCountSender &&
      getUnreadDirectMessagesCountSender.unreadDirectMessagesCountSender;
    const unreadLabel = user =>
      countSender && countSender.find(item => item.sender_id === user.id);

    const userList =
      getDirectMessageUsers &&
      getDirectMessageUsers.map(user => (
        <Link
          key={user.id}
          to={`/conversations/receiver/${user.id}`}
          className={classnames("item", {
            active: receiverId && parseInt(receiverId) === user.id
          })}
        >
          {unreadLabel(user) && unreadLabel(user).count !== 0 && (
            <Label className="red">{unreadLabel(user).count}</Label>
          )}

          <div>
            <i className="user icon" />&nbsp;
            {user.first_name}
          </div>
        </Link>
      ));

    return [
      <Segment key="user-list" vertical textAlign="center">
        <Button
          id="add-user"
          primary
          size="small"
          onClick={this.toggleAddUserModal.bind(this)}
        >
          <Icon name="add circle" />
          {T.translate("conversations.messages.add_user")}
        </Button>
      </Segment>,

      userList,

      <AddUserModal
        onClose={this.toggleAddUserModal.bind(this)}
        open={openAddUserModal}
        key="add-user-modal"
      />
    ];
  }
}

const Queries = compose(
  graphql(GET_DIRECT_MESSAGE_USERS_QUERY, {
    name: "getDirectMessageUsersQuery"
  }),
  graphql(GET_UNREAD_DIRECT_MESSAGES_COUNT_SENDER_QUERY)
)(List);

export default Queries;
