import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { graphql} from 'react-apollo'
import gql from 'graphql-tag'

import Form from './Form'

// Localization 
import T from 'i18n-react'

export default function Sidebar({ getReadAndArchivedCounts, match }) {

  const { unreadCount, archivedCount } = getReadAndArchivedCounts

  return (
    <div className="four wide column">
      <div className="ui vertical fluid menu">

        <div className="ui center aligned vertical segment">
          <Link className="ui primary small button" to="/messages/new">
            <i className="edit outline icon"></i>
            {T.translate("messages.page.compose_new_conversation")}
          </Link>
        </div>
        
        <div className="ui divider mt-0"></div>

        <Link to="/messages/inbox" className={classnames('item', {active: (match && match.params.type === "inbox" || match && typeof match.params.type === "undefined")})}>
          
          <div className="ui small blue label">{unreadCount}</div>

          <div>
            <i className="inbox outline icon"></i>&nbsp;
            {T.translate("messages.page.inbox")}
          </div>
        </Link>

        <Link to="/messages/sent" className={classnames('item', {active: match && match.params.type === "sent"})}>
          
          <div>
            <i className="send outline icon"></i>&nbsp;
            {T.translate("messages.page.sent")}
          </div>
        </Link>

        <Link to="/messages/archive" id="archive" className={classnames('item', {active: match && match.params.type === "archive"})}>

          <div className="ui small green label">{archivedCount}</div>

          <div>
            <i className="copy outline icon"></i>&nbsp;
            {T.translate("messages.page.archive")}
          </div>
        </Link>

      </div>
    </div>
  )
  
}



