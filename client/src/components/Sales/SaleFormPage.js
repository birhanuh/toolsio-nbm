import React, { Component } from 'react' 
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { createSale, fetchSale, updateSale } from '../../actions/saleActions'
import SaleForm from './SaleForm'

class SaleFormPage  extends Component {
  
  state = {
    redirect: false
  }

  componentDidMount = () => {
    if (this.props.match.params._id) {
      this.props.fetchSale(this.props.match.params._id)
    } else {}
  }

  saveSale = ({ _id, name, date, status, description }) => {
    if (_id) {
      return this.props.updateSale({ _id, name, date, status, description }).then(
        () => { this.setState({ redirect: true }) } )   
    } else {        
      return this.props.createSale({ _id, name, date, status, description }).then(
        () => { this.setState({ redirect: true }) } )   
    }
  }

  render() {
   return (
      <div>
        {
          this.state.redirect ? 
          <Redirect to="/sales" /> : 
          <SaleForm sale={this.props.sale} saveSale={this.saveSale} />
        }
      </div>
    )
  }
}

SaleFormPage.propTypes = {
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

export default connect(mapStateToProps, { createSale, fetchSale, updateSale })(SaleFormPage)


