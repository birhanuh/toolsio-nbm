import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import classnames from "classnames";
import Moment from "moment";
import { addFlashMessage } from "../../actions/flashMessageActions";
// Semantic UI JS
import {
  Grid,
  Segment,
  Table,
  Header,
  Select,
  Form,
  Icon,
  Button,
  Modal
} from "semantic-ui-react";
import { graphql, compose } from "react-apollo";
import {
  GET_SALES_QUERY,
  GET_SALE_QUERY,
  UPDATE_SALE_MUTATION,
  DELETE_SALE_MUTATION
} from "../../graphql/sales";

import ItemsForm from "./Items/Form";

// Localization
import T from "i18n-react";

class Show extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.data.getSale ? this.props.data.getSale.id : null,
      name: this.props.data.getSale ? this.props.data.getSale.name : "",
      deadline: this.props.data.getSale ? this.props.data.getSale.deadline : "",
      customer: this.props.data.getSale ? this.props.data.getSale.customer : "",
      status: this.props.data.getSale ? this.props.data.getSale.status : "",
      description: this.props.data.getSale
        ? this.props.data.getSale.description
        : "",
      items: this.props.data.getSale ? this.props.data.getSale.items : [],
      user: this.props.data.getSale ? this.props.data.getSale.user : null,
      total: this.props.data.getSale ? this.props.data.getSale.total : 0,
      openConfirmationModal: false
    };
  }

  UNSAFE_componentWillReceiveProps = nextProps => {
    if (nextProps.data.getSale) {
      this.setState({
        id: nextProps.data.getSale.id,
        name: nextProps.data.getSale.name,
        deadline: nextProps.data.getSale.deadline,
        customer: nextProps.data.getSale.customer,
        status: nextProps.data.getSale.status,
        description: nextProps.data.getSale.description,
        items: nextProps.data.getSale.items,
        user: nextProps.data.getSale.user,
        total: nextProps.data.getSale.total
      });
    }
  };

  componentDidMount = () => {
    // Fetch Sale when id is present in params
    const { match } = this.props;

    // Check if param id is an int
    const saleId = parseInt(match.params.id, 10);

    if (!saleId) {
      return <Redirect to="/sales" />;
    } else {
      //this.props.getSaleMutation({ variables: {id: saleId} })
    }
  };

  toggleConfirmationModal = () => {
    this.setState(state => ({
      openConfirmationModal: !state.openConfirmationModal
    }));
  };

  handleStatusChange = value => {
    const { id, name, deadline, description, customer } = this.state;

    this.props
      .updateSaleMutation({
        variables: {
          id,
          name,
          deadline,
          description,
          customerId: customer.id,
          status: value
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
        } else {
          let errorsList = {};
          errors.map(error => (errorsList[error.path] = error.message));

          this.setState({ errors: errorsList, isLoading: false });
        }
      })
      .catch(err => this.setState({ errors: err, isLoading: false }));
  };

  handleDelete(id, event) {
    event.preventDefault();

    const { name } = this.state;

    this.props
      .deleteSaleMutation({
        variables: { id },
        update: (proxy, { data: { deleteSale } }) => {
          const { success } = deleteSale;

          if (!success) {
            return;
          }
          // Read the data from our cache for this query.
          const data = proxy.readQuery({
            query: GET_SALES_QUERY,
            variables: {
              order: "DESC",
              offset: 0,
              limit: 10
            }
          });
          // Add our comment from the mutation to the end.

          let updatedData = data.getSales.filter(sale => sale.id !== id);
          data.getSales = updatedData;

          // Write our data back to the cache.
          proxy.writeQuery({ query: GET_SALES_QUERY, data });
        }
      })
      .then(res => {
        const { success, errors } = res.data.deleteSale;

        if (success) {
          this.props.addFlashMessage({
            type: "success",
            text: T.translate("sales.show.flash.success_delete", { name: name })
          });

          this.props.history.push("/sales");
        } else {
          let errorsList = {};
          errors.map(error => (errorsList[error.path] = error.message));

          this.setState({ errors: errorsList, isLoading: false });
        }
      })
      .catch(() => {
        this.props.addFlashMessage({
          type: "error",
          text: T.translate("sales.show.flash.error_delete", { name: name })
        });
      });
  }

  render() {
    const {
      id,
      name,
      deadline,
      customer,
      status,
      description,
      items,
      user,
      openConfirmationModal
    } = this.state;

    let itemsTotal = 0;
    items.map(item => (itemsTotal += item.total));

    return [
      <Grid.Row columns={1} key="segment">
        <Grid.Column width={14}>
          <Segment>
            <Header
              as="h1"
              dividing
              className={classnames({
                blue: status === "new",
                orange: status === "in progress",
                green: status === "finished",
                turquoise: status === "delivered",
                red: status === "delayed"
              })}
            >
              {name}
            </Header>
            <Table basic="very" collapsing celled>
              <tbody>
                <tr>
                  <td>
                    <i>
                      <Header size="tiny">
                        {T.translate("sales.show.customer")}
                      </Header>
                    </i>
                  </td>
                  <td>
                    {customer ? (
                      <Link to={`/customers/show/${customer.id}`}>
                        {customer.name}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    <i>
                      <Header size="tiny">
                        {T.translate("sales.show.user")}
                      </Header>
                    </i>
                  </td>
                  <td>{user && user.firstName}</td>
                </tr>
                <tr>
                  <td>
                    <i>
                      <Header size="tiny">
                        {T.translate("sales.show.deadline")}
                      </Header>
                    </i>
                  </td>
                  <td>{Moment(deadline).format("ll")}</td>
                </tr>
                <tr>
                  <td>
                    <i>
                      <Header size="tiny">
                        {T.translate("sales.show.status")}
                      </Header>
                    </i>
                  </td>
                  <td>
                    <Form.Field
                      placeholder={T.translate("sales.form.select_status")}
                      control={Select}
                      name="status"
                      value={status}
                      onChange={(e, { value }) =>
                        this.handleStatusChange(value)
                      }
                      className={classnames("inline field show", {
                        blue: status === "new",
                        orange: status === "in progress",
                        green: status === "finished",
                        turquoise: status === "delivered",
                        red: status === "delayed"
                      })}
                      options={[
                        { key: "default", value: "new", text: "NEW" },
                        {
                          key: "in progress",
                          value: "in progress",
                          text: "IN PROGRESS"
                        },
                        {
                          key: "finished",
                          value: "finished",
                          text: "FINISHED"
                        },
                        { key: "delayed", value: "delayed", text: "DELAYED" },
                        {
                          key: "delivered",
                          value: "delivered",
                          text: "DELIVERED"
                        }
                      ]}
                      selection
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <i>
                      <Header size="tiny">
                        {T.translate("sales.show.description")}
                      </Header>
                    </i>
                  </td>
                  <td>{description ? description : "-"}</td>
                </tr>
              </tbody>
            </Table>

            <Header as="h4" attached="top" block>
              {T.translate("sales.items.header")}
            </Header>
            <Segment attached="bottom" className="p-3">
              {items && id && (
                <ItemsForm saleId={id} itemsTotal={itemsTotal} items={items} />
              )}
            </Segment>

            <div className="pt-3">
              <Button negative onClick={this.toggleConfirmationModal}>
                <Icon className="trash" />
                {T.translate("sales.show.delete")}
              </Button>
              <Link to={`/sales/edit/${id}`} className="ui primary button">
                <Icon className="edit" />
                {T.translate("sales.show.edit")}
              </Link>
            </div>
          </Segment>
        </Grid.Column>
      </Grid.Row>,

      <Modal
        key="modal"
        size="small"
        className="sale"
        open={openConfirmationModal}
      >
        <Modal.Header>
          {T.translate("sales.show.confirmation_header")}
        </Modal.Header>
        <Modal.Content>
          <p className="red">{T.translate("sales.show.confirmation_msg")}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.toggleConfirmationModal}>
            {T.translate("sales.show.cancel")}
          </Button>
          <Button negative onClick={this.handleDelete.bind(this, id)}>
            {T.translate("sales.show.delete")}
          </Button>
        </Modal.Actions>
      </Modal>
    ];
  }
}

Show.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
};

const MutationQuery = compose(
  graphql(DELETE_SALE_MUTATION, {
    name: "deleteSaleMutation"
  }),
  graphql(GET_SALES_QUERY, {
    options: () => ({
      variables: {
        order: "DESC",
        offset: 0,
        limit: 10
      }
    })
  }),
  graphql(UPDATE_SALE_MUTATION, {
    name: "updateSaleMutation"
  }),
  graphql(GET_SALE_QUERY, {
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
