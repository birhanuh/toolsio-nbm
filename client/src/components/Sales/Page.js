import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import List from './List' 
import { Pagination } from '../../utils'
import { connect } from 'react-redux'
import { fetchSales } from '../../actions/saleActions'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

// Localization 
import T from 'i18n-react'

import Breadcrumb from '../Layouts/Breadcrumb'

class Page extends Component {

  constructor(props) {
    super(props)
    this.state = {
      offset: 0,
      limit: 10
    }
  }

  componentDidMount() {

    const { offset, limit} = this.state
    
    const { match } = this.props

    // if (!!match.params.offset) {   
    //   this.props.fetchSales(match.params.offset, match.params.limit)
    // } else {
    //   this.props.fetchSales(offset, limit)
    // }

  }

  render() {

    const { limit } = this.state

    const { match } = this.props
    const { getSales } = this.props.data

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
          { getSales && <List sales={getSales} /> }
        </div>    

        <div className="ui clearing vertical segment border-bottom-none">
         
          {/*<Pagination path="sales" total={getSales.total} offset={offset} limit={limit} /> */}          
           
        </div>   
      </div>  
    )
  }
}

Page.propTypes = {
  //fetchSales: PropTypes.func.isRequired,
}

const getSalesQuery = gql`
  {
    getSales {
      id
      name 
      deadline
      status
      description
      customer {
        name
      }
    }
}
`

export default graphql(getSalesQuery)(Page)
