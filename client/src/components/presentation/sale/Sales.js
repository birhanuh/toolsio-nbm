import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import List from './List' 
import { connect } from 'react-redux'
import { fetchSales } from '../../../actions/saleActions'

class Sales extends Component {

  componentDidMount() {
    this.props.fetchSales()
  }

  render() {
    return (
      <div>      
        <Link className="ui right floated primary button" to="/sales/new">
          <i className="add circle icon"></i>
          Create new Sale
        </Link>
        <h1 className="ui header">Sales</h1>          
        
        <div className="ui divider"></div>

        <List sales={this.props.sales} />      
      </div>   
    )
  }
}

Sales.propTypes = {
  sales: React.PropTypes.array.isRequired,
  fetchSales: React.PropTypes.func.isRequired
}

function mapSateToProps(state) {
  return {
    sales: state.sales
  }
}

export default connect(mapSateToProps, { fetchSales })(Sales)