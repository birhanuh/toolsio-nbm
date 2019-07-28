import React, { Component } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
// Semantic React UI
import {
  Segment,
  Label,
  Button,
  Icon,
  Modal,
  Dropdown
} from "semantic-ui-react";
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
    openAddUserModal: false,
    openConfirmationModal: false
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

  toggleConfirmationModal = () => {
    this.setState(state => ({
      openConfirmationModal: !state.openConfirmationModal
    }));
  };

  handleDelete(id, event) {
    event.preventDefault();

    console.log("Delete pressed");

    // this.props
    //   .deleteCustomerMutation({
    //     variables: { id },
    //     update: (proxy, { data: { deleteCustomer } }) => {
    //       const { success } = deleteCustomer;

    //       if (!success) {
    //         return;
    //       }
    //       // Read the data from our cache for this query.
    //       const data = proxy.readQuery({
    //         query: GET_CUSTOMERS_QUERY,
    //         variables: {
    //           order: "DESC",
    //           offset: 0,
    //           limit: 10,
    //           name: ""
    //         }
    //       });
    //       // Filter out deleted customer from store.
    //       let updatedCustomers = data.getCustomers.customers.filter(
    //         customer => customer.id !== id
    //       );
    //       data.getCustomers.customers = updatedCustomers;

    //       // Write our data back to the cache.
    //       proxy.writeQuery({
    //         query: GET_CUSTOMERS_QUERY,
    //         variables: {
    //           order: "DESC",
    //           offset: 0,
    //           limit: 10,
    //           name: ""
    //         },
    //         data
    //       });
    //     }
    //   })
    //   .then(res => {
    //     const { success, errors } = res.data.deleteCustomer;

    //     if (success) {
    //       this.props.addFlashMessage({
    //         type: "success",
    //         text: T.translate("customers.show.flash.success_delete", {
    //           name: name
    //         })
    //       });

    //       this.props.history.push("/customers");
    //     } else {
    //       let errorsList = {};
    //       errors.map(error => (errorsList[error.path] = error.message));

    //       this.setState({ errors: errorsList, isLoading: false });
    //     }
    //   })
    //   .catch(() => {
    //     this.props.addFlashMessage({
    //       type: "error",
    //       text: T.translate("customers.show.flash.error_delete", { name: name })
    //     });
    //   });
  }

  render() {
    const { openAddUserModal, openConfirmationModal } = this.state;

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
        <div key={user.id} className="name-label-elpsis-container">
          <Link
            to={`/conversations/receiver/${user.id}`}
            className={classnames("item", {
              active: receiverId && parseInt(receiverId) === user.id
            })}
          >
            {unreadLabel(user) && unreadLabel(user).count !== 0 && (
              <Label className="red">{unreadLabel(user).count}</Label>
            )}

            <div>
              <i className="user icon" />
              &nbsp;
              {user.first_name}
            </div>
          </Link>
          <Dropdown floating icon="ellipsis vertical" className="icon">
            <Dropdown.Menu>
              <Dropdown.Item
                className="delete-direct-message"
                onClick={this.toggleConfirmationModal.bind(this)}
              >
                <Icon name="trash alternate" />
                {T.translate(
                  "conversations.direct_messages.delete_direct_message"
                )}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
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
      />,

      <Modal
        key="modal"
        size="small"
        className="customer"
        open={openConfirmationModal}
      >
        <Modal.Header>
          {T.translate("conversations.direct_messages.confirmation_header")}
        </Modal.Header>
        <Modal.Content>
          <p className="red">
            {T.translate("conversations.direct_messages.confirmation_msg")}
          </p>
        </Modal.Content>
        <Modal.Actions>
          <button className="ui button" onClick={this.toggleConfirmationModal}>
            {T.translate("conversations.direct_messages.cancel")}
          </button>
          <button
            className="ui negative button"
            onClick={this.handleDelete.bind(this, receiverId)}
          >
            {T.translate("conversations.direct_messages.delete")}
          </button>
        </Modal.Actions>
      </Modal>
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
