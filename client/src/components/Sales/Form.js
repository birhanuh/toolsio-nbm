import React, { PureComponent } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { addFlashMessage } from "../../actions/flashMessageActions";
import { Validation } from "../../utils";
// Semantic UI Form elements
import {
  Grid,
  Container,
  Segment,
  Message,
  Header,
  Input,
  Select,
  TextArea,
  Form as FormElement,
  Button,
  Icon
} from "semantic-ui-react";
import { graphql, compose } from "react-apollo";
import { GET_CUSTOMERS_QUERY } from "../../graphql/customers";
import {
  GET_SALE_QUERY,
  GET_SALES_QUERY,
  CREATE_SALE_MUTATION,
  UPDATE_SALE_MUTATION
} from "../../graphql/sales";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

// Localization
import T from "i18n-react";

class Form extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.data.getSale ? this.props.data.getSale.id : null,
      name: this.props.data.getSale
        ? this.props.data.getSale.name
        : this.props.location.state && this.props.location.state.name
        ? this.props.location.state.name
        : "",
      deadline: this.props.data.getSale
        ? new Date(this.props.data.getSale.deadline)
        : this.props.location.state && this.props.location.state.deadline
        ? this.props.location.state.deadline
        : new Date(),
      customerId: this.props.data.getSale
        ? this.props.data.getSale.customer.id
        : this.props.location.state && this.props.location.state.id
        ? this.props.location.state.id
        : "",
      status: this.props.data.getSale ? this.props.data.getSale.status : "new",
      description: this.props.data.getSale
        ? this.props.data.getSale.description
        : this.props.location.state && this.props.location.state.description
        ? this.props.location.state.description
        : "",
      errors: {},
      isLoading: false,
      customersOptions: []
    };
  }

  UNSAFE_componentWillMount() {
    this.setCustomerOptions(this.props.getCustomersQuery.getCustomers);
  }

  UNSAFE_componentWillReceiveProps = nextProps => {
    if (nextProps.data.getSale) {
      this.setState({
        id: nextProps.data.getSale.id,
        name: nextProps.data.getSale.name,
        deadline: new Date(nextProps.data.getSale.deadline),
        customerId: nextProps.data.getSale.customer.id,
        status: nextProps.data.getSale.status,
        description: !nextProps.data.getSale.description
          ? ""
          : nextProps.data.getSale.description
      });
    }

    if (nextProps.getCustomersQuery) {
      this.setCustomerOptions(this.props.getCustomersQuery.getCustomers);
    }
  };

  setCustomerOptions(getCustomers) {
    this.setState({
      customersOptions:
        getCustomers &&
        getCustomers.customers.map(customer => ({
          key: customer.id,
          value: customer.id,
          text: customer.name
        }))
    });
  }

  handleChange = (name, value) => {
    if (this.state.errors[name]) {
      // Clone errors form state to local variable
      let errors = Object.assign({}, this.state.errors);
      delete errors[name];

      this.setState({
        [name]: value,
        errors
      });
    } else {
      this.setState({
        [name]: value
      });
    }
  };

  isValid() {
    const { errors, isValid } = Validation.validateSaleInput(this.state);

    let updatedErrors = Object.assign({}, this.state.errors);
    updatedErrors = errors;

    if (!isValid) {
      this.setState({ errors: updatedErrors });
    }

    return isValid;
  }

  handleSubmit = e => {
    e.preventDefault();

    // Validation
    if (this.isValid()) {
      this.setState({ isLoading: true });

      const {
        id,
        name,
        deadline,
        status,
        description,
        customerId
      } = this.state;

      if (id) {
        this.props
          .updateSaleMutation({
            variables: {
              id,
              name,
              deadline,
              status,
              description,
              customerId: parseInt(customerId)
            },
            update: (store, { data: { updateSale } }) => {
              const { success, sale } = updateSale;

              if (!success) {
                return;
              }
              // Read the data from our cache for this query.
              const data = store.readQuery({
                query: GET_SALES_QUERY,
                variables: {
                  order: "DESC",
                  offset: 0,
                  limit: 10,
                  name: ""
                }
              });
              // Add our comment from the mutation to the end.

              let updatedSales = data.getSales.map(item => {
                if (item.id === sale.id) {
                  return { ...sale, __typename: "Sale" };
                }
                return item;
              });

              data.getSales = updatedSales;

              // Write our data back to the cache.
              store.writeQuery({ query: GET_SALES_QUERY, data });
            }
          })
          .then(res => {
            const { success, sale, errors } = res.data.updateSale;

            if (success) {
              this.props.addFlashMessage({
                type: "success",
                text: T.translate("sales.form.flash.success_update", {
                  name: sale.name
                })
              });
              this.props.history.push("/sales");
            } else {
              let errorsList = {};
              errors.map(error => (errorsList[error.path] = error.message));

              this.setState({ errors: errorsList, isLoading: false });
            }
          })
          .catch(err => this.setState({ errors: err, isLoading: false }));
      } else {
        this.props
          .createSaleMutation({
            variables: {
              name,
              deadline,
              status,
              description,
              customerId: parseInt(customerId)
            },
            update: (store, { data: { createSale } }) => {
              const { success, sale } = createSale;

              if (!success) {
                return;
              }

              // Read the data from our cache for this query.
              const data = store.readQuery({
                query: GET_SALES_QUERY,
                variables: {
                  order: "DESC",
                  offset: 0,
                  limit: 10,
                  name: ""
                }
              });
              // Add our Sale from the mutation to the end.
              data.getSales.push(sale);
              // Write our data back to the cache.
              store.writeQuery({
                query: GET_SALES_QUERY,
                variables: {
                  order: "DESC",
                  offset: 0,
                  limit: 10,
                  name: ""
                },
                data
              });
            }
          })
          .then(res => {
            const { success, sale, errors } = res.data.createSale;

            if (success) {
              this.props.addFlashMessage({
                type: "success",
                text: T.translate("sales.form.flash.success_create", {
                  name: sale.name
                })
              });

              this.props.history.push("/sales");
            } else {
              let errorsList = {};
              errors.map(error => (errorsList[error.path] = error.message));

              this.setState({ errors: errorsList, isLoading: false });
            }
          })
          .catch(err => this.setState({ errors: err, isLoading: false }));
      }
    }
  };

  handleChangeDate(deadline) {
    if (!this.state.errors["deadline"]) {
      // Clone errors form state to local variable
      let errors = Object.assign({}, this.state.errors);
      delete errors["deadline"];

      this.setState({
        deadline: deadline,
        errors
      });
    } else {
      this.setState({
        deadline: deadline
      });
    }
  }

  render() {
    const {
      id,
      name,
      deadline,
      customerId,
      status,
      description,
      errors,
      isLoading,
      customersOptions
    } = this.state;

    return (
      <Grid.Row columns={1}>
        <Container text>
          <Segment>
            <FormElement
              loading={isLoading}
              onSubmit={this.handleSubmit.bind(this)}
            >
              <div className="inline field">
                {id ? (
                  <Header as="h1">{T.translate("sales.form.edit_sale")}</Header>
                ) : (
                  <Header as="h1">{T.translate("sales.form.new_sale")}</Header>
                )}
              </div>

              {!!errors.message && (
                <Message negative>
                  <p>{errors.message}</p>
                </Message>
              )}

              <FormElement.Field inline error={!!errors.name}>
                <label>{T.translate("sales.form.name")}</label>
                <Input
                  placeholder={T.translate("sales.form.name")}
                  name="name"
                  value={name}
                  onChange={(e, { value }) => this.handleChange("name", value)}
                  error={!!errors.name}
                />
                <span className="red">{errors.name}</span>
              </FormElement.Field>

              <FormElement.Field inline error={!!errors.deadline}>
                <label>{T.translate("sales.form.deadline")}</label>
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  selected={deadline}
                  onChange={this.handleChangeDate.bind(this)}
                />
                <span className="red">{errors.deadline}</span>
              </FormElement.Field>

              {customersOptions && (
                <FormElement.Field inline error={!!errors.customerId}>
                  <label>{T.translate("sales.form.customer")}</label>
                  <Select
                    placeholder={T.translate("sales.form.select_customer")}
                    name="customerId"
                    value={customerId && customerId}
                    onChange={(e, { value }) =>
                      this.handleChange("customerId", value)
                    }
                    error={!!errors.customerId}
                    options={customersOptions}
                    selection
                  />
                  <span className="red">{errors.customerId}</span>
                </FormElement.Field>
              )}

              {customersOptions && customersOptions.length === 0 && (
                <div className="inline field">
                  <Message info size="small" className="mb-1">
                    <p>{T.translate("sales.form.empty_customers_message")}</p>

                    <Link
                      className="ui primary outline tiny button"
                      to={{
                        pathname: "/customers/new",
                        state: {
                          prevPath: location.pathname,
                          name,
                          deadline,
                          description
                        }
                      }}
                    >
                      <Icon name="add circle" />
                      {T.translate("sales.form.add_new_customer")}
                    </Link>
                  </Message>
                </div>
              )}

              {id && (
                <FormElement.Field
                  inline
                  className={classnames("show", {
                    blue: status === "new",
                    orange: status === "in progress",
                    green: status === "finished",
                    turquoise: status === "delivered",
                    red: status === "delayed",
                    error: !!errors.status
                  })}
                >
                  <label>{T.translate("sales.form.status")}</label>
                  <Select
                    label={T.translate("sales.form.status")}
                    placeholder={T.translate("sales.form.select_status")}
                    name="status"
                    value={status}
                    onChange={(e, { value }) =>
                      this.handleChange("status", value)
                    }
                    error={!!errors.staus}
                    options={[
                      { key: "default", value: "new", text: "NEW" },
                      {
                        key: "in progress",
                        value: "in progress",
                        text: "IN PROGRESS"
                      },
                      { key: "finished", value: "finished", text: "FINISHED" },
                      { key: "delayed", value: "delayed", text: "DELAYED" },
                      {
                        key: "delivered",
                        value: "delivered",
                        text: "DELIVERED"
                      }
                    ]}
                    selection
                  />
                  <span className="red">{errors.status}</span>
                </FormElement.Field>
              )}

              <FormElement.Field inline>
                <label>{T.translate("sales.form.description")}</label>
                <TextArea
                  placeholder={T.translate("sales.form.description")}
                  name="description"
                  value={description}
                  onChange={(e, { value }) =>
                    this.handleChange("description", value)
                  }
                />
              </FormElement.Field>

              <div className="inline field">
                <Link className="ui primary outline button" to="/sales">
                  <i className="minus circle icon" />
                  {T.translate("sales.form.cancel")}
                </Link>
                <Button primary disabled={isLoading}>
                  <Icon name="check circle outline" aria-hidden="true" />
                  &nbsp;{T.translate("sales.form.save")}
                </Button>
              </div>
            </FormElement>
          </Segment>
        </Container>
      </Grid.Row>
    );
  }
}

Form.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
};

const MutationsQuery = compose(
  graphql(CREATE_SALE_MUTATION, {
    name: "createSaleMutation"
  }),
  graphql(UPDATE_SALE_MUTATION, {
    name: "updateSaleMutation"
  }),
  graphql(GET_SALES_QUERY, {
    name: "getSalesQuery",
    options: () => ({
      variables: {
        order: "DESC",
        offset: 0,
        limit: 10
      }
    })
  }),
  graphql(GET_CUSTOMERS_QUERY, {
    name: "getCustomersQuery",
    options: () => ({
      variables: {
        order: "DESC",
        offset: 0,
        limit: 10,
        name: ""
      }
    })
  }),
  graphql(GET_SALE_QUERY, {
    options: props => ({
      variables: {
        id: props.match.params.id ? parseInt(props.match.params.id) : 0
      }
    })
  })
)(Form);

export default connect(
  null,
  { addFlashMessage }
)(withRouter(MutationsQuery));
