import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import map from "lodash/map";
import classnames from "classnames";
import { addFlashMessage } from "../../actions/flashMessageActions";
// Semantic UI JS
import {
  Grid,
  Segment,
  Button,
  Icon,
  Card,
  Modal,
  Message,
  Header,
  Divider
} from "semantic-ui-react";
import { graphql, compose } from "react-apollo";
import {
  GET_CUSTOMERS_QUERY,
  GET_CUSTOMER_QUERY,
  DELETE_CUSTOMER_MUTATION
} from "../../graphql/customers";

import moment from "moment";

// Localization
import T from "i18n-react";

class Show extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.data.getCustomer ? this.props.data.getCustomer.id : null,
      name: this.props.data.getCustomer ? this.props.data.getCustomer.name : "",
      address: {
        street: this.props.data.getCustomer
          ? this.props.data.getCustomer.street
          : "",
        postalCode: this.props.data.getCustomer
          ? this.props.data.getCustomer.postalCode
          : "",
        region: this.props.data.getCustomer
          ? this.props.data.getCustomer.region
          : "",
        country: this.props.data.getCustomer
          ? this.props.data.getCustomer.country
          : ""
      },
      vatNumber: this.props.data.getCustomer
        ? this.props.data.getCustomer.vatNumber
        : "",
      isContactIncludedInInvoice: this.props.data.getCustomer
        ? this.props.data.getCustomer.isContactIncludedInInvoice
        : false,
      contact: {
        phoneNumber: this.props.data.getCustomer
          ? this.props.data.getCustomer.phoneNumber
          : "",
        email: this.props.data.getCustomer
          ? this.props.data.getCustomer.email
          : ""
      },
      sales: this.props.data.getCustomer
        ? this.props.data.getCustomer.sales
        : null,
      projects: this.props.data.getCustomer
        ? this.props.data.getCustomer.projects
        : null,
      invoices: this.props.data.getCustomer
        ? this.props.data.getCustomer.invoices
        : null,
      user: this.props.data.getCustomer
        ? this.props.data.getCustomer.user
        : null,
      openConfirmationModal: false
    };
  }

  componentDidMount = () => {
    // Fetch Project when id is present in params
    const { match } = this.props;

    // Check if param id is an int
    const customerId = parseInt(match.params.id, 10);

    if (!customerId) {
      return <Redirect to="/customers" />;
    }
  };

  UNSAFE_componentWillReceiveProps = nextProps => {
    if (nextProps.data.getCustomer) {
      this.setState({
        id: nextProps.data.getCustomer.id,
        name: nextProps.data.getCustomer.name,
        address: {
          street: nextProps.data.getCustomer.street,
          postalCode: nextProps.data.getCustomer.postalCode,
          region: nextProps.data.getCustomer.region,
          country: nextProps.data.getCustomer.country
        },
        vatNumber: nextProps.data.getCustomer.vatNumber,
        isContactIncludedInInvoice:
          nextProps.data.getCustomer.isContactIncludedInInvoice,
        contact: {
          phoneNumber: nextProps.data.getCustomer.phoneNumber,
          email: nextProps.data.getCustomer.email
        },
        sales: nextProps.data.getCustomer.sales,
        projects: nextProps.data.getCustomer.projects,
        invoices: nextProps.data.getCustomer.invoices,
        user: nextProps.data.getCustomer.user
      });
    }
  };

  toggleConfirmationModal = () => {
    this.setState(state => ({
      openConfirmationModal: !state.openConfirmationModal
    }));
  };

  handleDelete(id, event) {
    event.preventDefault();

    const { name } = this.state;

    this.props
      .deleteCustomerMutation({
        variables: { id },
        update: (proxy, { data: { deleteCustomer } }) => {
          const { success } = deleteCustomer;

          if (!success) {
            return;
          }
          // Read the data from our cache for this query.
          const data = proxy.readQuery({
            query: GET_CUSTOMERS_QUERY,
            variables: {
              order: "DESC",
              offset: 0,
              limit: 10,
              name: ""
            }
          });
          // Filter out deleted customer from store.
          let updatedCustomers = data.getCustomers.customers.filter(
            customer => customer.id !== id
          );
          data.getCustomers.customers = updatedCustomers;

          // Write our data back to the cache.
          proxy.writeQuery({
            query: GET_CUSTOMERS_QUERY,
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
        const { success, errors } = res.data.deleteCustomer;

        if (success) {
          this.props.addFlashMessage({
            type: "success",
            text: T.translate("customers.show.flash.success_delete", {
              name: name
            })
          });

          this.props.history.push("/customers");
        } else {
          let errorsList = {};
          errors.map(error => (errorsList[error.path] = error.message));

          this.setState({ errors: errorsList, isLoading: false });
        }
      })
      .catch(() => {
        this.props.addFlashMessage({
          type: "error",
          text: T.translate("customers.show.flash.error_delete", { name: name })
        });
      });
  }

  render() {
    const {
      id,
      name,
      vatNumber,
      contact,
      isContactIncludedInInvoice,
      address,
      projects,
      sales,
      invoices,
      user,
      openConfirmationModal
    } = this.state;

    const emptyProjectsMessage = (
      <Message info size="small">
        <Header>{T.translate("projects.page.empty_projects_header")}</Header>
      </Message>
    );

    const projectsList = map(projects, project => (
      <Card key={project.id}>
        <Card.Content>
          <div
            className={classnames("ui right floated uppercase tiny label", {
              blue: project.status === "new",
              orange: project.status === "in progress",
              green: project.status === "finished",
              turquoise: project.status === "delivered",
              red: project.status === "delayed"
            })}
          >
            {project.status}
          </div>
          <Card.Header>
            <Link
              to={`/projects/show/${project.id}`}
              className={classnames({
                blue: project.status === "new",
                orange: project.status === "in progress",
                green: project.status === "finished",
                turquoise: project.status === "delivered",
                red: project.status === "delayed"
              })}
            >
              {project.name}
            </Link>
          </Card.Header>
          <Card.Meta>{moment(project.deadline).format("ll")}</Card.Meta>
        </Card.Content>
      </Card>
    ));

    const emptySalesMessage = (
      <Message info size="small">
        <Header>{T.translate("sales.page.empty_sales_header")}</Header>
      </Message>
    );

    const salesList = map(sales, sale => (
      <Card key={sale.id}>
        <Card.Content>
          <div
            className={classnames("ui right floated uppercase tiny label", {
              blue: sale.status === "new",
              orange: sale.status === "in progress",
              green: sale.status === "ready",
              turquoise: sale.status === "delivered",
              red: sale.status === "delayed"
            })}
          >
            {sale.status}
          </div>
          <Card.Header>
            <Link
              to={`/sales/show/${sale.id}`}
              className={classnames({
                blue: sale.status === "new",
                orange: sale.status === "in progress",
                green: sale.status === "ready",
                turquoise: sale.status === "delivered",
                red: sale.status === "delayed"
              })}
            >
              {sale.name}
            </Link>
          </Card.Header>
          <Card.Meta>{moment(sale.deadline).format("ll")}</Card.Meta>
        </Card.Content>
      </Card>
    ));

    const emptyInvoicesMessage = (
      <Message info size="small">
        <Header>{T.translate("invoices.page.empty_invoices_header")}</Header>
      </Message>
    );

    const invoicesList = map(invoices, invoice => (
      <Card key={invoice.id}>
        <Card.Content>
          <div
            className={classnames("ui right floated uppercase tiny label", {
              blue: invoice.status === "new",
              orange: invoice.status === "pending",
              red: invoice.status === "overdue",
              green: invoice.status === "paid"
            })}
          >
            {invoice.status}
          </div>
          <Card.Header>
            <Link
              to={`/invoices/show/${invoice.id}`}
              className={classnames({
                blue: invoice.status === "new",
                orange: invoice.status === "pending",
                red: invoice.status === "overdue",
                green: invoice.status === "paid"
              })}
            >
              {invoice.referenceNumber}
            </Link>
          </Card.Header>
          <Card.Meta>
            {moment(invoice.deadline).format("ll") || invoice.paymentTerm}
          </Card.Meta>
        </Card.Content>
      </Card>
    ));

    return [
      <Grid.Row columns={1} key="segment">
        <Grid.Column width={12} className="customer show">
          <Segment>
            <Header as="h1" dividing>
              {name}
            </Header>
            <Grid columns={3}>
              <Grid.Column width={6}>
                <Segment vertical>
                  <p>
                    {T.translate("customers.show.vat_number")}
                    <strong>{vatNumber}</strong>
                  </p>
                  <p>
                    {T.translate("customers.show.user")}
                    <strong>{user && user.firstName}</strong>
                  </p>
                  <p>
                    {T.translate("customers.show.include_contact_in_invoice")}
                    {isContactIncludedInInvoice ? (
                      <i className="check circle icon green" />
                    ) : (
                      <i className="minus circle icon red" />
                    )}
                  </p>
                </Segment>
              </Grid.Column>
              <Grid.Column width={4}>
                <Segment vertical className="profile">
                  <h3 className="ui header">
                    {T.translate("customers.show.contact.header")}
                  </h3>
                  <p>
                    {T.translate("customers.show.contact.phone_number")}
                    <strong>
                      {contact.phoneNumber ? contact.phoneNumber : "-"}
                    </strong>
                  </p>
                  <p>
                    {T.translate("customers.show.contact.email")}
                    <strong>{contact.email ? contact.email : "-"}</strong>
                  </p>
                </Segment>
              </Grid.Column>

              <Grid.Column width={6}>
                <Segment vertical className="profile">
                  <p>
                    {T.translate("customers.show.address.street")}
                    <strong>{address && address.street}</strong>
                  </p>
                  <p>
                    {T.translate("customers.show.address.postal_code")}
                    <strong>{address && address.postalCode}</strong>
                  </p>
                  <p>
                    {T.translate("customers.show.address.region")}
                    <strong>{address && address.region}</strong>
                  </p>
                  <p>
                    {T.translate("customers.show.address.country")}
                    <strong>{address && address.country}</strong>
                  </p>
                </Segment>
              </Grid.Column>
            </Grid>

            <Divider />

            <Header as="h4" attached="top" block>
              {T.translate("projects.page.header")}
            </Header>
            <Segment attached="bottom">
              {projects && projects.length !== 0 ? (
                <Card.Group itemsPerRow={3}>{projectsList}</Card.Group>
              ) : (
                emptyProjectsMessage
              )}
            </Segment>

            <Header as="h4" attached="top" block>
              {T.translate("sales.page.header")}
            </Header>
            <Segment attached="bottom">
              {sales && sales.length !== 0 ? (
                <Card.Group itemsPerRow={3}>{salesList}</Card.Group>
              ) : (
                emptySalesMessage
              )}
            </Segment>

            <Header as="h4" attached="top" block>
              {T.translate("invoices.page.header")}
            </Header>
            <Segment attached="bottom">
              {invoices && invoices.length !== 0 ? (
                <Card.Group itemsPerRow={3}>{invoicesList}</Card.Group>
              ) : (
                emptyInvoicesMessage
              )}
            </Segment>

            <div className="pt-3">
              <Button negative onClick={this.toggleConfirmationModal}>
                <Icon name="trash" />
                {T.translate("customers.show.delete")}
              </Button>
              <Link to={`/customers/edit/${id}`} className="ui primary button">
                <Icon name="edit" />
                {T.translate("customers.show.edit")}
              </Link>
            </div>
          </Segment>
        </Grid.Column>
      </Grid.Row>,

      <Modal
        key="modal"
        size="small"
        className="customer"
        open={openConfirmationModal}
      >
        <Modal.Header>
          {T.translate("customers.show.confirmation_header")}
        </Modal.Header>
        <Modal.Content>
          <p className="red">
            {T.translate("customers.show.confirmation_msg")}
          </p>
        </Modal.Content>
        <Modal.Actions>
          <button className="ui button" onClick={this.toggleConfirmationModal}>
            {T.translate("customers.show.cancel")}
          </button>
          <button
            className="ui negative button"
            onClick={this.handleDelete.bind(this, id)}
          >
            {T.translate("customers.show.delete")}
          </button>
        </Modal.Actions>
      </Modal>
    ];
  }
}

Show.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
};

const MutationQuery = compose(
  graphql(DELETE_CUSTOMER_MUTATION, {
    name: "deleteCustomerMutation"
  }),
  graphql(GET_CUSTOMER_QUERY, {
    options: props => ({
      variables: {
        id: parseInt(props.match.params.id)
      }
    })
  })
)(Show);

export default connect(
  null,
  { addFlashMessage }
)(MutationQuery);
