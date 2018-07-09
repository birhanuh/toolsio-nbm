import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'

import ChannelMessages from './Channel/Messages'
import ChannelsList from './Channel/List'
import ChannelForm from './Channel/Form/Channel'
import DirectMessages from './Direct/Messages'
import UsersList from './Direct/List'

const Page = ({ match }) => {    
    
  return (
    <div className="column row">
      <div className="four wide column">
        <Menu vertical fluid>
          <ChannelsList  channelId={match.params.channelId} />

          <div className="ui horizontal divider">Or</div>

          <UsersList receiverId={match.params.receiverId} />
        </Menu>
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

export default Page


