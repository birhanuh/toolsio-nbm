import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'

// Localization 
import T from 'i18n-react'

/* jQuery */
import $ from 'jquery'
$.animate = require('jquery.easing')
$.fn.transition = require('semantic-ui-transition')
$.fn.visibility = require('semantic-ui-visibility')

const ActiveLink = ({ label, to, icon, activeOnlyWhenExact }) => (
  <Route path={to} exact={activeOnlyWhenExact} children={({ match }) => (
    <Link className={match ? 'active item' : 'item' } to={to}>
      <i className={icon}></i>
      <span>{label}</span>
    </Link>
  )} />
)

class LandingPageHeaderNav extends Component {

  componentDidMount = () => {
    // fix menu when passed
    $('.masthead .ui.text.container')
    .visibility({
      once: false,
      onBottomPassed: function()  {
        $('.fixed.menu').transition('fade in')
      },
      onBottomPassedReverse: function()  {
        $('.fixed.menu').transition('fade out')
      }
    })

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('.ui.large.menu .left.menu a').on('click', function(event) {
      event.preventDefault()
      var $anchor = $(this)
      $('html, body').stop().animate({
          scrollTop: $($anchor.attr('href')).offset().top - 50
      }, 1500, 'easeInOutExpo')
    })
  }     

  render() {

    return (
      <div id="home" className="ui inverted vertical masthead center aligned segment">
        <div className="ui container">
          <div className="ui large secondary inverted pointing menu">
            <a className="toc item" onClick={this.props.toggleSidebarVisibility}>
              <i className="sidebar icon"></i>
            </a> 

            <div className="left menu">
              <ActiveLink activeOnlyWhenExact to="#home" label={T.translate("landing.home.header")} />
              <ActiveLink activeOnlyWhenExact to="#features" label={T.translate("landing.features.header")} />
              <ActiveLink activeOnlyWhenExact to="#clients" label={T.translate("landing.clients.header")} />
              <ActiveLink activeOnlyWhenExact to="#testimonials" label={T.translate("landing.testmonial.header")} />
              <ActiveLink activeOnlyWhenExact to="#pricing" label={T.translate("landing.pricing.header")} />
              <ActiveLink activeOnlyWhenExact to="#contacts" label={T.translate("landing.contacts.header")} />
            </div>

            <div className="right item">                                                   
              <Link className="ui inverted button"  to="/subdomain">{T.translate("log_in.log_in")}</Link> 
              <a href={`${process.env.SERVER_PROTOCOL}${process.env.SERVER_HOST}/signup`} className="ui inverted button">{T.translate("sign_up.sign_up")}</a>     
            </div>  
          </div>
        </div>

        <div className="ui text container">
          <h1 className="ui inverted header">
            {T.translate("landing.home.welcome")}&nbsp;
            <div className="turquoise d-inline">{T.translate("internal_navigation.toolsio")}</div>
          </h1>
          <h3>{T.translate("landing.home.slogan")}</h3>
          <a href={`${process.env.SERVER_PROTOCOL}${process.env.SERVER_HOST}/signup`} className="ui huge primary button">{T.translate("landing.home.get_started")}<i className="right arrow icon"></i></a>
        </div>
      </div>)
  }  
}

export default LandingPageHeaderNav
