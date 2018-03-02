import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import List from './List' 
import { Pagination } from '../../utils'
import { connect } from 'react-redux'
import { fetchSales } from '../../actions/saleActions'

// Localization 
import T from 'i18n-react'

import Breadcrumb from '../Layouts/Breadcrumb'

class Page extends Component {

  constructor(props) {
    super(props)
    this.state = {
      start: 0,
      length: 10
    }
  }

  componentDidMount() {

    const { start, length} = this.state
    
    const { match } = this.props

    if (!!match.params.start) {   
      this.props.fetchSales(match.params.start, match.params.length)
    } else {
      this.props.fetchSales(start, length)
    }

  }

  render() {

    const { length } = this.state

    const { sales, match } = this.props

    return (
      <div className="row column">  

        <Breadcrumb />
        
        <div className="ui clearing vertical segment border-bottom-none">
          <div className="ui right floated icon input">
            <input type="text" placeholder="Search..." />
            <i className="inverted circular search link icon"></i>
          </div>

          <Link className="ui left floated primary button" to="/sales/new">
            <i className="add circle icon"></i>
            {T.translate("sales.page.create_new_sale")}
          </Link>   
        </div>   

         <div className="row column">     
          { sales && sales.list && <List sales={this.props.sales.list} /> }
        </div>    

        <div className="ui clearing vertical segment border-bottom-none">
         
          <Pagination path="sales" list={sales} match={match} length={length} />           
           
        </div>   
      </div>  
    )
  }
}

Page.propTypes = {
  fetchSales: PropTypes.func.isRequired,
}

function mapSateToProps(state) {
  return {
    sales: state.sales
  }
}

export default connect(mapSateToProps, { fetchSales })(Page)
