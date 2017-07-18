import React, { Component } from 'react' 
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { createSale, fetchSale, updateSale } from '../../actions/saleActions'
import Form from './Form'

class FormPage  extends Component {
  
  state = {
    redirect: false
  }

  componentDidMount = () => {
    const { match } = this.props
    if (match.params._id) {
      this.props.fetchSale(match.params._id)
    } else {}
  }

  saveSale = ({ _id, name, customer, deadline, status, description }) => {
    if (_id) {
      return this.props.updateSale({ _id, name, customer, deadline, status, description }).then(
        () => { this.setState({ redirect: true }) } )   
    } else {        
      return this.props.createSale({ _id, name, customer, deadline, status, description }).then(
        () => { this.setState({ redirect: true }) } )   
    }
  }

  render() {
   return (
      <div>
        {
          this.state.redirect ? 
          <Redirect to="/sales" /> : 
          <Form sale={this.props.sale} saveSale={this.saveSale} />
        }
      </div>
    )
  }
}

FormPage.propTypes = {
  createSale: React.PropTypes.func.isRequired,
  fetchSale: React.PropTypes.func.isRequired,
  updateSale: React.PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  const { match } = props
  if (match.params._id) {
    return {
      sale: state.sales.find(item => item._id === match.params._id)
    }
  } 
  return { sale: null }
}

export default connect(mapStateToProps, { createSale, fetchSale, updateSale })(FormPage)


