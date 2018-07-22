import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Menu, List, Header } from 'semantic-ui-react'

import ChannelMessages from './Channel/Messages'
import ChannelsList from './Channel/List'
import DirectMessages from './Direct/Messages'
import UsersList from './Direct/List'

// Localization 
import T from 'i18n-react'

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

            <Route exact path="/conversations" render={() => <div>
              <Header as='h3'>{T.translate(`conversations.page.landing_header`)}</Header>
              <List>
                <List.Item>
                  <List.Icon name='users' />
                  <List.Content><p>{T.translate(`conversations.page.landing_colleagues_description`)}</p></List.Content>
                </List.Item>
                <List.Item>
                  <List.Icon name='mail' />
                  <List.Content><p>{T.translate(`conversations.page.landing_messages_description`)}</p></List.Content>
                </List.Item>
                <List.Item>
                  <List.Icon name='linkify' />
                  <List.Content><p>{T.translate(`conversations.page.landing_attachments_description`)}</p></List.Content>
                </List.Item>
              </List>
            </div>} /> 

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


