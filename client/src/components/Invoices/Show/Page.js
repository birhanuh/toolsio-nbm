import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import classnames from 'classnames'
import { addFlashMessage } from '../../../actions/flashMessageActions'
// Semantic UI JS
import { Modal } from 'semantic-ui-react'
import { graphql, compose } from 'react-apollo'
import { GET_INVOICES_QUERY, GET_INVOICE_QUERY, DELETE_INVOICE_MUTATION, GET_ACCOUNT_QUERY } from '../../../graphql/invoices'

import { Authorization } from '../../../utils'

// Localization 
import T from 'i18n-react'

import Sale from './Sale'
import Project from './Project'

import moment from 'moment'

class Page extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.data.getInvoice ? this.props.data.getInvoice.id : null,
      sale: this.props.data.getInvoice ? this.props.data.getInvoice.sale : null,
      project: this.props.data.getInvoice ? this.props.data.getInvoice.project : null,
      customer: this.props.data.getInvoice ? this.props.data.getInvoice.customer : null,
      createdAt: this.props.data.getInvoice ? this.props.data.getInvoice.createdAt : '',
      deadline: this.props.data.getInvoice ? this.props.data.getInvoice.deadline : '',
      paymentTerm: this.props.data.getInvoice ? this.props.data.getInvoice.paymentTerm : '',
      interestInArrears: this.props.data.getInvoice ? this.props.data.getInvoice.interestInArrears : '',
      status: this.props.data.getInvoice ? this.props.data.getInvoice.status : '',
      referenceNumber: this.props.data.getInvoice ? this.props.data.getInvoice.referenceNumber : '',
      tax: this.props.data.getInvoice ? this.props.data.getInvoice.tax : '',
      description: this.props.data.getInvoice ? this.props.data.getInvoice.description : '',
      user: this.props.data.getInvoice ? this.props.data.getInvoice.user : null,
      total: this.props.data.getInvoice ? this.props.data.getInvoice.total : 0,
      openConfirmationModal: false 
    }
  }

  componentDidMount = () => {
     // Fetch Project when id is present in params
    const { match } = this.props

    // Check if param id is an int
    const invoiceId = parseInt(match.params.id, 10)
    
    if (!invoiceId) {
      return <Redirect to="/invoices" />
    } 
  }

  componentWillReceiveProps = (nextProps) => {
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
      })
    }
  }

  toggleConfirmationModal = () => {    
    this.setState(state => ({ openConfirmationModal: !state.openConfirmationModal }))
  }

  handleDelete(id, event) {
    event.preventDefault()
    
    const { project, sale } = this.state

    let projectSaleName = (project && project.name) || (sale && sale.name)
    
    this.props.deleteInvoiceMutation({ 
      variables: { id },
      update: (proxy, { data: { deleteInvoice } }) => {
        const { success } = deleteInvoice

        if (!success) {
          return
        }
        // Read the data from our cache for this query.
        const data = proxy.readQuery({ query: GET_INVOICES_QUERY,
          variables: {
            order: 'DESC',
            offset: 0,
            limit: 10
          } 
        })
        // Add our comment from the mutation to the end.
        
        let updatedData = data.getInvoices.filter(invoice => invoice.id !== id) 
        data.getInvoices = updatedData

        // Write our data back to the cache.
        proxy.writeQuery({ query: GET_INVOICES_QUERY, data })
      }})
      .then(res => {          

        const { success, errors } = res.data.deleteInvoice

        if (success) {
          this.props.addFlashMessage({
            type: 'success',
            text: T.translate("invoices.show.flash.success_delete", { name: projectSaleName })
          })  

          this.context.router.history.push('/invoices')
        } else {
          let errorsList = {}
          errors.map(error => errorsList[error.path] = error.message)

          this.setState({ errors: errorsList, isLoading: false })
        }
      })
      .catch(err => {
        this.props.addFlashMessage({
          type: 'error',
          text: T.translate("invoices.show.flash.error_delete", { name: projectSaleName })
        })  

        this.setState({ errors: err, isLoading: false })
      })    
  }

  render() {
    const { id, sale, project, customer, deadline, paymentTerm, interestInArrears, status, referenceNumber, tax, description, user, createdAt, openConfirmationModal } = this.state
    
    const { getAccountQuery: { getAccount } } = this.props

    return [
      <div key="segment" className="column row">
        <div className="twelve wide column invoice show">
          <div className="ui segment">
            <div className="ui vertically divided grid">
              <div className="row pb-0">
                <div className="seven wide column">
                  <h1 className={classnames("ui header uppercase", {blue: status === 'new', orange: status === 'pending', red: status === 'overdue', green: status === 'paid' })}>{T.translate("invoices.show.header")}
                    
                    {project && <Link to={`/projects/show/${project.id}`} className={classnames("sub header d-inline-block pl-1", {blue: status === 'new', orange: status === 'pending', red: status === 'overdue', green: status === 'paid' })}>({project.name})</Link>}

                    {sale && <Link to={`/sales/show/${sale.id}`} className={classnames("sub header d-inline-block pl-1", {blue: status === 'new', orange: status === 'pending', red: status === 'overdue', green: status === 'paid' })}>({sale.name})</Link>}

                  </h1> 
                </div>
                <div className="four wide right aligned column">
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
                </div>

                <div className="four wide right aligned column">
                  <div className="ui sizer vertical segment">
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
                  </div> 
                </div>
              </div>

              <div className={classnames("row pt-0", {blue: status === 'new', orange: status === 'pending', red: status === 'overdue', green: status === 'paid' })}>
                <div className="eight wide column">
                  <div className="ui sizer vertical segment">
                    <h3 className="body-color">{T.translate("invoices.show.customer.billed_to")}</h3>
                    <p>
                      {T.translate("invoices.show.customer.name")}
                      <strong>{customer && <Link to={`/customers/show/${customer.id}`}>{customer.name}</Link>}</strong>
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
                      {T.translate("invoices.show.customer.address.postal_code")}
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
                  </div> 
                </div>

                <div className="eight wide column">
                  <div className="ui sizer vertical segment">
                    <p>
                      {T.translate("invoices.show.date_of_an_invoice")}
                      <strong>{moment(createdAt).format("YYYY-MM-DD")}</strong>
                    </p>
                    <p>
                      {T.translate("invoices.show.deadline")}
                      <strong>{deadline ? moment(deadline).format("YYYY-MM-DD") : '-'}</strong>
                    </p>
                    <p>
                      {T.translate("invoices.show.payment_term")}
                      <strong>{paymentTerm ? paymentTerm : '-'}</strong>
                    </p>
                    <p>
                      {T.translate("invoices.show.interest_in_arrears")}
                      <strong>{interestInArrears ? interestInArrears : ''}</strong>
                    </p>
                    <p>
                      {T.translate("invoices.show.reference_number")}
                      <strong>{referenceNumber}</strong>
                    </p>
                    <p>
                      {T.translate("invoices.show.description")}
                      <strong>{description ? description : '-'}</strong>
                    </p>
                  </div> 
                </div>
              </div>
            </div>

            <div className={classnames("ui uppercase huge right corner label", {blue: status === 'new', orange: status === 'pending', red: status === 'overdue', green: status === 'paid' })}> 
              <p>{status}</p>
            </div>

            { sale && <Sale sale={sale} status={status} tax={tax} /> }

            { project && <Project project={project} status={status} tax={tax} /> }

            <div className="pt-3">
              <button className="ui negative button" onClick={this.toggleConfirmationModal}><i className="trash icon"></i>{T.translate("invoices.show.delete")}</button>
              <Link to={`/invoices/edit/${id}`} className="ui primary button"><i className="edit icon"></i>{T.translate("invoices.show.edit")}</Link>
            </div>
          </div>
        </div>
      </div>,

      <Modal 
        key="modal" 
        className="ui small modal invoice"
        open={openConfirmationModal}>
        <Modal.Header>{T.translate("invoices.show.confirmation_header")}</Modal.Header>
        <Modal.Content>
         <p className="red">{T.translate("invoices.show.confirmation_msg")}</p>
        </Modal.Content>
        <Modal.Actions>
          <button className="ui button" onClick={this.toggleConfirmationModal}>{T.translate("invoices.show.cancel")}</button>
          <button className="ui negative button" onClick={this.handleDelete.bind(this, id)}>{T.translate("invoices.show.delete")}</button>
        </Modal.Actions>
      </Modal>
    ]
  }
}

Page.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
}

Page.contextTypes = {
  router: PropTypes.object.isRequired
}

const MutationQuery =  compose(
  graphql(DELETE_INVOICE_MUTATION, {
    name : 'deleteInvoiceMutation'
  }),
  graphql(GET_INVOICE_QUERY, {
    options: (props) => ({
      variables: {
        id: parseInt(props.match.params.id)
      }
    })
  }),
  graphql(GET_ACCOUNT_QUERY, {
    name : 'getAccountQuery', 
    options: () => ({
      variables: {
        subdomain: Authorization.getSubdomain()
      }
    })
  })
)(Page)

export default connect(null, { addFlashMessage } ) (MutationQuery)

