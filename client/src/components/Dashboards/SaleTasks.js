import React, { Component }  from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { fetchSaleTasks } from '../../actions/dashboardActions'

// Localization 
import T from 'i18n-react'

class SaleTasks extends Component {
  
  state = {
    isLoading: false
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.saleTasks) {
      this.setState({ isLoading: false })
    }
  }

  componentDidMount() {
    this.setState({ isLoading: true })
    this.props.fetchSaleTasks()
      .catch( ({response}) => this.setState({ isLoading: false }) )
  }
  
  render() {
    
    const { isLoading } = this.state
    const { saleTasks } = this.props
    
    let newNotification   
    let newSales 

    let overdueNotification   
    let overdueSales 

    saleTasks && saleTasks.newDelayed.map(task => {

      if (task._id === 'new') {
        newNotification = (<div key={task._id} className="ui info message">
            <div className="description">
              {T.translate("dashboards.sale_tasks.new_sales", {count: task.count})}
            </div>
          </div>
          )
        
        newSales = task.sales.map(sale => 
          <Link key={sale._id} to={`/sales/show/${sale._id}`} className="item blue">{sale.name}</Link>
        )  
      } else if (task._id !== 'new') {
        newNotification = (<div key={"no-new"} className="ui info message">
            <div className="description">
              {T.translate("dashboards.sale_tasks.no_new_sales")}
            </div>
          </div>
          )
      }

      if (task._id === 'overdue') {
        overdueNotification = (<div key={task._id} className="ui negative message">
            <div className="description">
              {T.translate("dashboards.sale_tasks.overdued_sales", {count: task.count})}
            </div>
          </div>
          )
        
        overdueSales = task.sales.map(sale => 
          <Link key={sale._id} to={`/sales/show/${sale._id}`} className="item red">{sale.name}</Link>
        )  
      } else if (task._id !== 'overdue') {
        overdueNotification = (<div key={"no-overdue"} className="ui negative message">
            <div className="description">
              {T.translate("dashboards.sale_tasks.no_overdued_sales")}
            </div>
          </div>
          )
      }

      })

    const lists = (<div className="content">
      {newNotification}
      <div className="ui ordered list">
        {newSales}
      </div>

      <div className="ui divider"></div>

      {overdueNotification}
      <div className="ui ordered list">
        {overdueSales}
      </div>

      </div>)

    return (
      
      <div className={classnames("dashboards", { loading: isLoading })}>
        <h4 className="ui header">{T.translate("dashboards.sale_tasks.header")}</h4>
        <div className="ui card">
          
          {saleTasks && (saleTasks.total.count !== 0 ? lists : 
            <div className="content">
              <div className="ui info message">
                <div className="description">
                  {T.translate("dashboards.sale_tasks.no_sales")}
                </div>
              </div> 
            </div>)}
          
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

