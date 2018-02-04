import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import map from 'lodash/map'
import classnames from 'classnames'
import { addFlashMessage } from '../../actions/flashMessageActions'
import { fetchCustomer, deleteCustomer } from '../../actions/customerActions'

import Breadcrumb from '../Layouts/Breadcrumb'

// Localization 
import T from 'i18n-react'

import $ from 'jquery'

// Modal
$.fn.modal = require('semantic-ui-modal')
$.fn.dimmer = require('semantic-ui-dimmer')

class Show extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      _id: this.props.customer ? this.props.customer._id : null,
      name: this.props.customer ? this.props.customer.name : '',
      address: {
        street: this.props.customer ? this.props.customer.address.street: '',
        postalCode: this.props.customer ? this.props.customer.address.postalCode : '',
        region: this.props.customer ? this.props.customer.address.region : '',
        country: this.props.customer ? this.props.customer.address.country : ''
      },
      vatNumber: this.props.customer ? this.props.customer.vatNumber : '',
      includeContactOnInvoice: this.props.customer ? this.props.customer.includeContactOnInvoice : false,
      contact: {
        phoneNumber: this.props.customer ? this.props.customer.contact.phoneNumber : '',
        email: this.props.customer ? this.props.customer.contact.email : ''
      },
      sales: this.props.customer ? this.props.sales : null,
      projects: this.props.customer ? this.props.projects : null,
      invoices: this.props.customer ? this.props.invoices : null,
    }
  }

  componentDidMount = () => {
    // Fetch Customer when id is present in params
    const { match } = this.props
    if (match.params.id) {
      this.props.fetchCustomer(match.params.id)
    } 
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.customer) {
      this.setState({
        _id: nextProps.customer._id,
        name: nextProps.customer.name,
        address: {
          street: nextProps.customer.address.street,
          postalCode: nextProps.customer.address.postalCode,
          region: nextProps.customer.address.region,
          country: nextProps.customer.address.country
        },
        vatNumber: nextProps.customer.vatNumber,
        includeContactOnInvoice: nextProps.customer.includeContactOnInvoice,
        contact: {
          phoneNumber: nextProps.customer.contact.phoneNumber,
          email: nextProps.customer.contact.email
        },
        sales: nextProps.customer.sales,
        projects: nextProps.customer.projects,
        invoices: nextProps.customer.invoices,
      })
    }
  }

  showConfirmationModal(event) {
    event.preventDefault()

    // Show modal
    $('.small.modal.customer').modal('show')
  }

  hideConfirmationModal(event) {
    event.preventDefault()

    // Show modal
    $('.small.modal.customer').modal('hide')
  }

  handleDelete(id, event) {
    event.preventDefault()
    
    let name = this.state.name

    this.props.deleteCustomer(id).then(
      () => {
        this.props.addFlashMessage({
          type: 'success',
          text: T.translate("customers.show.flash.success_delete", { name: name})
        })  
        this.context.router.history.push('/customers')
      },
      ({ response }) => {
      }
    ) 
    
  }

  render() {
    const { _id, name, vatNumber, contact, includeContactOnInvoice, address, projects, sales, invoices } = this.state
    
    const emptyProjectsMessage = (
      <div className="ui mini info message">
        <div className="ui header">
          {T.translate("projects.page.empty_projects_header")}
        </div>
      </div>
    )
    console.log('project: ', projects)

    const projectsList = map(projects, (project) => 
      <div key={project._id} className="ui segment">
        <div className="ui three column grid">
          <div className="eight wide column">
            <Link to={`/projects/show/${project._id}`} className="ui header">
              <h3 className={classnames({blue: project.status === 'new', orange: project.status === 'in progress', green: project.status === 'finished' || project.status === 'delivered', red: project.status === 'delayed'})}>
                {project.name}
              </h3>
            </Link>
          </div>

          <div className="four wide column">
            <div className={classnames("ui uppercase tiny right label", {blue: project.status === 'new', orange: project.status === 'in progress', green: project.status === 'finished' || project.status === 'delivered', red: project.status === 'delayed'})}> 
              {project.status}
            </div>
          </div>
          
          <div className="four wide column">
            <span>{project.deadline}</span>
          </div>
        </div>
      </div>
    )
         
    const emptySalesMessage = (
      <div className="ui mini info message">
        <div className="ui header">
          {T.translate("sales.page.empty_sales_header")}
        </div>
      </div>
    )

    const salesList = map(sales, (sale) => 
      <div key={sale._id} className="ui segment">
        <div className="ui three column grid">
          <div className="eight wide column">
            <Link to={`/sales/show/${sale._id}`} className="ui header">
              <h3 className={classnames({blue: sale.status === 'new', orange: sale.status === 'in progress', green: sale.status === 'ready' || sale.status === 'delivered', red: sale.status === 'delayed'})}>
                {sale.name}
              </h3>
            </Link>
          </div>

          <div className="four wide column">
            <div className={classnames("ui uppercase tiny right label", {blue: sale.status === 'new', orange: sale.status === 'in progress', green: sale.status === 'ready' || sale.status === 'delivered', red: sale.status === 'delayed'})}> 
              {sale.status}
            </div>
          </div>
          
          <div className="four wide column">  
            <span>{sale.deadline}</span>
          </div>

        </div>
      </div>
    )
      
    const emptyInvoicesMessage = (
      <div className="ui mini info message">
        <div className="ui header">
          {T.translate("invoices.page.empty_invoices_header")}
        </div>
      </div>
    )

    const invoicesList = map(invoices, (invoice) => 
       <div key={invoice._id} className="ui segment">
        <div className="ui three column grid">
          <div className="eight wide column">
            <Link to={`/invoices/show/${invoice._id}`} className="ui header">
              <h3 className={classnames({blue: invoice.status === 'new', orange: invoice.status === 'pending', red: invoice.status === 'overdue', green: invoice.status === 'paid' })}>
                {invoice.referenceNumber}
              </h3>
            </Link>
          </div>

          <div className="four wide column">
            <div className={classnames("ui uppercase tiny label", {blue: invoice.status === 'new', orange: invoice.status === 'pending', red: invoice.status === 'overdue', green: invoice.status === 'paid' })}>
            {invoice.status}
            </div>
          </div>

          <div className="four wide column">
            <span>{invoice.deadline || invoice.paymentTerm}</span>
          </div>

        </div>
      </div>
    )

    return (
      <div className="ui stackable grid">

        <Breadcrumb />

        <div className="twelve wide column">
          <div className="ui segment">    
            <h1 className="ui header">{name}</h1> 
            <dl className="dl-horizontal">
              <dt>{T.translate("customers.show.vat_number")}</dt>
              <dd>{vatNumber}</dd>
              {/*<dt>{T.translate("customers.show.user")}</dt>
              <dd>{customer.user.first_name}</dd>*/}
              
              <h3 className="ui header">{T.translate("customers.show.contact.header")}</h3>
              <dt>{T.translate("customers.show.contact.phone_number")}</dt>
              <dd>{contact.phoneNumber ? contact.phoneNumber : '-'}</dd>
              <dt>{T.translate("customers.show.contact.email")}</dt>
              <dd>{contact.email ? contact.email : '-'}</dd>
              
              <dt>{T.translate("customers.show.include_contact_on_invoice")}</dt>
              <dd>
                {includeContactOnInvoice ? <i className="check circle icon green"></i> :
                  <i className="minus circle icon red"></i>
                }
              </dd>

              <h3 className="ui header">{T.translate("customers.show.address.header")}</h3>
              <dt>{T.translate("customers.show.address.street")}</dt>
              <dd>{address.street}</dd>
              <dt>{T.translate("customers.show.address.postal_code")}</dt>
              <dd>{address.postalCode}</dd>
              <dt>{T.translate("customers.show.address.region")}</dt>
              <dd>{address.region}</dd>
              <dt>{T.translate("customers.show.address.country")}</dt>
              <dd>{address.country}</dd>
            </dl>  

            <h3 className="ui header">{T.translate("projects.page.header")}</h3>
            { projects && (projects.length === 0 ? emptyProjectsMessage : projectsList) }
            
            <div className="ui divider"></div>

            <h3 className="ui header">{T.translate("sales.page.header")}</h3>
            { sales && sales.length === 0 ? emptySalesMessage : salesList }

            <div className="ui divider"></div>


            <h3 className="ui header">{T.translate("invoices.page.header")}</h3>
            { invoices && invoices.length === 0 ? emptyInvoicesMessage : invoicesList }

            <div className="ui divider"></div>

            <button className="ui negative button" onClick={this.showConfirmationModal.bind(this)}><i className="trash icon"></i>{T.translate("customers.show.delete")}</button>
            <Link to={`/customers/edit/${_id}`} className="ui primary button"><i className="edit icon"></i>{T.translate("customers.show.edit")}</Link>
          </div>    
        </div>

        <div className="ui small modal customer">
          <div className="header">Confirmation</div>
          <div className="content">
            <p className="red">{T.translate("customers.show.confirmation_msg")}</p>
          </div>
          <div className="actions">
            <button className="ui button" onClick={this.hideConfirmationModal.bind(this)}>{T.translate("customers.show.cancel")}</button>
            <button className="ui negative button" onClick={this.handleDelete.bind(this, _id)}>{T.translate("customers.show.delete")}</button>
          </div>
        </div>
      </div>
    )
  }
}

Show.propTypes = {
  fetchCustomer: PropTypes.func.isRequired,
  deleteCustomer: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired
}

Show.contextTypes = {
  router: PropTypes.object.isRequired
}

function mapStateToProps(state, props) {
  const { match } = props
  if (match.params.id) {
    return {
      customer: state.customers.find(item => item._id === match.params.id)
    }
  } 
}

export default connect(mapStateToProps, { fetchCustomer, deleteCustomer, addFlashMessage } )(Show)
