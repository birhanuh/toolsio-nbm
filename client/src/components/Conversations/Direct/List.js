import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

// Localization 
import T from 'i18n-react'

// jQuery
import $ from 'jquery'

class List extends Component {

  componentDidMount() {

    $('.ui .item').on('click', function() {
      $('.ui .item').removeClass('active')
      $(this).addClass('active')
    })   

  }

  render() {
    
    const { data: { getUsers }, receiverId } = this.props
    console.log('getUsers ', receiverId)
    const receiverList = getUsers && getUsers.map(receiver => 
      <Link key={receiver.id} to={`/conversations/receiver/${receiver.id}`} 
        className={classnames('item', {active: receiverId && parseInt(receiverId) === receiver.id})}>

        <div>
          <i className="user icon"></i>&nbsp;
          {receiver.firstName}
        </div>
      </Link>
    )

    return (
      <div>

        {receiverList}

      </div>
    )
  }
}

const getUsersQuery = gql`
  {
    getUsers {
      id
      firstName
      email 
    }
  }
`
export default graphql(getUsersQuery)(List)



