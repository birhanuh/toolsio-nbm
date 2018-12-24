import React from 'react'

import TotalIncomeCard from './TotalIncomeCard'
import IncomesCard from './IncomesCard'
import ProjectsCard from './ProjectsCard'
import SalesCard from './SalesCard'
import CustomersCard from './CustomersCard'
import InvoicesCard from './InvoicesCard'
import ProjectTasks from './ProjectTasks' 
import SaleTasks from './SaleTasks' 
import InvoiceTasks from './InvoiceTasks' 

// Semantic React UI
import { Grid } from 'semantic-ui-react'

const Page = () => {
  return ( 
    <Grid.Row>
      <Grid.Column width={16}>            
        <Grid columns={4}>
          <Grid.Column>
            {TotalIncomeCard()}
          </Grid.Column>
          <Grid.Column>
            {IncomesCard()}
          </Grid.Column>

          <Grid.Column>
            {ProjectsCard()}
          </Grid.Column>

          <Grid.Column>  
            {SalesCard()}
          </Grid.Column>
        </Grid>
        
        <Grid columns={2}>
          <Grid.Column width={6}>
            {CustomersCard()}
          </Grid.Column>
          <Grid.Column width={10}>
            {InvoicesCard()} 
          </Grid.Column>
        </Grid>
       
        <Grid columns={3}>
          <Grid.Column>
            {ProjectTasks()}
          </Grid.Column>
           
          <Grid.Column>
            {SaleTasks()}
          </Grid.Column>
          
          <Grid.Column>
            {InvoiceTasks()}
          </Grid.Column>
        </Grid>
      </Grid.Column>
    </Grid.Row>)   
}

export default Page

