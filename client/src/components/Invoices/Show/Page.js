import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { addFlashMessage } from '../../../actions/flashMessageActions'
import { graphql, compose } from 'react-apollo'
import { GET_INVOICES_QUERY, GET_INVOICE_QUERY, DELETE_INVOICE_MUTATION } from '../../../graphql/invoices'

// Localization 
import T from 'i18n-react'

import $ from 'jquery'

import Sale from './Sale'
import Project from './Project'

import moment from 'moment'

// Modal
$.fn.modal = require('semantic-ui-modal')
$.fn.dimmer = require('semantic-ui-dimmer')

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
      description: this.props.data.getInvoice ? this.props.data.getInvoice.description : '',
      user: this.props.data.getInvoice ? this.props.data.getInvoice.user : null,
      total: this.props.data.getInvoice ? this.props.data.getInvoice.total : 0
    }
  }

  componentDidMount = () => {
    // Fetch Invoice when id is present in params
    const { match } = this.props
    if (match.params.id) {
      //this.props.fetchInvoice(match.params.id)
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
        description: nextProps.data.getInvoice.description,
        user: nextProps.data.getInvoice.user,
        total: nextProps.data.getInvoice.total
      })
    }
  }

  showConfirmationModal(event) {
    event.preventDefault()

    // Show modal
    $('.small.modal.invoice').modal('show')
  }

  hideConfirmationModal(event) {
    event.preventDefault()

    // Show modal
    $('.small.modal.invoice').modal('hide')
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
    const { id, sale, project, customer, deadline, paymentTerm, interestInArrears, status, referenceNumber, description, user, createdAt } = this.state
  
    const customerContact = (      
      <div>
        <dt>{T.translate("invoices.show.customer.contact.phone_number")}</dt>
        <dd>{customer ? customer.phoneNumber : '-'}</dd>
        <dt>{T.translate("invoices.show.customer.contact.email")}</dt>
        <dd>{customer ? customer.email : '-'}</dd>
      </div>
    )

    return (
      <div className="column row">
        <div className="twelve wide column invoice show">
          <div className="ui segment">

            <h1 className={classnames("ui header", {blue: status === 'new', orange: status === 'pending', red: status === 'overdue', green: status === 'paid' })}>{T.translate("invoices.show.header")}
              
              {project && <Link to={`/projects/show/${project.id}`} className={classnames("sub header d-inline-block pl-1", {blue: status === 'new', orange: status === 'pending', red: status === 'overdue', green: status === 'paid' })}>({project.name})</Link>}

              {sale && <Link to={`/sales/show/${sale.id}`} className={classnames("sub header d-inline-block pl-1", {blue: status === 'new', orange: status === 'pending', red: status === 'overdue', green: status === 'paid' })}>({sale.name})</Link>}

            </h1> 
            <div className={classnames("ui uppercase huge right corner label", {blue: status === 'new', orange: status === 'pending', red: status === 'overdue', green: status === 'paid' })}> 
              <p>{status}</p>
            </div>

            <div className="ui clearing vertical segment border-bottom-none">
              <div className="ui left floated vertical segment p-0 m-0">
                <dl className="dl-horizontal">      
                  <dt>{T.translate("invoices.show.date_of_an_invoice")}</dt>
                  <dd>{moment(createdAt).format("YYYY-MM-DD")}</dd>
                  <dt>{T.translate("invoices.show.deadline")}</dt>
                  <dd>{deadline ? moment(deadline).format("YYYY-MM-DD") : '-'}</dd>
                  <dt>{T.translate("invoices.show.payment_term")}</dt>
                  <dd>{paymentTerm ? paymentTerm : '-'}</dd>
                  <dt>{T.translate("invoices.show.interest_in_arrears")}</dt>
                  <dd>{interestInArrears ? interestInArrears : ''}</dd>
                  <dt>{T.translate("invoices.show.reference_number")}</dt>
                  <dd>{referenceNumber}</dd>
                  <dt>{T.translate("invoices.show.description")}</dt>
                  <dd>{description ? description : '-'}</dd>
                </dl>  
              </div>
              <div className="ui right floated vertical segment p-0 m-0">
                <dl className="dl-horizontal">
                  <dt>{T.translate("invoices.show.customer.name")}</dt>
                  <dd>{customer && <Link to={`/customers/show/${customer.id}`}>{customer.name}</Link>}</dd>          
                  <dt>{T.translate("invoices.show.customer.vat_number")}</dt>
                  <dd>{customer && customer.vatNumber}</dd>
                  
                  { customer && customer.includeContactOnInvoice && customerContact }

                  <dt>{T.translate("invoices.show.customer.address.street")}</dt>
                  <dd>{customer && customer.street}</dd>
                  <dt>{T.translate("invoices.show.customer.address.postal_code")}</dt>
                  <dd>{customer && customer.postalCode}</dd>
                  <dt>{T.translate("invoices.show.customer.address.region")}</dt>
                  <dd>{customer && customer.region}</dd>
                  <dt>{T.translate("invoices.show.customer.address.country")}</dt>
                  <dd>{customer && customer.country}</dd>
                </dl>  
              </div>
            </div>

            { sale && <Sale sale={sale} /> }

            { project && <Project project={project} /> }
            
            <div className="ui divider"></div>

            <div className="ui clearing vertical segment border-bottom-none pt-0">
              <div className="ui right floated vertical segment p-0 m-0">
                <dl className="dl-horizontal">                
                <dt>{T.translate("settings.user.first_name")}</dt>
                <dd>{user && user.firstName}</dd> 
                <dt>{T.translate("settings.user.email")}</dt>
                <dd>{user && user.email}</dd> 
              </dl>  
              </div>
            </div>

            <button className="ui negative button" onClick={this.showConfirmationModal.bind(this)}><i className="trash icon"></i>{T.translate("invoices.show.delete")}</button>
            <Link to={`/invoices/edit/${id}`} className="ui primary button"><i className="edit icon"></i>{T.translate("invoices.show.edit")}</Link>
          </div>

          <div className="ui small modal invoice">
            <div className="header">Confirmation</div>
            <div className="content">
              <p className="red">{T.translate("invoices.show.confirmation_msg")}</p>
            </div>
            <div className="actions">
              <button className="ui button" onClick={this.hideConfirmationModal.bind(this)}>{T.translate("invoices.show.cancel")}</button>
              <button className="ui negative button" onClick={this.handleDelete.bind(this, id)}>{T.translate("invoices.show.delete")}</button>
            </div>
          </div>    
        </div>
      </div>
    )
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
  })
)(Page)

export default connect(null, { addFlashMessage } ) (MutationQuery)

