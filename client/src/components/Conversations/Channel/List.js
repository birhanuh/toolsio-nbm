import React, { Component } from 'react' 
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

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
    
    const { data: { getChannels }, channelId } = this.props

    const channelList = getChannels && getChannels.map(channel => 
      <Link key={channel.id} to={`/conversations/channel/${channel.id}`} 
        className={classnames('item', {active: channelId && parseInt(channelId) === channel.id})}>
        
        <div className="ui blue label">
          {T.translate("conversations.channel.members")}
          <div className="detail">{channel.getUsersCount}</div>
        </div>

        <div>
          <i className="bullhorn icon"></i>&nbsp;
          {channel.name}
        </div>
      </Link>
    )

    return (
       <div>
        <div className="ui center aligned vertical segment">
          <Link className="ui primary small button" to="/conversations">
            <i className="add circle icon"></i>
            {T.translate("conversations.page.create_channel")}
          </Link>
        </div>

        {channelList}

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
export default graphql(getChannelsQuery)(List)



