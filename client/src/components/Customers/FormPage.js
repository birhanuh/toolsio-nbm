import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { createCustomer, fetchCustomer, updateCustomer } from '../../actions/customerActions'
import Form from './Form'

// Localization 
import T from 'i18n-react'

class FormPage  extends Component {
  
  state = {
    redirect: false
  }

  componentDidMount = () => {
    const { match } = this.props
    if (match.params.id) {
      this.props.fetchCustomer(match.params.id)
    } else {}
  }

  saveCustomer = ({ _id, name, vat_number, contact, is_contact_included_in_invoice, address }) => {
    if (_id) {
      return this.props.updateCustomer({ _id, name, vat_number, contact, is_contact_included_in_invoice, address })
        .then(() => 
          { 
            this.setState({ redirect: true }) 

            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("customers.form.flash.success_update", { name: name})
            })  
            this.context.router.history.push('/customers')
          })   
    } else {        
      return this.props.createCustomer({ _id, name, vat_number, contact, is_contact_included_in_invoice, address })
        .then(() => 
          { 
            this.setState({ redirect: true }) 

            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("customers.form.flash.success_create", { name: name})
            })  
            
            if (document.referrer.includes('projects/new')) {
              this.context.router.history.push('/projects/new')
            } else if (document.referrer.includes('sales/new')) {
              this.context.router.history.push('/sales/new')
            } else {
              this.context.router.history.push('/customers') 
            }
          })   
    }
  }

  render() {
   return (
      <div>
        {
          this.state.redirect ? 
          <Redirect to="/customers" /> : 
          <Form customer={this.props.customer} saveCustomer={this.saveCustomer} />
        }
      </div>
    )
  }
}

FormPage.propTypes = {
  createCustomer: PropTypes.func.isRequired,
  fetchCustomer: PropTypes.func.isRequired,
  updateCustomer: PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  const { match } = props
  if (match.params.id) {
    return {
      customer: state.customers.find(item => item._id === match.params.id)
    }
  } 
  return { customer: null }
}

FormPage.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(mapStateToProps, { createCustomer, fetchCustomer, updateCustomer })(FormPage)


