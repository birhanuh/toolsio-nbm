import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, Redirect, withRouter } from "react-router-dom";
import classnames from "classnames";
import moment from "moment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { addFlashMessage } from "../../../actions/flashMessageActions";
// Semantic UI JS
import { Grid, Segment, Header, Modal, Button, Icon } from "semantic-ui-react";
import { graphql, compose } from "react-apollo";
import {
  GET_INVOICES_QUERY,
  GET_INVOICE_QUERY,
  DELETE_INVOICE_MUTATION,
  GET_ACCOUNT_QUERY
} from "../../../graphql/invoices";

import { getSubdomain } from "../../../utils";

// Localization
import T from "i18n-react";

import Sale from "./Sale";
import Project from "./Project";

class Page extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.data.getInvoice ? this.props.data.getInvoice.id : null,
      sale: this.props.data.getInvoice ? this.props.data.getInvoice.sale : null,
      project: this.props.data.getInvoice
        ? this.props.data.getInvoice.project
        : null,
      customer: this.props.data.getInvoice
        ? this.props.data.getInvoice.customer
        : null,
      createdAt: this.props.data.getInvoice
        ? this.props.data.getInvoice.createdAt
        : "",
      deadline: this.props.data.getInvoice
        ? this.props.data.getInvoice.deadline
        : "",
      paymentTerm: this.props.data.getInvoice
        ? this.props.data.getInvoice.paymentTerm
        : "",
      interestInArrears: this.props.data.getInvoice
        ? this.props.data.getInvoice.interestInArrears
        : "",
      status: this.props.data.getInvoice
        ? this.props.data.getInvoice.status
        : "",
      referenceNumber: this.props.data.getInvoice
        ? this.props.data.getInvoice.referenceNumber
        : "",
      tax: this.props.data.getInvoice ? this.props.data.getInvoice.tax : "",
      description: this.props.data.getInvoice
        ? this.props.data.getInvoice.description
        : "",
      user: this.props.data.getInvoice ? this.props.data.getInvoice.user : null,
      total: this.props.data.getInvoice ? this.props.data.getInvoice.total : 0,
      openConfirmationModal: false
    };
  }

  componentDidMount = () => {
    // Fetch Project when id is present in params
    const { match } = this.props;

    // Check if param id is an int
    const invoiceId = parseInt(match.params.id, 10);

    if (!invoiceId) {
      return <Redirect to="/invoices" />;
    }
  };

  UNSAFE_componentWillReceiveProps = nextProps => {
    if (nextProps.data.getInvoice) {
      this.setState({
        id: nextProps.data.getInvoice.id,
        sale: nextProps.data.getInvoice.sale,
        project: nextProps.data.getInvoice.project,
        customer: nextProps.data.getInvoice.customer,
        createdAt: nextProps.data.getInvoice.createdAt,
        deadline: nextProps.data.getInvoice.deadline,
        paymentTerm: nextProps.data.getInvoice.paymentTerm,
        interestInArrears: nextProps.data.getInvoice.interestInArrears,
        status: nextProps.data.getInvoice.status,
        referenceNumber: nextProps.data.getInvoice.referenceNumber,
        tax: nextProps.data.getInvoice.tax,
        description: nextProps.data.getInvoice.description,
        user: nextProps.data.getInvoice.user,
        total: nextProps.data.getInvoice.total
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

    const { project, sale } = this.state;

    let projectSaleName = (project && project.name) || (sale && sale.name);

    this.props
      .deleteInvoiceMutation({
        variables: { id },
        update: (store, { data: { deleteInvoice } }) => {
          const { success } = deleteInvoice;

          if (!success) {
            return;
          }

          // Read the data from our cache for this query.
          const data = store.readQuery({
            query: GET_INVOICES_QUERY,
            variables: {
              order: "DESC",
              offset: 0,
              limit: 10,
              name: ""
            }
          });

          // Filter out deleted invoice from store.
          let updatedInvoices = data.getInvoices.invoices.filter(
            invoice => invoice.id !== id
          );
          data.getInvoices.invoices = updatedInvoices;

          // Write our data back to the cache.
          store.writeQuery({
            query: GET_INVOICES_QUERY,
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
        const { success, errors } = res.data.deleteInvoice;

        if (success) {
          this.props.addFlashMessage({
            type: "success",
            text: T.translate("invoices.show.flash.success_delete", {
              name: projectSaleName
            })
          });

          this.props.history.push("/invoices");
        } else {
          let errorsList = {};
          errors.map(error => (errorsList[error.path] = error.message));

          this.setState({ errors: errorsList, isLoading: false });
        }
      })
      .catch(err => {
        this.props.addFlashMessage({
          type: "error",
          text: T.translate("invoices.show.flash.error_delete", {
            name: projectSaleName
          })
        });

        this.setState({ errors: err, isLoading: false });
      });
  }

  printPDF = (referenceNumber, event) => {
    event.preventDefault();

    let pdfElement = document.querySelector("#pdf-section");

    html2canvas(pdfElement, {
      logging: true,
      onclone: function(documentCloned) {
        // Hide unwanted elements
        documentCloned.querySelector(".btn-groups").style.display = "none";
        documentCloned.querySelector(".pdf-download-btn").style.display =
          "none";
      }
    }).then(canvas => {
      let contentWidth = canvas.width;
      let contentHeight = canvas.height;

      // pdf page offset
      let position = 20,
        x = 20,
        y = 0;

      let pageHeight = (contentWidth / 595.28) * 841.89;

      let restHeight = contentHeight;

      // The text that is ultimately used for display
      // The size of the a4 paper [595.28, 841.89], the width and height of the image generated by the html page in the pdf
      let imgWidth = 595.28 - position * 2; // 595.28 - 20 -20
      let imgHeight = (imgWidth / contentWidth) * contentHeight - position * 2; // Scale up

      // let imgHeight = 841.89 - position * 2
      let pageData = canvas.toDataURL("image/jpeg", 1.0);

      // The first parameter is the direction, the second parameter is the unit, and the third parameter is the paper type.
      let pdf = new jsPDF("", "pt", "a4"); //When the content does not exceed the range displayed on the pdf page, no paging is required.
      // There are two heights to distinguish, one is the actual height of the html page, and the height of the page that generated the pdf (841.89)
      if (restHeight < pageHeight) {
        // only one page
        pdf.addImage(pageData, "JPEG", x, position, imgWidth, imgHeight);
      } else {
        // 2 or more pages
        while (restHeight > 0) {
          pdf.addImage(pageData, "JPEG", x, position + y, imgWidth, imgHeight);
          restHeight -= pageHeight;
          y -= 841.89;

          // Avoid adding blank pages
          if (restHeight > 0) {
            pdf.addPage();
          }
        }
      }

      // Print page
      pdf.save(`${referenceNumber}.pdf`);
    });
  };

  render() {
    const {
      id,
      sale,
      project,
      customer,
      deadline,
      paymentTerm,
      interestInArrears,
      status,
      referenceNumber,
      tax,
      description,
      user,
      createdAt,
      openConfirmationModal
    } = this.state;

    const {
      getAccountQuery: { getAccount }
    } = this.props;

    return [
      <Grid.Row key="segment" columns={1}>
        <Grid.Column width={12} id="pdf-section" className="invoice show">
          <Segment>
            <div className="ui vertically divided grid">
              <Grid.Row className="pb-0">
                <Grid.Column width={7}>
                  <Header
                    as="h1"
                    className={classnames("uppercase", {
                      blue: status === "new",
                      orange: status === "pending",
                      red: status === "overdue",
                      green: status === "paid"
                    })}
                  >
                    {T.translate("invoices.show.header")}

                    {project && (
                      <Link
                        to={`/projects/show/${project.id}`}
                        className={classnames(
                          "sub header d-inline-block pl-1",
                          {
                            blue: status === "new",
                            orange: status === "pending",
                            red: status === "overdue",
                            green: status === "paid"
                          }
                        )}
                      >
                        ({project.name})
                      </Link>
                    )}

                    {sale && (
                      <Link
                        to={`/sales/show/${sale.id}`}
                        className={classnames(
                          "sub header d-inline-block pl-1",
                          {
                            blue: status === "new",
                            orange: status === "pending",
                            red: status === "overdue",
                            green: status === "paid"
                          }
                        )}
                      >
                        ({sale.name})
                      </Link>
                    )}
                  </Header>
                </Grid.Column>

                <Grid.Column width={4} textAlign="right">
                  <div className="ui sizer vertical segment">
                    <p>
                      {T.translate("invoices.show.account.user.first_name")}
                      <strong>{user && user.firstName}</strong>
                    </p>
                    <p>
                      {T.translate("invoices.show.account.user.email")}
                      <strong>{user && user.email}</strong>
                    </p>
                  </div>
                </Grid.Column>

                <Grid.Column width={4} textAlign="right">
                  <Segment vertical>
                    <p>
                      {T.translate("invoices.show.account.address.street")}
                      <strong>{getAccount && getAccount.street}</strong>
                    </p>
                    <p>
                      {T.translate("invoices.show.account.address.postal_code")}
                      <strong>{getAccount && getAccount.postalCode}</strong>
                    </p>
                    <p>
                      {T.translate("invoices.show.account.address.region")}
                      <strong>{getAccount && getAccount.region}</strong>
                    </p>
                    <p>
                      {T.translate("invoices.show.account.address.country")}
                      <strong>{getAccount && getAccount.country}</strong>
                    </p>
                  </Segment>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row
                className={classnames("pt-0", {
                  blue: status === "new",
                  orange: status === "pending",
                  red: status === "overdue",
                  green: status === "paid"
                })}
              >
                <Grid.Column width={6}>
                  <Segment vertical>
                    <h3 className="body-color">
                      {T.translate("invoices.show.customer.billed_to")}
                    </h3>
                    <p>
                      {T.translate("invoices.show.customer.name")}
                      <strong>
                        {customer && (
                          <Link to={`/customers/show/${customer.id}`}>
                            {customer.name}
                          </Link>
                        )}
                      </strong>
                    </p>
                    <p>
                      {T.translate("invoices.show.customer.vat_number")}
                      <strong>{customer && customer.vatNumber}</strong>
                    </p>
                    <p>
                      {T.translate("invoices.show.customer.address.street")}
                      <strong>{customer && customer.street}</strong>
                    </p>
                    <p>
                      {T.translate(
                        "invoices.show.customer.address.postal_code"
                      )}
                      <strong>{customer && customer.postalCode}</strong>
                    </p>
                    <p>
                      {T.translate("invoices.show.customer.address.region")}
                      <strong>{customer && customer.region}</strong>
                    </p>
                    <p>
                      {T.translate("invoices.show.customer.address.country")}
                      <strong>{customer && customer.country}</strong>
                    </p>
                  </Segment>
                </Grid.Column>

                <Grid.Column width={6}>
                  <Segment vertical>
                    <p>
                      {T.translate("invoices.show.date_of_an_invoice")}
                      <strong>{moment(createdAt).format("YYYY-MM-DD")}</strong>
                    </p>
                    <p>
                      {T.translate("invoices.show.deadline")}
                      <strong>
                        {deadline ? moment(deadline).format("YYYY-MM-DD") : "-"}
                      </strong>
                    </p>
                    <p>
                      {T.translate("invoices.show.payment_term")}
                      <strong>{paymentTerm ? paymentTerm : "-"}</strong>
                    </p>
                    <p>
                      {T.translate("invoices.show.interest_in_arrears")}
                      <strong>
                        {interestInArrears ? interestInArrears : ""}
                      </strong>
                    </p>
                    <p>
                      {T.translate("invoices.show.reference_number")}
                      <strong>{referenceNumber}</strong>
                    </p>
                    <p>
                      {T.translate("invoices.show.description")}
                      <strong>{description ? description : "-"}</strong>
                    </p>
                  </Segment>
                </Grid.Column>
                <Grid.Column width={4}>
                  <Segment vertical>
                    <Button
                      basic
                      className="pdf-download-btn"
                      onClick={this.printPDF.bind(this, referenceNumber)}
                    >
                      <Icon name="file pdf outline" />
                      {T.translate("invoices.show.pdf_download")}
                    </Button>
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            </div>

            <div
              className={classnames("ui uppercase huge right corner label", {
                blue: status === "new",
                orange: status === "pending",
                red: status === "overdue",
                green: status === "paid"
              })}
            >
              <p>{status}</p>
            </div>

            {sale && <Sale sale={sale} status={status} tax={tax} />}

            {project && <Project project={project} status={status} tax={tax} />}

            <div className="pt-3 btn-groups">
              <button
                className="ui negative button"
                onClick={this.toggleConfirmationModal}
              >
                <i className="trash icon" />
                {T.translate("invoices.show.delete")}
              </button>
              <Link to={`/invoices/edit/${id}`} className="ui primary button">
                <i className="edit icon" />
                {T.translate("invoices.show.edit")}
              </Link>
            </div>
          </Segment>
        </Grid.Column>
      </Grid.Row>,

      <Modal
        key="modal"
        size="small"
        className="invoice"
        open={openConfirmationModal}
      >
        <Modal.Header>
          {T.translate("invoices.show.confirmation_header")}
        </Modal.Header>
        <Modal.Content>
          <p className="red">{T.translate("invoices.show.confirmation_msg")}</p>
        </Modal.Content>
        <Modal.Actions>
          <button className="ui button" onClick={this.toggleConfirmationModal}>
            {T.translate("invoices.show.cancel")}
          </button>
          <button
            className="ui negative button"
            onClick={this.handleDelete.bind(this, id)}
          >
            {T.translate("invoices.show.delete")}
          </button>
        </Modal.Actions>
      </Modal>
    ];
  }
}

Page.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
};

const MutationQuery = compose(
  graphql(DELETE_INVOICE_MUTATION, {
    name: "deleteInvoiceMutation"
  }),
  graphql(GET_INVOICE_QUERY, {
    options: props => ({
      variables: {
        id: parseInt(props.match.params.id)
      }
    })
  }),
  graphql(GET_ACCOUNT_QUERY, {
    name: "getAccountQuery",
    options: () => ({
      variables: {
        subdomain: getSubdomain()
      }
    })
  }),
  graphql(GET_INVOICES_QUERY, {
    name: "getInvoicesQuery",
    options: () => ({
      variables: {
        order: "DESC",
        offset: 0,
        limit: 10,
        name: ""
      },
      fetchPolicy: "cache-network-only"
    })
  })
)(Page);

export default connect(
  null,
  { addFlashMessage }
)(withRouter(MutationQuery));
