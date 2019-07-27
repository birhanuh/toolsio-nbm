// import React...
import React, { Component } from "react";
// Semantic React UI
import { Grid, Segment } from "semantic-ui-react";
import { graphql, compose } from "react-apollo";
import { GET_EVENTS_QUERY, DELETE_EVENT_MUTATION } from "../../graphql/events";

import "fullcalendar";

import $ from "jquery";

import "fullcalendar/dist/fullcalendar.min.css";

import From from "./Form";

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: {},
      end: {},
      id: null,
      title: "",
      description: "",
      url: "",
      openConfirmationModal: false
    };
  }

  UNSAFE_componentWillReceiveProps = nextProps => {
    if (nextProps) {
      this.setState({
        events: nextProps.data.getEvents
      });
      // Remove previous events and re-fetch manually by adding event source
      $("#calendar").fullCalendar("removeEvents");
      $("#calendar").fullCalendar("addEventSource", {
        events: nextProps.data.getEvents
      });
    }
  };

  componentDidMount = () => {
    $("#calendar").fullCalendar({
      themeSystem: "standard",
      header: {
        left: "prev,next today",
        center: "title",
        right: "month,agendaWeek,agendaDay"
      },
      defaultDate: new Date(),
      weekNumbers: true,
      navLinks: true, // can click day/week names to navigate views
      editable: true,
      eventLimit: true, // allow "more" link when too many events
      selectable: true,
      events: this.props.data.getEvents,
      // put your options and callbacks here
      // dayClick: function(date, jsEvent, view) {
      //   console.log('clicked on ' + date.format())
      // },
      select: (start, end) => {
        this.setState({
          start,
          end,
          id: null,
          title: "",
          description: "",
          url: ""
        });
        this.toggleConfirmationModal();
      },
      eventClick: event => {
        this.setState({
          start: event.start,
          end: event.end,
          id: event.id,
          title: event.title,
          description: event.description,
          url: event.url
        });
        this.toggleConfirmationModal();

        // event.title = "CLICKED!"
        // $('#calendar').fullCalendar('updateEvent', event)
      }
    });
  };

  toggleConfirmationModal = () => {
    this.setState(state => ({
      openConfirmationModal: !state.openConfirmationModal
    }));
  };

  render() {
    const {
      start,
      end,
      id,
      title,
      description,
      url,
      openConfirmationModal
    } = this.state;

    return [
      <Grid.Row centered key="segment">
        <Grid.Column width={12}>
          <Segment>
            <div id="calendar" />
          </Segment>
        </Grid.Column>
      </Grid.Row>,
      <From
        key="form-page"
        start={start}
        end={end}
        id={id}
        title={title}
        description={description}
        url={url}
        openConfirmationModal={openConfirmationModal}
        toggleConfirmationModal={this.toggleConfirmationModal}
      />
    ];
  }
}

const Queries = compose(
  graphql(DELETE_EVENT_MUTATION, {
    name: "deleteEventMutation"
  }),
  graphql(GET_EVENTS_QUERY)
)(Page);

export default Queries;
