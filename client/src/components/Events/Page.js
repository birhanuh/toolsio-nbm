// import React...
import React, { Component } from 'react'

import 'fullcalendar'

import $ from 'jquery'

import 'fullcalendar/dist/fullcalendar.min.css'

import FromPage from './FormPage'

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: null,
      end: null,
      openConfirmationModal: false,
      events:[
        {
          title: 'All Day Event',
          url: 'http://google.com/',
          start: '2018-06-01'
        },
        {
          title: 'Long Event',
          description: 'This is a cool event',
          start: '2018-06-07',
          end: '2018-06-10'
        },
        {
          id: 999,
          title: 'Repeating Event',
          start: '2018-06-09T16:00:00'
        },
        {
          id: 999,
          title: 'Repeating Event',
          start: '2018-06-16T16:00:00'
        },
        {
          title: 'Conference',
          start: '2018-07-11',
          end: '2018-07-13'
        },
        {
          title: 'Meeting',
          start: '2018-07-12T10:30:00',
          end: '2018-07-12T12:30:00'
        },
        {
          title: 'Birthday Party',
          start: '2018-07-13T07:00:00'
        },
        {
          title: 'Click for Google',
          url: 'http://google.com/',
          start: '2018-07-28'
        }
      ],    
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
      events: this.state.events,
      // put your options and callbacks here
      // dayClick: function(date, jsEvent, view) {
      //   console.log('clicked on ' + date.format())
      // },
      select: ( start, end, jsEvent, view) => {
        this.setState(state => ({ start, end }))
        this.toggleConfirmationModal()
        console.log('select start' + start)
        console.log('select end' +end)
      },
      eventDragStart: (event, jsEvent, ui, view) => {
        console.log('eventDragStart date ' + event)
        console.log('eventDragStart envet' + jsEvent)
      },
      eventDragStop: (event, jsEvent, ui, view) => {
        console.log('eventDragStop date ' + event)
        console.log('eventDragStop envet' + jsEvent)
      }
    })
  }

  toggleConfirmationModal = () => {    
    this.setState(state => ({ openConfirmationModal: !state.openConfirmationModal }))
  }

  render() {
     const { start, end, openConfirmationModal } = this.state

    return [
        <div key="segment" className="row column"> 
          <div className="twelve wide column centered grid">
            <div className="ui segment">
              <div id="calendar"></div>
            </div>
          </div>
        </div>,      
        <div key='form-page'>{ start && end && <FromPage start={start} end={end} openConfirmationModal={openConfirmationModal} toggleConfirmationModal={this.toggleConfirmationModal} /> }</div> 
      ]
  }
}

export default Page
