import React from "react";
import { Route, Redirect } from "react-router-dom";

import { isAuthenticated } from ".";

// Dashboard or Landing page routes
export const LandingSubdomainSignupPageRoute = ({
  component: Component,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Redirect to={{ pathname: "/dashboard" }} />
      ) : (
        <Component {...props} />
      )
    }
  />
);
