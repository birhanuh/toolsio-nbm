import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import Messages from './Messages'
import Channel from './Channel'
import ChannelForm from './Form/Channel'

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
    
    const { getChannels } = this.props.data

    let account = {}

    const { match } = this.props    
    
    return (

      <div className="ui stackable grid">

        <Breadcrumb />

        {getChannels && <Channel getChannels={getChannels} match={match} /> }

        <div className="twelve wide stretched column">
          <div className="ui segment">

            <Switch>

              <Route exact path="/conversations" component={ChannelForm} /> 

              <Route exact path="/conversations/new" component={ChannelForm} /> 

              <Route exact path="/conversations/channel/:channelId?" children={() =>
                <Messages channelId={match.params.channelId} />
              }/>}
    
            </Switch>


          </div>
        </div>
      </div> 
    )
  }
}

const getChannelsQuery = gql`
  {
    getChannels {
      id
      name
      getUsersCount 
    }
  }
`
export default graphql(getChannelsQuery)(Page)


