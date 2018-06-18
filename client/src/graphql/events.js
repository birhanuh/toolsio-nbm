import gql from 'graphql-tag'

export const GET_EVENTS_QUERY = gql`
  query getEvents {
    getEvents {
      id
      title
      description
      title
      start    
      end
    }
  }
`

export const GET_EVENT_QUERY = gql`
  query getEvent($id: Int!) {
    getEvent(id: $id) {
      id
      title
      description
      title
      start
      end
    }
  }
`

export const CREATE_EVENT_MUTATION = gql`
  mutation createEvent($title: String!, $description: String, $url: String, $start: Date!, $end: Date) {
    createEvent(title: $title, description: $description, url: $url, start: $start, end: $end) {
      success
      event {
        id
        title
        description
        url
        start
        end
      }
      errors {
        path
        message
      }
    }
  }
`
export const UPDATE_EVENT_MUTATION = gql`
  mutation updateEvent($id: Int!, $title: String, $description: String!, $url: String, $start: Date, $end: Date) {
    updateEvent(id: $id, title: $title, description: $description, url: $url, start: $start, end: $end) {
      success
      event {
        id
        title
        description
        url
        start
        end
      }
      errors {
        path
        message
      }
    }
  }
`

export const DELETE_EVENT_MUTATION = gql`
  mutation deleteEvent($id: Int!) {
    deleteEvent(id: $id) {
      success
      errors {
        path
        message
      }
    }
  }
`