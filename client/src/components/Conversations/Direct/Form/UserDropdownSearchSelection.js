import React from "react";
import { withRouter } from "react-router-dom";
import { Dropdown, Form } from "semantic-ui-react";
import { graphql } from "react-apollo";
import { GET_USERS_QUERY } from "../../../../graphql/users";

// Localization
import T from "i18n-react";

// Avatar placeholder
import avatarPlaceholderSmall from "../../../../images/avatar-placeholder-small.png";

const UserDropdownSearchSelection = ({
  onClose,
  history,
  data: { getUsers }
}) => {
  const handleChange = (name, value) => {
    history.push(`/conversations/receiver/${value}`);
    onClose();
  };

  const usersOptions =
    getUsers &&
    getUsers.map(user => ({
      key: user.id,
      value: user.id,
      text: user.firstName,
      image: {
        avatar: true,
        src: user.avatarUrl ? user.avatarUrl : avatarPlaceholderSmall,
        alt: "avatar"
      }
    }));

  return (
    <Form.Field>
      <label>
        {T.translate("conversations.direct_messages.search_select_user")}
      </label>
      {usersOptions && (
        <Dropdown
          placeholder={T.translate(
            "conversations.direct_messages.search_select_user"
          )}
          fluid
          search
          selection
          options={usersOptions}
          onChange={(e, { value }) => handleChange("user", value)}
          name="user"
        />
      )}
    </Form.Field>
  );
};

export default withRouter(
  graphql(GET_USERS_QUERY)(UserDropdownSearchSelection)
);
