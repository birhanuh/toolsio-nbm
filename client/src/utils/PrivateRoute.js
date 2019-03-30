import React from "react";
import { Route, Redirect } from "react-router-dom";
import { Query } from "react-apollo";
import { GET_CURRENT_ACCOUNT_QUERY } from "../graphql/authentications";

// Authorization utils
import { deleteCookie } from "./";

// Authenticated routes
export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Query query={GET_CURRENT_ACCOUNT_QUERY} fetchPolicy="network-only">
    {({ loading, error, data }) => {
      if (loading) return null;
      if (error) return `Error!: ${error}`;

      const { success, subdomain, user } = data.getCurrentAccount;

      if (!success) {
        // Delete cookie of current account
        deleteCookie("currentAccount");
      }
      console.log("PrivateRoute: ", success, subdomain, user);

      return (
        <Route
          {...rest}
          render={props =>
            success ? (
              <Component
                {...props}
                location={props.location}
                currentAccount={{ subdomain, user }}
              />
            ) : (
              <Redirect to="/login" />
            )
          }
        />
      );
    }}
  </Query>
);
