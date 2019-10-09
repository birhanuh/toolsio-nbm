import React, { PureComponent } from "react";
import { Link } from "react-router-dom";

// Semantic UI React
import { Segment, Container, Menu, Header, Icon } from "semantic-ui-react";

// Localization
import T from "i18n-react";

/* jQuery */
import $ from "jquery";
$.animate = require("jquery.easing");
$.fn.transition = require("semantic-ui-transition");
$.fn.visibility = require("semantic-ui-visibility");

class LandingPageHeaderNav extends PureComponent {
  componentDidMount = () => {
    // fix menu when passed
    $("#home .ui.text.container").visibility({
      once: false,
      onBottomPassed: function() {
        $(".fixed.menu").transition("fade in");
      },
      onBottomPassedReverse: function() {
        $(".fixed.menu").transition("fade out");
      }
    });

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $(".ui.menu .nav-link a").on("click", function(event) {
      event.preventDefault();
      var $anchor = $(this);
      $("html, body")
        .stop()
        .animate(
          {
            scrollTop: $($anchor.attr("href")).offset().top - 50
          },
          1500,
          "easeInOutExpo"
        );
    });
  };

  render() {
    const InlineStyle = () => (
      <style>{`
        .sixteen.wide.column.flash-message {
          position: absolute;
          top: 100px;
          left: 15%;
          width: 70%;
      }
      `}</style>
    );

    return (
      <Segment
        id="home"
        inverted
        textAlign="center"
        style={{ minHeight: 600, padding: "1em 0em" }}
        vertical
      >
        <Container>
          {/* Inline style */}
          <InlineStyle />

          <Menu inverted pointing secondary size="large">
            <Menu.Item
              className="toc"
              onClick={this.props.toggleOuterSidebarVisibility}
            >
              <Icon name="sidebar" />
            </Menu.Item>

            <Menu.Item position="left" className="nav-link">
              <Link className="item" to={{ pathname: "#home" }}>
                {T.translate("landing.home.header")}
              </Link>
              <Link className="item" to={{ pathname: "#features" }}>
                {T.translate("landing.features.header")}
              </Link>
              <Link className="item" to={{ pathname: "#clients" }}>
                {T.translate("landing.clients.header")}
              </Link>
              <Link className="item" to={{ pathname: "#testimonial" }}>
                {T.translate("landing.testimonial.header")}
              </Link>
              <Link className="item" to={{ pathname: "#pricing" }}>
                {T.translate("landing.pricing.header")}
              </Link>
              <Link className="item" to={{ pathname: "#contacts" }}>
                {T.translate("landing.contacts.header")}
              </Link>
            </Menu.Item>

            <Menu.Item position="right" style={{ alignSelf: "inherit" }}>
              <Link className="ui inverted button" to="/subdomain">
                {T.translate("log_in.log_in")}
              </Link>
              <a
                href={`${process.env.CLIENT_PROTOCOL}${process.env.CLIENT_HOST}/signup`}
                className="ui inverted button"
                style={{ marginLeft: "0.5em" }}
              >
                {T.translate("sign_up.sign_up")}
              </a>
            </Menu.Item>
          </Menu>
        </Container>

        <Container text>
          <Header
            inverted
            style={{
              fontSize: "4em",
              fontWeight: "normal",
              marginBottom: 0,
              marginTop: "2.5em"
            }}
          >
            {T.translate("landing.home.welcome")}&nbsp;
            <div className="turquoise d-inline">
              {T.translate("internal_navigation.toolsio")}
            </div>
          </Header>
          <h3>{T.translate("landing.home.slogan")}</h3>
          <a
            href={`${process.env.CLIENT_PROTOCOL}${process.env.CLIENT_HOST}/signup`}
            className="ui huge primary button"
          >
            {T.translate("landing.home.get_started")}
            <i className="right arrow icon" />
          </a>
        </Container>
      </Segment>
    );
  }
}

export default LandingPageHeaderNav;
