import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { addFlashMessage } from '../../actions/flashMessages'
import { fetchCustomer, deleteCustomer } from '../../actions/customerActions'

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
      }
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
        }
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
    const { _id, name, vatNumber, contact, includeContactOnInvoice, address } = this.state
    
    return (
      <div className="ui stackable grid">
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
              <dd>{contact.phoneNumber}</dd>
              <dt>{T.translate("customers.show.contact.email")}</dt>
              <dd>{contact.email}</dd>
              
              <h3 className="ui header">{T.translate("customers.show.include_contact_on_invoice")}</h3>
              <dt>{T.translate("customers.show.include_contact_on_invoice")}</dt>
              <dd>
                {includeContactOnInvoice ? <i className="check circle outline green"></i> :
                  <i className="check circle outline red"></i>
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
            <br/>
            <h3 className="ui header">{T.translate("projects.page.header")}</h3>
            <table className="ui very basic table projects">
              <thead>
                <tr>
                  <th>{T.translate("projects.show.name")}</th>
                  <th>{T.translate("projects.show.deadline")}</th>
                  <th>{T.translate("projects.show.status")}</th>
                  <th>{T.translate("projects.show.invoice")}</th>
                  <th>{T.translate("projects.show.tasks")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{}</td>
                  <td>{}</td>
                  <td>{}</td>
                  <td>{}</td>
                  <td>{}</td>
                </tr>
              </tbody>
            </table>
          
            <h3 className="ui header">{T.translate("sales.page.header")}</h3>
            <table className="ui very basic table sales">
              <thead>
                <tr>
                  <th>{T.translate("sales.show.name")}</th>
                  <th>{T.translate("sales.show.status")}</th>
                  <th>{T.translate("sales.show.invoice")}</th>
                  <th>{T.translate("sales.show.items")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{}</td>
                  <td>{}</td>
                  <td>{}</td>
                  <td>{}</td>
                </tr>
              </tbody>  
            </table>

            <div className="ui divider"></div>

            <button className="ui negative button" onClick={this.showConfirmationModal.bind(this)}><i className="delete icon"></i>{T.translate("customers.show.delete")}</button>
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
