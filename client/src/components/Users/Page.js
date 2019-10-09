import React, { PureComponent } from "react";
import { Grid, Container } from "semantic-ui-react";
import { graphql } from "react-apollo";
import { GET_INVITED_USERS_QUERY } from "../../graphql/users";

import List from "./List";
import Form from "./Form";

class Page extends PureComponent {
  render() {
    const {
      data: { getInvitedUsers },
      currentAccount
    } = this.props;

    return (
      <Grid.Row columns={1}>
        <Container text>
          <Form currentAccount={currentAccount} />

          {getInvitedUsers && <List users={getInvitedUsers} />}
        </Container>
      </Grid.Row>
    );
  }
}

export default graphql(GET_INVITED_USERS_QUERY)(Page);
