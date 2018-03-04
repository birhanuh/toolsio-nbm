import React from 'react'
import PropTypes from 'prop-types'

// Localization 
import T from 'i18n-react'

export default function AccountShow({ account }) {

  return (
    <div className="ui segment">    
      <h1 className="ui header">{T.translate("account.page.account")}</h1> 
      <dl className="dl-horizontal">
        <dt>{T.translate("account.page.subdomain")}</dt>
        <dd>{account.subdomain}</dd>
        <dt>{T.translate("account.page.industry")}</dt>
        <dd>{account.industry}</dd>
        
        <h3 className="ui header">{T.translate("account.page.contact.header")}</h3>
        <dt>{T.translate("account.page.contact.phone_number")}</dt>
        <dd>{account.contact.phoneNumber ? account.contact.phoneNumber : '-'}</dd>
        <dt>{T.translate("account.page.contact.email")}</dt>
        <dd>{account.contact.email ? account.contact.email : '-'}</dd>

        <h3 className="ui header">{T.translate("account.page.address.header")}</h3>
        <dt>{T.translate("account.page.address.street")}</dt>
        <dd>{account.address.street}</dd>
        <dt>{T.translate("account.page.address.postal_code")}</dt>
        <dd>{account.address.postalCode}</dd>
        <dt>{T.translate("account.page.address.region")}</dt>
        <dd>{account.address.region}</dd>
        <dt>{T.translate("account.page.address.country")}</dt>
        <dd>{account.address.country}</dd>
      </dl>  
    </div>   
  )
}

AccountShow.propTypes = {
  account: PropTypes.object.isRequired
}