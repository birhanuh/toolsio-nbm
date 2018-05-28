import React, { Component } from 'react' 
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { Label } from 'semantic-ui-react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { GET_CHANNELS_USERS_COUNT_QUERY } from '../../../graphql/channels'

// Localization 
import T from 'i18n-react'

// jQuery
import $ from 'jquery'

class List extends Component {

  componentDidMount() {

    $('.ui .item').on('click', function() {
      $('.ui .item').removeClass('active')
      $(this).addClass('active')
    })   

  }

  render() {    
    const { data: { getChannelsUsersCount }, channelId } = this.props

    const channelList = getChannelsUsersCount && getChannelsUsersCount.map(channel => 
      <Link key={channel.id} to={`/conversations/channel/${channel.id}`} 
        className={classnames('item', {active: channelId && parseInt(channelId) === channel.id})}>
        
        <Label className="blue">
          {T.translate("conversations.channel.members")}
          <div className="detail">{channel.usersCount}</div>
        </Label>

        <div>
          <i className="bullhorn icon"></i>&nbsp;
          {channel.name}
        </div>
      </Link>
    )

    return [
      <div key="create-channel" className="ui center aligned vertical segment">
        <Link className="ui primary small button" to="/conversations">
          <i className="add circle icon"></i>
          {T.translate("conversations.page.create_channel")}
        </Link>
      </div>,

      channelList
    ]
  }
}

export default graphql(GET_CHANNELS_USERS_COUNT_QUERY)(List)



