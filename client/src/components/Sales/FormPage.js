import React, { Component } from 'react'
import PropTypes from 'prop-types' 
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { createSale, fetchSale, updateSale } from '../../actions/saleActions'
import { fetchCustomers } from '../../actions/customerActions'
import Form from './Form'

// Localization 
import T from 'i18n-react'

class FormPage  extends Component {
  
  state = {
    redirect: false
  }

  componentDidMount = () => {
    // Fetch Project when id is present in params
    const { match } = this.props
    if (match.params.id) {
      this.props.fetchSale(match.params.id)
    } 

    // Fetch Customers
    this.props.fetchCustomers()
  }

  saveSale = ({ _id, name, customer, deadline, status, description }) => {
    if (_id) {
      return this.props.updateSale({ _id, name, customer, deadline, status, description })
        .then(() => 
          { 
            this.setState({ redirect: true }) 

            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("sales.form.flash.success_update", { name: name})
            })  
            this.context.router.history.push('/sales')
          })   
    } else {        
      return this.props.createSale({ _id, name, customer, deadline, status, description })
        .then(() => { 
          this.setState({ redirect: true }) 

            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("sales.form.flash.success_create", { name: name})
            })  
            this.context.router.history.push('/sales')

          })   
    }
  }

  render() {
   return (
      <div>
        {
          this.state.redirect ? 
          <Redirect to="/sales" /> : 
          <Form sale={this.props.sale} customers={this.props.customers} saveSale={this.saveSale} />
        }
      </div>
    )
  }
}

FormPage.propTypes = {
  createSale: PropTypes.func.isRequired,
  fetchSale: PropTypes.func.isRequired,
  updateSale: PropTypes.func.isRequired,
  fetchCustomers: PropTypes.func.isRequired,
  customers: PropTypes.array.isRequired,
  sale: PropTypes.object
}

function mapStateToProps(state, props) {
  const { match } = props
  if (match.params.id) {
    return {
      sale: state.sales.find(item => item._id === match.params.id),
      customers: state.customers
    }
  } 
  return { 
    sale: null,
    customers: state.customers
  }
}

FormPage.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(mapStateToProps, { createSale, fetchSale, updateSale, fetchCustomers })(FormPage)
