import React, { Component } from 'react'
import { Link } from 'react-router'
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
        <h1>Sales</h1>
        <Link className="ui primary button" to="/sales/new">Create Sale</Link>
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