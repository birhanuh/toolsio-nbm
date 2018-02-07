import React, { Component }  from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { fetchInvoiceTasks } from '../../actions/dashboardActions'

// Localization 
import T from 'i18n-react'

class InvoiceTasks extends Component {
  
  state = {
    isLoading: false
  }

  componentDidMount() {
    this.props.fetchInvoiceTasks()
      .catch( ({response}) => this.setState({ invoiceTasks: { isLoading: true} }) )
  }
  
  render() {
    
    const { invoiceTasks } = this.props

    return (
      
      <div className="dashboards">
        <h4 className="ui header">{T.translate("dashboards.project_tasks.header")}</h4>
        <div className="ui card">
          <div className="content">
            
          </div>
        </div>
      </div>  
      )
  }
}

InvoiceTasks.propTypes = {
  fetchInvoiceTasks: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    invoiceTasks: state.dashboards.invoiceTasks
  }
}

export default connect(mapStateToProps, { fetchInvoiceTasks }) (InvoiceTasks)
