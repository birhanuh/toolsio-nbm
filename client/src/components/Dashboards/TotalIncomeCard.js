import React, { Component }  from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { fetchTotalIncome  } from '../../actions/dashboardActions'

// Localization 
import T from 'i18n-react'

class TotalIncomeCard extends Component {
  
  state = {
    isLoading: false
  }

  componentDidMount() {
    this.props.fetchTotalIncome()
      .catch( ({response}) => this.setState({ totalIncome: { isLoading: true} }) )
  }
  
  render() {

    const { totalIncome } = this.props

    return (
      
      <div className="dashboards">
        <h4 className="ui header">{T.translate("dashboards.total_income.header")}</h4>
        <div className="ui card" style={{height: '285px', display: 'table'}}>
          <div className="content" style={{display: 'table-cell', verticalAlign: 'middle'}}>
            <h1 className="ui header green centered bold">{totalIncome && totalIncome[0].sum}</h1>
            <div className="description center aligned">{T.translate("dashboards.total_income.description")}</div>
          </div>
        </div>
      </div>  
    )
  }

}

TotalIncomeCard.propTypes = {
  fetchTotalIncome: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    totalIncome: state.dashboards.totalIncome
  }
}

export default connect(mapStateToProps, { fetchTotalIncome }) (TotalIncomeCard)

