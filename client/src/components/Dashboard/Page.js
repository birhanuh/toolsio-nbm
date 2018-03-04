import React, { Component } from 'react'

// React-vis style 
import 'react-vis/dist/styles/plot.scss'
import 'react-vis/dist/styles/legends.scss'

import Breadcrumb from '../Layouts/Breadcrumb'

import TotalIncomeCard from './TotalIncomeCard'
import IncomesCard from './IncomesCard'
import ProjectsCard from './ProjectsCard'
import SalesCard from './SalesCard'
import CustomersCard from './CustomersCard'
import InvoicesCard from './InvoicesCard'
import ProjectTasks from './ProjectTasks' 
import SaleTasks from './SaleTasks' 
import InvoiceTasks from './InvoiceTasks' 

class Page extends Component {

  render() {

    return ( 
      <div className="row column">  

        <Breadcrumb />

        <div className="ui four column grid">
          <div className="column">
            <TotalIncomeCard />
          </div>
          <div className="column">
            <IncomesCard />
          </div>
          <div className="column">
            <ProjectsCard />
          </div>
          <div className="column">  
            <SalesCard />
          </div>
        </div>

        <div className="ui two column grid">
          <div className="four wide column">
            <CustomersCard />
          </div>
          <div className="twelve wide column">
            <InvoicesCard /> 
          </div>
        </div>

        <div className="ui three column grid">
          <div className="column">
            <ProjectTasks />
          </div>
          <div className="column">
            <SaleTasks />
          </div>
          <div className="column">
            <InvoiceTasks />
          </div>
        </div>

      </div>  
    )
  }  
}

export default Page

