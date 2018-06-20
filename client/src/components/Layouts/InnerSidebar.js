import React from 'react'
import { Route, Link } from 'react-router-dom'
import { Sidebar, Menu } from 'semantic-ui-react'

// Localization 
import T from 'i18n-react'

// Images
import logoPlaceholderMedium from '../../images/logo-placeholder.svg'

const ActiveLink = ({ label, to, icon, activeOnlyWhenExact }) => (
  <Route path={to} exact={activeOnlyWhenExact} children={({ match }) => (
    <Link className={match ? 'active item' : 'item' } to={to}>
      <i className={icon}></i>
      <span>{label}</span>
    </Link>
  )} />
)

export function InnerSidebar({ visibleInnerSidebar}) {

  return (
      <Sidebar as={Menu} animation='slide along' visible={visibleInnerSidebar} vertical inverted>
        <div className="ui center aligned vertical segment account">
          <Link to="/settings">
            <img className="ui centered tiny rounded image mt-3" src={logoPlaceholderMedium} alt="logo-placeholder-medium" />
          </Link>
          <p className="mt-3 mb-2">Birhanu (Admin)</p>
        </div>
        <ActiveLink activeOnlyWhenExact to="/dashboard" icon="dashboard icon" label={T.translate("dashboard.header")} />
        <ActiveLink activeOnlyWhenExact to="/projects" icon="suitcase icon" label={T.translate("projects.page.header")} />
        <ActiveLink activeOnlyWhenExact to="/sales" icon="cart icon" label={T.translate("sales.page.header")} />
        <ActiveLink activeOnlyWhenExact to="/customers" icon="users icon" label={T.translate("customers.page.header")}/>
        <ActiveLink activeOnlyWhenExact to="/invoices" icon="file text outline icon" label={T.translate("invoices.page.header")}/>
        <ActiveLink activeOnlyWhenExact to="/users" icon="user icon" label={T.translate("users.page.header")}/>
        <ActiveLink activeOnlyWhenExact to="/events" icon="calendar alternate icon" label={T.translate("events.page.header")}/>
      </Sidebar>  
    )
}