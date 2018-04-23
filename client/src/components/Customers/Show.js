import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import map from 'lodash/map'
import classnames from 'classnames'
import { addFlashMessage } from '../../actions/flashMessageActions'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

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
      id: this.props.data.getCustomer ? this.props.data.getCustomer.id : null,
      name: this.props.data.getCustomer ? this.props.data.getCustomer.name : '',
      address: {
        street: this.props.data.getCustomer ? this.props.data.getCustomer.street: '',
        postalCode: this.props.data.getCustomer ? this.props.data.getCustomer.postalCode : '',
        region: this.props.data.getCustomer ? this.props.data.getCustomer.region : '',
        country: this.props.data.getCustomer ? this.props.data.getCustomer.country : ''
      },
      vatNumber: this.props.data.getCustomer ? this.props.data.getCustomer.vatNumber : '',
      isContactIncludedInInvoice: this.props.data.getCustomer ? this.props.data.getCustomer.isContactIncludedInInvoice : false,
      contact: {
        phoneNumber: this.props.data.getCustomer ? this.props.data.getCustomer.phoneNumber : '',
        email: this.props.data.getCustomer ? this.props.data.getCustomer.email : ''
      },
      sales: this.props.data.getCustomer ? this.props.data.getCustomer.sales : null,
      projects: this.props.data.getCustomer ? this.props.data.getCustomer.projects : null,
      invoices: this.props.data.getCustomer ? this.props.data.getCustomer.invoices : null,
    }
  }

  componentDidMount = () => {
    // Fetch Customer when id is present in params
    const { match } = this.props
    if (match.params.id) {
      //this.props.fetchCustomer(match.params.id)
    } 
  }

  componentWillReceiveProps = (nextProps) => {
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
        isContactIncludedInInvoice: nextProps.data.getCustomer.isContactIncludedInInvoice,
        contact: {
          phoneNumber: nextProps.data.getCustomer.phoneNumber,
          email: nextProps.data.getCustomer.email
        },
        sales: nextProps.data.getCustomer.sales,
        projects: nextProps.data.getCustomer.projects,
        invoices: nextProps.data.getCustomer.invoices,
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
    
    const { name } = this.state
    
    this.props.deleteCustomerMutation({ 
      variables: { id },
      update: (proxy, { data: { deleteCustomer } }) => {
        const { success } = deleteCustomer

        if (!success) {
          return
        }
        // Read the data from our cache for this query.
        const data = proxy.readQuery({ query: getCustomersQuery })
        // Add our comment from the mutation to the end.
        
        let updatedData = data.getCustomers.filter(customer => customer.id !== id) 
        data.getInvoices = updatedData

        // Write our data back to the cache.
        proxy.writeQuery({ query: getCustomersQuery, data })
      }})
      .then(res => {          

        const { success, errors } = res.data.deleteCustomer

        if (success) {
          this.props.addFlashMessage({
            type: 'success',
            text: T.translate("customers.show.flash.success_delete", { name: name})
          })  

          this.context.router.history.push('/customers')
        } else {
          let errorsList = {}
          errors.map(error => errorsList[error.path] = error.message)

          this.setState({ errors: errorsList, isLoading: false })
        }
      })
      .catch(err => {
        this.props.addFlashMessage({
          type: 'error',
          text: T.translate("customers.show.flash.error_delete", { name: name})
        })  
      })
    
  }

  render() {
    const { id, name, vatNumber, contact, isContactIncludedInInvoice, address, projects, sales, invoices } = this.state
    
    const emptyProjectsMessage = (
      <div className="ui mini info message">
        <div className="ui header">
          {T.translate("projects.page.empty_projects_header")}
        </div>
      </div>
    )

    const projectsList = map(projects, (project) => 
      <div key={project.id} className="ui segment">
        <div className="ui three column grid">
          <div className="eight wide column">
            <Link to={`/projects/show/${project.id}`} className="ui header">
              <h3 className={classnames({blue: project.status === 'new', orange: project.status === 'in progress', green: project.status === 'finished', turquoise: project.status === 'delivered', red: project.status === 'delayed'})}>
                {project.name}
              </h3>
            </Link>
          </div>

          <div className="four wide column">
            <div className={classnames("ui uppercase tiny right label", {blue: project.status === 'new', orange: project.status === 'in progress', green: project.status === 'finished', turquoise: project.status === 'delivered', red: project.status === 'delayed'})}> 
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
      <div key={sale.id} className="ui segment">
        <div className="ui three column grid">
          <div className="eight wide column">
            <Link to={`/sales/show/${sale.id}`} className="ui header">
              <h3 className={classnames({blue: sale.status === 'new', orange: sale.status === 'in progress', green: sale.status === 'ready', turquoise: sale.status === 'delivered', red: sale.status === 'delayed'})}>
                {sale.name}
              </h3>
            </Link>
          </div>

          <div className="four wide column">
            <div className={classnames("ui uppercase tiny right label", {blue: sale.status === 'new', orange: sale.status === 'in progress', green: sale.status === 'ready', turquoise: sale.status === 'delivered', red: sale.status === 'delayed'})}> 
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
       <div key={invoice.id} className="ui segment">
        <div className="ui three column grid">
          <div className="eight wide column">
            <Link to={`/invoices/show/${invoice.id}`} className="ui header">
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
                {isContactIncludedInInvoice ? <i className="check circle icon green"></i> :
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
            <Link to={`/customers/edit/${id}`} className="ui primary button"><i className="edit icon"></i>{T.translate("customers.show.edit")}</Link>
          </div>    
        </div>

        <div className="ui small modal customer">
          <div className="header">Confirmation</div>
          <div className="content">
            <p className="red">{T.translate("customers.show.confirmation_msg")}</p>
          </div>
          <div className="actions">
            <button className="ui button" onClick={this.hideConfirmationModal.bind(this)}>{T.translate("customers.show.cancel")}</button>
            <button className="ui negative button" onClick={this.handleDelete.bind(this, id)}>{T.translate("customers.show.delete")}</button>
          </div>
        </div>
      </div>
    )
  }
}

Show.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
}

Show.contextTypes = {
  router: PropTypes.object.isRequired
}

const deleteCustomerMutation = gql`
  mutation deleteCustomer($id: Int!) {
    deleteCustomer(id: $id) {
      success
      errors {
        path
        message
      }
    }
  }
`

const getCustomerQuery = gql`
  query getCustomer($id: Int!) {
    getCustomer(id: $id) {
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
      projects {
        id
        name
        deadline
        progress
        status
      }
      sales {
        id
        name
        deadline
        status
      }
      invoices {
        id
        deadline
        paymentTerm
        interestInArrears
        referenceNumber
        status
      }
    }
  }
`

const getCustomersQuery = gql`
  query {
    getCustomers {
      id
      name
      vatNumber
      phoneNumber
      email
    }
  }
`

const MutationQuery =  compose(
  graphql(deleteCustomerMutation, {
    name : 'deleteCustomerMutation'
  }),
  graphql(getCustomersQuery),
  graphql(getCustomerQuery, {
    options: (props) => ({
      variables: {
        id: parseInt(props.match.params.id)
      },
    })
  })
)(Show)

export default connect(null, { addFlashMessage } ) (MutationQuery)
