import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import List from './List' 
import { connect } from 'react-redux'
import { fetchSales, deleteSale } from '../../actions/saleActions'

class Page extends Component {

  componentDidMount() {
    this.props.fetchSales()
  }

  render() {
    return (
      <div>
        <div className="row column">  
          <Link className="ui right floated primary button" to="/sales/new">
            <i className="add circle icon"></i>
            Create new Sale
          </Link>
          <h1 className="ui header m-t-n">Sales</h1>   

          <div className="ui divider"></div>  
        </div>
        
        <div className="row column">     
          <List sales={this.props.sales} deleteSale={deleteSale} />   
        </div>       
      </div>   
    )
  }
}

Page.propTypes = {
  sales: React.PropTypes.array.isRequired,
  fetchSales: React.PropTypes.func.isRequired,
  deleteSale: React.PropTypes.func.isRequired
}

function mapSateToProps(state) {
  return {
    sales: state.sales
  }
}

export default connect(mapSateToProps, { fetchSales, deleteSale })(Page)