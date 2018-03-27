import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import List from './List'
import Show from './Show'
import Sidebar from './Sidebar'
import Form from './Form'

import Breadcrumb from '../Layouts/Breadcrumb'

// jQuery
import $ from 'jquery'

class Page extends Component {

  componentDidMount() {

    $('.ui .item').on('click', function() {
      $('.ui .item').removeClass('active')
      $(this).addClass('active')
    })   

    $('#archive').on('click', function() {
      console.log('Draft clicked')
    })

  }

  render() {
    
    const { getInboxMessages, getSentMessages, getArchiveMessages, getReadAndArchivedCounts } = this.props.data

    let account = {}

    const { match } = this.props    
    let type = match.params.type
    
    return (

      <div className="ui stackable grid">

        <Breadcrumb />

        {getReadAndArchivedCounts && <Sidebar getReadAndArchivedCounts={getReadAndArchivedCounts} match={match} /> }

        <div className="twelve wide stretched column">
          <div className="ui segment">

            <Switch>
              {getInboxMessages && <Route exact path="/messages" children={() =>
                <List messages={getInboxMessages} account={account} type={type}/>
              } />}

              <Route exact path="/messages/new" component={Form} type={type}/> 
              
              {getInboxMessages && <Route exact path="/messages/inbox" children={() =>
                <List messages={getInboxMessages} account={account} type={type}/>
              } />}

              {getSentMessages && <Route exact path="/messages/sent" children={() =>
                <List messages={getSentMessages} account={account} type={type}/>
              } />}

              {getArchiveMessages && <Route exact path="/messages/archive" children={() =>
                <List messages={getArchiveMessages} account={account} type={type}/>
              } />}
              {/*
              <Route exact path="/messages/:type/show/:id" render={(props) => 
                <Show conversations={conversations} {...props} type={type}/> 
              } />*/}
            </Switch>


          </div>
        </div>
      </div> 
    )
  }
}

const getMessagesQuery = gql`
  {
    getInboxMessages {
      id
      title
      body
      createdAt
    }
    getSentMessages {
      id
      title
      body
      createdAt
    }
    getArchiveMessages {
      id
      title
      body
      createdAt
    }
    getReadAndArchivedCounts {
      success
      unreadCount
      archivedCount
    }
  }
`
export default graphql(getMessagesQuery)(Page)


