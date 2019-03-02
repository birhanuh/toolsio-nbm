import React from "react";
import { Route, Redirect } from "react-router-dom";
import { getSubdomain } from "./";

// Login route
export const SubdomainRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      getSubdomain() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/", state: { from: props.location } }} />
      )
    }
  />
);
