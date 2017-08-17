import React, { Component } from 'react' 
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

  saveCustomer = ({ _id, name, vatNumber, contact, includeContactOnInvoice, address }) => {
    if (_id) {
      return this.props.updateCustomer({ _id, name, vatNumber, contact, includeContactOnInvoice, address })
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
      return this.props.createCustomer({ _id, name, vatNumber, contact, includeContactOnInvoice, address })
        .then(() => 
          { 
            this.setState({ redirect: true }) 

            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("customers.form.flash.success_update", { name: name})
            })  
            this.context.router.history.push('/customers')
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
  createCustomer: React.PropTypes.func.isRequired,
  fetchCustomer: React.PropTypes.func.isRequired,
  updateCustomer: React.PropTypes.func.isRequired
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
  router: React.PropTypes.object.isRequired
}

export default connect(mapStateToProps, { createCustomer, fetchCustomer, updateCustomer })(FormPage)


