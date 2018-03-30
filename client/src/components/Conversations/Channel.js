import React from 'react' 
import { Link } from 'react-router-dom'
import classnames from 'classnames'

// Localization 
import T from 'i18n-react'

export default function Channel({ getChannels, match }) {

  const channelList = getChannels.map(channel => 
    <Link key={channel.id} to={`/conversations/channel/${channel.id}`} 
      className={classnames('item', {active: match && match.params.channelId === channel.id})}>
      
      <div className="ui small blue label">{channel.getUsersCount}</div>

      <div>
        <i className="bullhorn icon"></i>&nbsp;
        {channel.name}
      </div>
    </Link>
  )

  return (
    <div className="four wide column">
      <div className="ui vertical fluid menu">

        <div className="ui center aligned vertical segment">
          <Link className="ui primary small button" to="/conversations/new">
            <i className="plus outline icon"></i>
            {T.translate("conversations.page.add_channel")}
          </Link>
        </div>

        {channelList}

      </div>
    </div>
  )
  
}



