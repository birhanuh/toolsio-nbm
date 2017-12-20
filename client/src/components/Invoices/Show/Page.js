import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { addFlashMessage } from '../../../actions/flashMessageActions'
import { fetchInvoice, deleteInvoice } from '../../../actions/invoiceActions'

// Localization 
import T from 'i18n-react'

import $ from 'jquery'

import Sale from './Sale'
import Project from './Project'

// Modal
$.fn.modal = require('semantic-ui-modal')
$.fn.dimmer = require('semantic-ui-dimmer')

class Page extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      _id: this.props.invoice ? this.props.invoice._id : null,
      sale: this.props.invoice ? this.props.invoice.sale : null,
      project: this.props.invoice ? this.props.invoice.project : null,
      customer: this.props.invoice ? this.props.invoice.customer : null,
      createdAt: this.props.invoice ? this.props.invoice.createdAt : '',
      deadline: this.props.invoice ? this.props.invoice.deadline : '',
      paymentTerm: this.props.invoice ? this.props.invoice.paymentTerm : '',
      interestInArrears: this.props.invoice ? this.props.invoice.interestInArrears : '',
      status: this.props.invoice ? this.props.invoice.status : '',
      referenceNumber: this.props.invoice ? this.props.invoice.referenceNumber : '',
      description: this.props.invoice ? this.props.invoice.description : ''
    }
  }

  componentDidMount = () => {
    // Fetch Invoice when id is present in params
    const { match } = this.props
    if (match.params.id) {
      this.props.fetchInvoice(match.params.id)
    } 
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.invoice) {
      this.setState({
        _id: nextProps.invoice._id,
        sale: nextProps.invoice.sale,
        project: nextProps.invoice.project,
        customer: nextProps.invoice.customer,
        createdAt: nextProps.invoice.createdAt,
        deadline: nextProps.invoice.deadline,
        paymentTerm: nextProps.invoice.paymentTerm,
        interestInArrears: nextProps.invoice.interestInArrears,
        status: nextProps.invoice.status,
        referenceNumber: nextProps.invoice.referenceNumber,
        description: nextProps.invoice.description
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
    
    let name = this.state.name

    this.props.deleteInvoice(id).then(
      () => {
        this.props.addFlashMessage({
          type: 'success',
          text: T.translate("invoices.show.flash.success_delete", { name: name})
        })  
        this.context.router.history.push('/invoices')
      },
      ({ response }) => {
      }
    ) 
    
  }

  render() {
    const { _id, sale, project, customer, deadline, paymentTerm, interestInArrears, status, referenceNumber, description, createdAt } = this.state

    const customerContact = (      
      <div>
        <dt>{T.translate("invoices.show.customer.contact.phone_number")}</dt>
        <dd>{customer && customer.contact && (customer.contact.phoneNumber ? customer.contact.phoneNumber : '-')}</dd>
        <dt>{T.translate("invoices.show.customer.contact.email")}</dt>
        <dd>{customer && customer.contact && (customer.contact.email ? customer.contact.email : '-')}</dd>
      </div>
    )

    return (
      <div className="ui stackable grid invoice show">
        <div className="twelve wide column">
          <div className="ui segment">    
            <h1 className="ui header">{T.translate("invoices.show.header")}
              <div className="sub header inline-block-i pl-1">{sale && sale.name || project && project.name}</div>
            </h1> 
            <div className={classnames("ui uppercase huge right corner label", {orange: status === 'pending', red: status === 'overdue', green: status === 'paid' })}> 
              <p>{status}</p>
            </div>

            <div className="ui clearing vertical segment border-bottom-none">
              <div className="ui left floated vertical segment p-0 m-0">
                <dl className="dl-horizontal">      
                  <dt>{T.translate("invoices.show.date_of_an_invoice")}</dt>
                  <dd>{createdAt}</dd>
                  <dt>{T.translate("invoices.show.deadline")}</dt>
                  <dd>{deadline ? deadline : '-'}</dd>
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
                  <dd>{customer && <Link to={`/customers/show/${customer._id}`}>{customer.name}</Link>}</dd>          
                  <dt>{T.translate("invoices.show.customer.vat_number")}</dt>
                  <dd>{customer && customer.vatNumber}</dd>
                  
                  { customer && customer.includeContactOnInvoice && customerContact }

                  <dt>{T.translate("invoices.show.customer.address.street")}</dt>
                  <dd>{customer && customer.address && customer.address.street}</dd>
                  <dt>{T.translate("invoices.show.customer.address.postal_code")}</dt>
                  <dd>{customer && customer.address && customer.address.postalCode}</dd>
                  <dt>{T.translate("invoices.show.customer.address.region")}</dt>
                  <dd>{customer && customer.address && customer.address.region}</dd>
                  <dt>{T.translate("invoices.show.customer.address.country")}</dt>
                  <dd>{customer && customer.address && customer.address.country}</dd>
                </dl>  
              </div>
            </div>

            { sale && <Sale sale={sale} /> }

            { project && <Project project={project} /> }
            
            <div className="ui divider"></div>

            <div className="ui clearing vertical segment border-bottom-none pt-0">
              <div className="ui right floated vertical segment p-0 m-0">
                <dl className="dl-horizontal">                
                <dt>{T.translate("account.user.first_name")}</dt>
                <dd>{this.props.account.firstName}</dd> 
                <dt>{T.translate("account.user.last_name")}</dt>
                <dd>{this.props.account.lastName}</dd> 
                <dt>{T.translate("account.user.email")}</dt>
                <dd>{this.props.account.email}</dd> 
              </dl>  
              </div>
            </div>

            <button className="ui negative button" onClick={this.showConfirmationModal.bind(this)}><i className="delete icon"></i>{T.translate("invoices.show.delete")}</button>
            <Link to={`/invoices/edit/${_id}`} className="ui primary button"><i className="edit icon"></i>{T.translate("invoices.show.edit")}</Link>
          </div>    
        </div>

        <div className="ui small modal invoice">
          <div className="header">Confirmation</div>
          <div className="content">
            <p className="red">{T.translate("invoices.show.confirmation_msg")}</p>
          </div>
          <div className="actions">
            <button className="ui button" onClick={this.hideConfirmationModal.bind(this)}>{T.translate("invoices.show.cancel")}</button>
            <button className="ui negative button" onClick={this.handleDelete.bind(this, _id)}>{T.translate("invoices.show.delete")}</button>
          </div>
        </div>
      </div>
    )
  }
}

Page.propTypes = {
  fetchInvoice: PropTypes.func.isRequired,
  deleteInvoice: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired
}

Page.contextTypes = {
  router: PropTypes.object.isRequired
}

function mapStateToProps(state, props) {
  const { match } = props
  if (match.params.id) {
    return {
      invoice: state.invoices.find(item => item._id === match.params.id),
      account: state.authentication.account
    }
  } 
}

export default connect(mapStateToProps, { fetchInvoice, deleteInvoice, addFlashMessage } )(Page)
