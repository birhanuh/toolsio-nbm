import React from 'react'
import PropTypes from 'prop-types'

// Localization 
import T from 'i18n-react'

export default function UserShow({ user }) {

  return (
    <div className="ui segment">    
      <h1 className="ui header">{T.translate("account.page.user")}</h1> 
      <dl className="dl-horizontal">
        <dt>{T.translate("account.page.first_name")}</dt>
        <dd>{user.first_name}</dd>
        <dt>{T.translate("account.page.last_name")}</dt>
        <dd>{user.last_name}</dd>
        <dt>{T.translate("account.page.email")}</dt>
        <dd>{user.email}</dd>
      </dl>  
    </div>   
  )
}

UserShow.propTypes = {
  user: PropTypes.object.isRequired
}