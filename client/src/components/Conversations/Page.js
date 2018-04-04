import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

import ChannelMessages from './Channel/Messages'
import ChannelsList from './Channel/List'
import ChannelForm from './Channel/Form/Channel'
import DirectMessages from './Direct/Messages'
import UsersList from './Direct/List'

import Breadcrumb from '../Layouts/Breadcrumb'

class Page extends Component {

  render() {
    
    const { match } = this.props    
    
    return (

      <div className="ui stackable grid">

        <Breadcrumb />

        <div className="four wide column">
          <div className="ui vertical fluid menu">
            <ChannelsList  channelId={match.params.channelId} />

            <div className="ui divider"></div>

            <UsersList receiverId={match.params.receiverId} />
          </div>
        </div>

        <div className="twelve wide stretched column">
          <div className="ui segment">

            <Switch>

              <Route exact path="/conversations" component={ChannelForm} /> 

              <Route exact path="/conversations/channel/:channelId?" children={() =>
                <ChannelMessages channelId={match.params.channelId} />
              }/>
      
              <Route exact path="/conversations/receiver/:receiverId?" children={() =>
                <DirectMessages receiverId={match.params.receiverId} />
              }/>

            </Switch>

          </div>
        </div>
      </div> 
    )
  }
}

export default Page


