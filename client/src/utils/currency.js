import React from "react";
import { Query } from "react-apollo";
import { GET_ACCOUNT_QUERY } from "../graphql/accounts";

// getSubdomain
import { getSubdomain } from "./";
const subdomain = getSubdomain();

const currencySymbolsList = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "",
  AUD: "$",
  CAD: "$",
  CHF: "CHF",
  SGD: "$",
  MYR: "RM",
  JPY: "¥",
  CNY: "¥",
  ETB: "Br",
  KES: "KSh",
  ZAR: "R"
};

const GetCurrencySymbol = () => (
  <Query query={GET_ACCOUNT_QUERY} variables={{ subdomain }}>
    {({ loading, error, data }) => {
      if (loading) return "loading...";
      if (error) console.log("GetCurrencySymbol: ", `Error!: ${error}`);

      const currencyCode = data.getAccount && data.getAccount.currencyCode;

      return <span>{currencySymbolsList[currencyCode]}</span>;
    }}
  </Query>
);

export default GetCurrencySymbol;
