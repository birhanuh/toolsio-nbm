// import React...
import React from 'react'

// ... and fullcalendar-reactwrapper.
import 'fullcalendar'

import $ from 'jquery'

import 'fullcalendar/dist/fullcalendar.min.css'

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      eventRender: function(event, element) {
        element.qtip({
          content: event.description
        });
      },
      // put your options and callbacks here
      // dayClick: function(date, jsEvent, view) {
      //   console.log('clicked on ' + date.format())
      // },
      select: function( start, end, jsEvent, view) {
        console.log('select start' + start.format())
        console.log('select end' +end.format())
      },
      eventDragStart: function(event, jsEvent, ui, view) {
        console.log('eventDragStart date ' + event)
        console.log('eventDragStart envet' + jsEvent)
      },
      eventDragStop: function(event, jsEvent, ui, view) {
        console.log('eventDragStop date ' + event)
        console.log('eventDragStop envet' + jsEvent)
      }
    })
  }

  render() {
    return (
      <div className="row column"> 
        <div className="twelve wide column centered grid">
          <div className="ui segment">
            <div id="calendar"></div>
          </div>
        </div>
      </div>)
  }
}

export default Page
