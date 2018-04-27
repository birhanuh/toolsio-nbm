import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Table from './Table' 
import { graphql} from 'react-apollo'
import gql from 'graphql-tag'

// Localization 
import T from 'i18n-react'

import Breadcrumb from '../Layouts/Breadcrumb'

class Page extends Component {

  componentDidMount() {
    
  }
  
  render() {

    const { getInvoices } = this.props.data

    return (

      <div className="row column">  

        <Breadcrumb />
        
        <div className="ui vertical segment">
          <Link className="ui primary button" to="/invoices/new">
            <i className="add circle icon"></i>
            {T.translate("invoices.page.create_new_invoice")}
          </Link>
        </div>  

        <div className="ui clearing segment">
          <div className="ui right floated vertical segment">
            <div className="ui icon input">
              <i className="search icon"></i>
              <input type="text" placeholder="Search..." />
            </div>
          </div>
          <div className="ui left floated vertical segment border-bottom-none">
            <select className="ui dropdown">
              <option value="10" default>10</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>

          { getInvoices && <Table invoices={getInvoices} /> } 

          <div className="ui right floated vertical segment">            
            <p>Pagination...</p>
          </div>

        </div>

      </div>  
    )

  }
}

const getInvoicesQuery = gql`
  query {
    getInvoices {
      id
      deadline
      referenceNumber
      status
      tax
      total
      project {
        id
        name
        status
      }
      sale {
        id
        name
        status
      }
      customer {
        id
        name
      }
    }
  }
`
export default graphql(getInvoicesQuery)(Page)
