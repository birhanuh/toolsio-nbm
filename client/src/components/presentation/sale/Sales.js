import React, { Component } from 'react'
import List from './List' 
import { connect } from 'react-redux'

class Sales extends Component {

  render() {
    return (
      <div className="row">
        <div className="col-sm-12">
          <h1>Sales</h1>

          <List sales={this.props.sales} />
        </div>
      </div>   
    )
  }
}

Sales.propTypes = {
  sales: React.PropTypes.array.isRequired
}

function mapSateToProps(state) {
  return {
    sales: state.sales
  }
}

export default (mapSateToProps)(Sales)