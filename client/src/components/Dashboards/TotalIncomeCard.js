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

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.totalIncome) {
      this.setState({ isLoading: false })
    }
  }

  componentDidMount() {
    this.setState({ isLoading: true })
    this.props.fetchTotalIncome()
      .catch( ({response}) => this.setState({ totalIncome: { isLoading: true} }) )
  }
  
  render() {

    const { isLoading } = this.state
    const { totalIncome } = this.props

    return (    
    
      <div className={classnames("ui card dashboards form", { loading: isLoading })}>
        <div className="content">
          <h4 className="ui header body-color">
            {T.translate("dashboards.total_income.header")}
          </h4>
        </div>
        <div className="content" style={{display: 'table-cell', verticalAlign: 'middle', borderTop: 'none'}}>
          <h1 className="ui header green centered bold">{totalIncome && totalIncome[0].sum}</h1>
          <div className="description center aligned">{T.translate("dashboards.total_income.description")}</div>
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

