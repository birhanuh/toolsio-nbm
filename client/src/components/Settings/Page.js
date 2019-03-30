import React from "react";
// Semantic UI Form elements
import { Grid, Segment, Item, Divider } from "semantic-ui-react";
import AccountForm from "./AccountForm";
import UserForm from "./UserForm";

const Page = ({ currentAccount }) => (
  <Grid.Row>
    <Grid.Column width={12}>
      <Segment className="account">
        <Item.Group>
          <AccountForm subdomain={currentAccount.subdomain} />
        </Item.Group>
      </Segment>

      <Divider />

      <Segment className="user">
        <Item.Group>
          <UserForm email={currentAccount.user.email} />
        </Item.Group>
      </Segment>
    </Grid.Column>
  </Grid.Row>
);

export default Page;
