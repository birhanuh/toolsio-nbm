// import React...
import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { GET_EVENTS_QUERY, DELETE_EVENT_MUTATION } from '../../graphql/events'

import 'fullcalendar'

import $ from 'jquery'

import 'fullcalendar/dist/fullcalendar.min.css'

import FromPage from './FormPage'

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
    }
  }

  componentWillReceiveProps = (nextProps) => {  
    if (nextProps) {
      this.setState({
        events: nextProps.data.getEvents
      })
      // Remove previous events and re-fetch manually by adding event source
      $("#calendar").fullCalendar('removeEvents')
      $('#calendar').fullCalendar('addEventSource', {
        events: nextProps.data.getEvents
      })
    }
  }

  componentDidMount = () => {    
   
    $('#calendar').fullCalendar({
      themeSystem: 'standard',
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
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
      select: ( start, end ) => {
        this.setState(({ start, end, id: null, title: "", description: "", url: "" }))
        this.toggleConfirmationModal() 
        console.log('jsEvent ', jsEvent)
        console.log('view ', view)
      },
      eventClick: (event) => {
        this.setState(({ start: event.start, end: event.end, id: event.id, title: event.title, description: event.description, url: event.url }))
        this.toggleConfirmationModal()
     
        // event.title = "CLICKED!"
        // $('#calendar').fullCalendar('updateEvent', event)
      }
    })
  }

  toggleConfirmationModal = () => {    
    this.setState(state =>({ openConfirmationModal: !state.openConfirmationModal }))
  }

  render() {
    const { start, end, id, title, description, url, openConfirmationModal } = this.state

    return [
        <div key="segment" className="row column"> 
          <div className="twelve wide column centered grid">
            <div className="ui segment">
              <div id="calendar"></div>
            </div>
          </div>
        </div>,      
        <FromPage key="form-page" start={start} end={end} id={id} title={title} description={description} url={url} openConfirmationModal={openConfirmationModal}  toggleConfirmationModal={this.toggleConfirmationModal} /> 
      ]
  }
}

const Queries =  compose(
  graphql(DELETE_EVENT_MUTATION, {
    name: 'deleteProjectMutation'
  }),
  graphql(GET_EVENTS_QUERY)
)(Page)

export default Queries

