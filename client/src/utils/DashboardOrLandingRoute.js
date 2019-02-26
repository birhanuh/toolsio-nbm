import React from 'react'
import { Route } from 'react-router-dom'
import { Query } from 'react-apollo'
import { GET_CURRENT_ACCOUNT_QUERY } from '../graphql/authentications'

// Dashboard or Landing page routes
export const DashboardOrLandingPageRoute = ({ dashboardComponent: DashboardComponent, landingPageComponent: LandingPageComponent, ...rest } ) => (
  <Query query={GET_CURRENT_ACCOUNT_QUERY}>
    {({ loading, error, data }) => {

      if (loading) return null;
      if (error) return `Error!: ${error}`;
      
      const { success } = data.getCurrentAccount
      console.log('DashboardOrLandingPageRoute: ', success)
      return (<Route {...rest} render={props => (    
      success ? <DashboardComponent {...props} /> : <LandingPageComponent {...props} /> ) } />)  
    }}
  </Query>
)