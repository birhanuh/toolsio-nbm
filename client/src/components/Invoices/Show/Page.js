import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { addFlashMessage } from '../../../actions/flashMessageActions'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import Breadcrumb from '../../Layouts/Breadcrumb'

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
      description: this.props.data.getInvoice ? this.props.data.getInvoice.description : ''
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
        description: nextProps.data.getInvoice.description
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
    
    this.props.deleteInvoiceMutation({ 
      variables: { id },
      update: (proxy, { data: { deleteInvoice } }) => {
        const { success } = deleteInvoice

        if (!success) {
          return
        }
        // Read the data from our cache for this query.
        const data = proxy.readQuery({ query: getInvoicesQuery })
        // Add our comment from the mutation to the end.
        data.getInvoices.filter(invoice => invoice.id !== id) 
        // Write our data back to the cache.
        proxy.writeQuery({ query: getInvoicesQuery, data })
      }})
      .then(res => {          

        const { success, project, errors } = res.data.deleteInvoice

        if (success) {
          this.props.addFlashMessage({
            type: 'success',
            text: T.translate("invoices.show.flash.success_delete")
          })  

          this.context.router.history.push('/projects')
        } else {
          let errorsList = {}
          errors.map(error => errorsList[error.path] = error.message)

          this.setState({ errors: errorsList, isLoading: false })
        }
      })
      .catch(err => {
        this.props.addFlashMessage({
          type: 'error',
          text: T.translate("invoices.show.flash.error_delete")
        })  
      })

    this.props.deleteInvoiceMutation({ variables: {id} })
      .then(() => {
        // this.props.addFlashMessage({
        //   type: 'success',
        //   text: T.translate("invoices.show.flash.success_delete", { name: name})
        // })  
        this.context.router.history.push('/invoices')
      })
      .catch(err => {
        // this.props.addFlashMessage({
        //   type: 'error',
        //   text: T.translate("invoices.show.flash.error_delete")
        // })  
        console.log('error ', err)
      })
    
  }

  render() {
    const { id, sale, project, customer, deadline, paymentTerm, interestInArrears, status, referenceNumber, description, createdAt } = this.state

    const customerContact = (      
      <div>
        <dt>{T.translate("invoices.show.customer.contact.phone_number")}</dt>
        <dd>{customer ? customer.phoneNumber : '-'}</dd>
        <dt>{T.translate("invoices.show.customer.contact.email")}</dt>
        <dd>{customer ? customer.email : '-'}</dd>
      </div>
    )

    return (
      <div className="ui stackable grid invoice show">

        <Breadcrumb />

        <div className="twelve wide column">
          <div className="ui segment">    
            <h1 className={classnames("ui header", {blue: status === 'new', orange: status === 'pending', red: status === 'overdue', green: status === 'paid' })}>{T.translate("invoices.show.header")}
              
              {project && <Link to={`/projects/show/${project.id}`} className={classnames("sub header inline-block-i pl-1", {blue: status === 'new', orange: status === 'pending', red: status === 'overdue', green: status === 'paid' })}>({project.name})</Link>}

              {sale && <Link to={`/sales/show/${sale.id}`} className={classnames("sub header inline-block-i pl-1", {blue: status === 'new', orange: status === 'pending', red: status === 'overdue', green: status === 'paid' })}>({sale.name})</Link>}

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
                <dt>{T.translate("account.page.first_name")}</dt>
               {/* <dd>{this.props.account.firstName}</dd> 
                <dt>{T.translate("account.page.last_name")}</dt>
                <dd>{this.props.account.lastName}</dd> 
                <dt>{T.translate("account.page.email")}</dt>
                <dd>{this.props.account.email}</dd> */}
              </dl>  
              </div>
            </div>

            <button className="ui negative button" onClick={this.showConfirmationModal.bind(this)}><i className="trash icon"></i>{T.translate("invoices.show.delete")}</button>
            <Link to={`/invoices/edit/${id}`} className="ui primary button"><i className="edit icon"></i>{T.translate("invoices.show.edit")}</Link>
          </div>    
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
    )
  }
}

Page.propTypes = {
  //addFlashMessage: PropTypes.func.isRequired
}

Page.contextTypes = {
  router: PropTypes.object.isRequired
}

const deleteInvoiceMutation = gql`
  mutation deleteInvoice($id: Int!) {
    deleteInvoice(id: $id) {
      success
      errors {
        path
        message
      }
    }
  }
`

const getInvoiceQuery = gql`
  query getInvoice($id: Int!) {
    getInvoice(id: $id) {
      id
      deadline
      paymentTerm
      interestInArrears
      referenceNumber
      status
      createdAt
      project {
        id
        name
        deadline
        progress
        status
      }
      sale {
        id
        name
        deadline
        status
      }
      customer {
        id
        name
        vatNumber
        phoneNumber
        email
        isContactIncludedInInvoice
        street
        postalCode
        region
        country
      }
    }
  }
`

const MutationsAndQuery =  compose(
  graphql(deleteInvoiceMutation, {
    name : 'deleteInvoiceMutation'
  }),
  graphql(getInvoiceQuery, {
    options: (props) => ({
      variables: {
        id: parseInt(props.match.params.id)
      },
    })
  })
)(Page)

export default MutationsAndQuery

