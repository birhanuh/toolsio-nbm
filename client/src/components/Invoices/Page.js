import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
// Semantic UI JS
import { Grid, Select, Input, Icon, Segment } from "semantic-ui-react";
import { graphql } from "react-apollo";
import { GET_INVOICES_QUERY } from "../../graphql/invoices";

import Table from "./Table";

// Localization
import T from "i18n-react";

class Page extends PureComponent {
  state = {
    search: "",
    limit: this.props.match.params.limit
      ? parseInt(this.props.match.params.limit)
      : 10
  };

  handleChange = (name, value) => {
    this.setState({
      [name]: value
    });

    if (name === "limit") {
      this.props.data.fetchMore({
        variables: {
          limit: value
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          return Object.assign({}, prev, {
            getInvioces: fetchMoreResult.getInvioces
          });
        }
      });
    }
  };

  handleSearch = () => {
    this.props.data.fetchMore({
      variables: {
        search: this.state.search
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          getInvoices: fetchMoreResult.getInvoices
        });
      }
    });
  };

  render() {
    const { limit } = this.state;
    const { params } = this.props.match;

    let offset = params.offset ? parseInt(params.offset) : 0;

    const { getInvoices } = this.props.data;

    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Segment vertical className="p-0 mb-5">
            <Link className="ui primary button" to="/invoices/new">
              <Icon name="add circle" />
              {T.translate("invoices.page.create_new_invoice")}
            </Link>
          </Segment>

          <Segment>
            <Segment clearing basic className="p-0">
              <div className="ui right floated input">
                <div className="ui icon input">
                  <Input
                    name="search"
                    value={this.state.search}
                    onChange={(e, { value }) =>
                      this.handleChange("search", value)
                    }
                    icon={
                      <Icon
                        name="search"
                        inverted
                        circular
                        link
                        onClick={this.handleSearch}
                      />
                    }
                    placeholder={T.translate("invoices.page.search")}
                  />
                </div>
              </div>
              <div className="ui left floated select">
                <Select
                  name="limit"
                  value={limit.toString()}
                  onChange={(e, { value }) => this.handleChange("limit", value)}
                  options={[
                    { key: "default", value: "10", text: "10" },
                    { key: "50", value: "50", text: "50" },
                    { key: "100", value: "100", text: "100" },
                    { key: "500", value: "500", text: "500" }
                  ]}
                  selection
                  compact
                />
              </div>
            </Segment>

            {getInvoices && (
              <Table
                invoices={getInvoices.invoices}
                count={getInvoices.count}
                offset={offset}
                limit={limit}
              />
            )}
          </Segment>
        </Grid.Column>
      </Grid.Row>
    );
  }
}

export default graphql(GET_INVOICES_QUERY, {
  options: props => ({
    variables: {
      order: props.match.params.order
        ? props.match.params.order.toUpperCase()
        : "DESC",
      offset: props.match.params.offset
        ? parseInt(props.match.params.offset)
        : 0,
      limit: props.match.params.limit ? parseInt(props.match.params.limit) : 10,
      search: ""
    },
    fetchPolicy: "cache-network-only"
  })
})(Page);
