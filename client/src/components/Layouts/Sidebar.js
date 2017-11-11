import React from 'react'
import { Route, Link } from 'react-router-dom'

// Localization 
import T from 'i18n-react'

// Images
import logoPlaceholderMedium from '../../images/logo-placeholder-medium.png'

const ActiveLink = ({ label, to, icon, activeOnlyWhenExact }) => (
  <Route path={to} exact={activeOnlyWhenExact} children={({ match }) => (
    <Link className={match ? 'active item' : 'item' } to={to}>
      <i className={icon}></i>
      <span>{label}</span>
    </Link>
  )} />
)

export default function Sidebar() {

  return(
    <div className="ui visible sidebar vertical menu">
      <div className="ui center aligned vertical segment account">
        <a href="/settings">
          <img className="ui centered tiny rounded image" src={logoPlaceholderMedium} alt="logo-placeholder-medium" />
        </a>
        <p className="mt-3">Birhanu (Admin)</p>
      </div>
      <ActiveLink activeOnlyWhenExact to="/dashboard" icon="dashboard icon" label={T.translate("dashboards.header")} />
      <ActiveLink activeOnlyWhenExact to="/projects" icon="suitcase icon" label={T.translate("projects.page.header")} />
      <ActiveLink activeOnlyWhenExact to="/sales" icon="cart icon" label={T.translate("sales.page.header")} />
      <ActiveLink activeOnlyWhenExact to="/customers" icon="users icon" label={T.translate("customers.page.header")}/>
      <ActiveLink activeOnlyWhenExact to="/invoices" icon="file text outline  icon" label={T.translate("invoices.page.header")}/>
      <ActiveLink activeOnlyWhenExact to="/users" icon="user icon" label={T.translate("users.page.header")}/>
    </div>
  )
}