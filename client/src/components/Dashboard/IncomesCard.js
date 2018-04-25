import React, { Component }  from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { fetchIncomes } from '../../actions/dashboardActions'

import { Bar } from 'react-chartjs-2'

// Localization 
import T from 'i18n-react'

class IncomesCard extends Component {
  
  state = {
    value: false,
    isLoading: false
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.incomes) {
      this.setState({ isLoading: false })
    }
  }

  componentDidMount = () => {
    this.setState({ isLoading: true })
    this.props.fetchIncomes()
      .catch( ({response}) => this.setState({ isLoading: false }) )
  }

  render() {

    const { isLoading } = this.state
    const { incomes } = this.props
  
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
      ]

    const data = incomes && incomes.lastTwoMonths.length !== 0 && incomes.lastTwoMonths[0].data.map(income => 
      ({x: new Date(''+monthNames[income.date.month-1]+' '+income.date.day+' '+income.date.year+'').getTime(), y: income.sum})
      )

    const MARGIN = {
      bottom: 50
    }

    return (
      <div className={classnames("ui card dashboard form", { loading: isLoading })}>
        <div className="content">
          <div className="right floated">
            <h4 className="ui header">
              <i className="money icon"></i>
            </h4>
          </div> 
          <div className="left floated">
            <h4 className="ui header">
              {T.translate("dashboard.incomes.header")}
            </h4>
          </div>       
        </div>

        <div className="image">
          <Bar />
        </div>
        
        <div className="content">
          <div className="right floated">
            <div className="meta">{T.translate("dashboard.this_month")}</div>
            <div className="header">
              {incomes && incomes.lastTwoMonths.length !== 0 ? incomes.lastTwoMonths[1].totalSum : '-'}
              {incomes && incomes.lastTwoMonths.length !== 0 && (incomes.lastTwoMonths[0].totalSum > incomes.lastTwoMonths[1].totalSum ) ? <i className="long arrow down red icon"></i> : 
                <i className="long arrow up green icon"></i>}
              </div>
          </div>     
          <div className="left floated">
            <div className="meta">{T.translate("dashboard.last_month")}</div>
            <div className="header">{incomes && incomes.lastTwoMonths.length !== 0 ? incomes.lastTwoMonths[0].totalSum : '-'}</div>
          </div>    
        </div> 

        {incomes && incomes.total && incomes.total.count === 0 && 
          <div className="content-btn-outer-container">
            <div className="content-btn-inner-container">
              <Link to="/invoices" className="ui primary outline button small">
                <i className="check circle outline icon"></i>{T.translate("dashboard.invoices.create_first_invoice")}
              </Link>
            </div>
          </div>
        }          
      </div>
      )
  }
}

IncomesCard.propTypes = {
  fetchIncomes: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    incomes: state.dashboard.incomes
  }
}

export default connect(mapStateToProps, { fetchIncomes }) (IncomesCard)
