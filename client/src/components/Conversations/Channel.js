import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

// Localization 
import T from 'i18n-react'

// jQuery
import $ from 'jquery'

class Channel extends Component {

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
        className={classnames('item', {active: parseInt(channelId) === channel.id})}>
        
        <div className="ui small blue label">{channel.getUsersCount}</div>

        <div>
          <i className="bullhorn icon"></i>&nbsp;
          {channel.name}
        </div>
      </Link>
    )

    return (
       <div className="ui vertical fluid menu">
        <div className="ui center aligned vertical segment">
          <Link className="ui primary small button" to="/conversations/new">
            <i className="plus outline icon"></i>
            {T.translate("conversations.page.add_channel")}
          </Link>
        </div>

        {channelList}

      </div>
    )
  }
}

Channel.propTypes = {
  channelId: PropTypes.string.isRequired
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
export default graphql(getChannelsQuery)(Channel)



