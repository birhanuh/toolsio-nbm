import React, { Component }  from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { fetchSaleTasks } from '../../actions/dashboardActions'

// Localization 
import T from 'i18n-react'

class SaleTasks extends Component {
  
  state = {
    isLoading: false
  }

  componentDidMount() {
    this.props.fetchSaleTasks()
      .catch( ({response}) => this.setState({ saleTasks: { isLoading: true} }) )
  }
  
  render() {

    const { saleTasks } = this.props

    return (
      
      <div className="dashboards">
        <h4 className="ui header">{T.translate("dashboards.sale_tasks.header")}</h4>
        <div className="ui card">
          <div className="content">
      
          </div>
        </div>
      </div>  
      )
  }

}

SaleTasks.propTypes = {
  fetchSaleTasks: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    saleTasks: state.dashboards.saleTasks
  }
}

export default connect(mapStateToProps, { fetchSaleTasks }) (SaleTasks)

