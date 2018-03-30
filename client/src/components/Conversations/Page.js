import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

import Messages from './Messages'
import Channel from './Channel'
import ChannelForm from './Form/Channel'

import Breadcrumb from '../Layouts/Breadcrumb'

class Page extends Component {

  render() {
    
    const { match } = this.props    
    
    return (

      <div className="ui stackable grid">

        <Breadcrumb />

        <div className="four wide column">
          <Channel  channelId={match.params.channelId} />
        </div>

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

export default Page


