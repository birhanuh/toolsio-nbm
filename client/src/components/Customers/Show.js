import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import map from 'lodash/map'
import classnames from 'classnames'
import { addFlashMessage } from '../../actions/flashMessageActions'
// Semantic UI JS
import { Modal } from 'semantic-ui-react'
import { graphql, compose } from 'react-apollo'
import { GET_CUSTOMERS_QUERY, GET_CUSTOMER_QUERY, DELETE_CUSTOMER_MUTATION } from '../../graphql/customers'

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
      user: this.props.data.getCustomer ? this.props.data.getCustomer.user : null,
      openConfirmationModal: false 
    }
  }

  componentDidMount = () => {
    // Fetch Project when id is present in params
    const { match } = this.props

    // Check if param id is an int
    const customerId = parseInt(match.params.id, 10)
    
    if (!customerId) {
      return <Redirect to="/customers" />
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
        user: nextProps.data.getCustomer.user,
      })
    }
  }

  toggleConfirmationModal = () => {    
    this.setState(state => ({ openConfirmationModal: !state.openConfirmationModal }))
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
        const data = proxy.readQuery({ query: GET_CUSTOMERS_QUERY,
          variables: {
            order: 'DESC',
            offset: 0,
            limit: 10
          } 
        })
        // Add our comment from the mutation to the end.
        
        let updatedData = data.getCustomers.filter(customer => customer.id !== id) 
        data.getInvoices = updatedData

        // Write our data back to the cache.
        proxy.writeQuery({ query: GET_CUSTOMERS_QUERY, data })
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
      .catch(() => {
        this.props.addFlashMessage({
          type: 'error',
          text: T.translate("customers.show.flash.error_delete", { name: name})
        })  
      })
    
  }

  render() {
    const { id, name, vatNumber, contact, isContactIncludedInInvoice, address, projects, sales, invoices, user, openConfirmationModal } = this.state
    
    const emptyProjectsMessage = (
      <div className="ui mini info message">
        <div className="ui header">
          {T.translate("projects.page.empty_projects_header")}
        </div>
      </div>
    )

    const projectsList = map(projects, (project) =>      
      <div key={project.id} className="card">
        <div className="content">
          <div className={classnames("ui right floated uppercase tiny label", {blue: project.status === 'new', orange: project.status === 'in progress', green: project.status === 'finished', turquoise: project.status === 'delivered', red: project.status === 'delayed'})}> 
            {project.status}
          </div>
          <div className="header">
            <Link to={`/projects/show/${project.id}`} className={classnames({blue: project.status === 'new', orange: project.status === 'in progress', green: project.status === 'finished', turquoise: project.status === 'delivered', red: project.status === 'delayed'})}>
              {project.name}
            </Link>
          </div>
          <div className="meta">
            {project.deadline}
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
      <div key={sale.id} className="card">
        <div className="content">
          <div className={classnames("ui right floated uppercase tiny label", {blue: sale.status === 'new', orange: sale.status === 'in progress', green: sale.status === 'ready', turquoise: sale.status === 'delivered', red: sale.status === 'delayed'})}> 
            {sale.status}
          </div>
          <div className="header">  
            <Link to={`/sales/show/${sale.id}`} className={classnames({blue: sale.status === 'new', orange: sale.status === 'in progress', green: sale.status === 'ready', turquoise: sale.status === 'delivered', red: sale.status === 'delayed'})}>
              {sale.name}
            </Link>
          </div>
          <div className="meta">
            {sale.deadline}
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
      <div key={invoice.id} className="card">
        <div className="content">
          <div className={classnames("ui right floated uppercase tiny label", {blue: invoice.status === 'new', orange: invoice.status === 'pending', red: invoice.status === 'overdue', green: invoice.status === 'paid' })}>
            {invoice.status}
          </div>
          <div className="header">
            <Link to={`/invoices/show/${invoice.id}`} className={classnames({blue: invoice.status === 'new', orange: invoice.status === 'pending', red: invoice.status === 'overdue', green: invoice.status === 'paid' })}>
              {invoice.referenceNumber}
            </Link>
          </div>
          <div className="meta">
            {invoice.deadline || invoice.paymentTerm}
          </div>
        </div>
      </div>
    )

    return [
      <div key="segment" className="column row">
        <div className="twelve wide column customer show">
          <div className="ui segment">    
            <h1 className="ui dividing header">{name}</h1> 
            <div className="ui three column stackable grid">
              <div className="six wide column">
                <div className="ui sizer vertical segment">
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
                    {isContactIncludedInInvoice ? <i className="check circle icon green"></i> :
                      <i className="minus circle icon red"></i>
                    }
                  </p>
                </div> 
              </div>
              <div className="four wide column">
                <div className="ui sizer vertical segment">
                  <h3 className="ui header">{T.translate("customers.show.contact.header")}</h3>
                  <p>
                    {T.translate("customers.show.contact.phone_number")}
                    <strong>{contact.phoneNumber ? contact.phoneNumber : '-'}</strong>
                  </p>
                  <p>
                    {T.translate("customers.show.contact.email")}
                    <strong>{contact.email ? contact.email : '-'}</strong>
                  </p>
                </div> 
              </div>

              <div className="six wide column">
                <div className="ui sizer vertical segment">
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
                </div> 
              </div>
            </div>
            
            <div className="ui divider"></div>

            <h4 className="ui top attached block header">{T.translate("projects.page.header")}</h4>
            <div className="ui bottom attached segment">
              <div  className="ui three cards">
                { projects && (projects.length === 0 ? emptyProjectsMessage : projectsList) }
              </div>
            </div>
            
            <h4 className="ui top attached block header">{T.translate("sales.page.header")}</h4>
            <div className="ui bottom attached segment">
              <div  className="ui three cards">
                { sales && sales.length === 0 ? emptySalesMessage : salesList }
              </div>
            </div>
            
            <h4 className="ui top attached block header">{T.translate("invoices.page.header")}</h4>
            <div className="ui bottom attached segment">
              <div  className="ui three cards">
                { invoices && invoices.length === 0 ? emptyInvoicesMessage : invoicesList }
              </div>
            </div>

            <div className="pt-3">
              <button className="ui negative button" onClick={this.toggleConfirmationModal}><i className="trash icon"></i>{T.translate("customers.show.delete")}</button>
              <Link to={`/customers/edit/${id}`} className="ui primary button"><i className="edit icon"></i>{T.translate("customers.show.edit")}</Link>
            </div>
          </div>    
        </div>
      </div>,
      
      <Modal 
        key="modal" 
        className="ui small modal customer"
        open={openConfirmationModal}>
        <Modal.Header>{T.translate("customers.show.confirmation_header")}</Modal.Header>
        <Modal.Content>
         <p className="red">{T.translate("customers.show.confirmation_msg")}</p>
        </Modal.Content>
        <Modal.Actions>
          <button className="ui button" onClick={this.toggleConfirmationModal}>{T.translate("customers.show.cancel")}</button>
          <button className="ui negative button" onClick={this.handleDelete.bind(this, id)}>{T.translate("customers.show.delete")}</button>
        </Modal.Actions>
      </Modal>
    ]
  }
}

Show.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
}

Show.contextTypes = {
  router: PropTypes.object.isRequired
}

const MutationQuery =  compose(
  graphql(DELETE_CUSTOMER_MUTATION, {
    name : 'deleteCustomerMutation'
  }),
  graphql(GET_CUSTOMERS_QUERY, {
    options: () => ({
      variables: {
        order: 'DESC',
        offset: 0,
        limit: 10
      }
    })
  }),
  graphql(GET_CUSTOMER_QUERY, {
    options: (props) => ({
      variables: {
        id: parseInt(props.match.params.id)
      },
    })
  })
)(Show)

export default connect(null, { addFlashMessage } ) (MutationQuery)
