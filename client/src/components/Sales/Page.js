import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import List from './List' 
import { connect } from 'react-redux'
import { fetchSales, deleteSale } from '../../actions/saleActions'

// Localization 
import T from 'i18n-react'

class Page extends Component {

  componentDidMount() {
    this.props.fetchSales()
  }

  render() {
    return (
      <div className="row column">  
        <div className="ui clearing segment transparent">
          <Link className="ui right floated primary button" to="/sales/new">
            <i className="add circle icon"></i>
            {T.translate("sales.index.create_new_sale")}
          </Link>
          <h1 className="ui left floated header m-t-n">{T.translate("sales.index.header")}</h1>   
        </div>  
        
        <div className="ui divider"></div>  

        <List sales={this.props.sales} deleteSale={deleteSale} />   
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
