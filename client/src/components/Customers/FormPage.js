import React, { Component } from 'react' 
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { createCustomer, fetchCustomer, updateCustomer } from '../../actions/customerActions'
import Form from './Form'

class FormPage  extends Component {
  
  state = {
    redirect: false
  }

  componentDidMount = () => {
    const { match } = this.props
    if (match.params._id) {
      this.props.fetchCustomer(match.params._id)
    } else {}
  }

  saveCustomer = ({ _id, name, customer, deadline, status, description }) => {
    if (_id) {
      return this.props.updateCustomer({ _id, name, customer, deadline, status, description }).then(
        () => { this.setState({ redirect: true }) } )   
    } else {        
      return this.props.createCustomer({ _id, name, customer, deadline, status, description }).then(
        () => { this.setState({ redirect: true }) } )   
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
  if (match.params._id) {
    return {
      customer: state.customers.find(item => item._id === match.params._id)
    }
  } 
  return { customer: null }
}

export default connect(mapStateToProps, { createCustomer, fetchCustomer, updateCustomer })(FormPage)


