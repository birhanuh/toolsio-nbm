import React, { Component } from 'react' 
import { Link } from 'react-router-dom'
import classnames from 'classnames'
// Semantic UI Form elements
import { Button, Label, Modal } from 'semantic-ui-react'
import { graphql } from 'react-apollo'
import { GET_CHANNELS_USERS_COUNT_QUERY } from '../../../graphql/conversations/channels'

// Localization 
import T from 'i18n-react'

// jQuery
import $ from 'jquery'

// Downshift
import FormChannel from './Form/Channel'

const AddChannelModal = ({ open, onClose, toggleCreateChannelModal }) => (
  <Modal
    size='small'
    className="add-channel"
    open={open}
    onClose={(e) => {
      onClose(e)
    }}
  >
    <Modal.Header>{T.translate("conversations.form.create_channel")}</Modal.Header>
    <Modal.Content>
      <FormChannel onClose={onClose} toggleCreateChannelModal={toggleCreateChannelModal} />
    </Modal.Content>
    <Modal.Actions>
      <Button
        onClick={(e) => {
          onClose(e)
        }}
      >
        {T.translate("conversations.form.cancel")}
      </Button>
     </Modal.Actions>
  </Modal>
)

class List extends Component {

  state = {
    openCreateChannelModal: false
  }

  componentDidMount() {

    $('.ui .item').on('click', function() {
      $('.ui .item').removeClass('active')
      $(this).addClass('active')
    })   

  }

  toggleCreateChannelModal = (e) => {
    if (e) {
      e.preventDefault()  
    }
    
    this.setState(state => ({ openCreateChannelModal: !state.openCreateChannelModal }))
  }

  render() {    
    const { openCreateChannelModal } = this.state
    const { data: { getChannelsUsersCount }, channelId } = this.props

    const channelList = getChannelsUsersCount && getChannelsUsersCount.map(channel => 
      <Link key={channel.id} to={`/conversations/channel/${channel.id}`} 
        className={classnames('item', {active: channelId && parseInt(channelId) === channel.id})}>
        
        <Label className="blue">
          {T.translate("conversations.channel.members")}
          <div className="detail">{channel.usersCount}</div>
        </Label>

        <div>
          <i className="bullhorn icon"></i>&nbsp;
          {channel.name}
        </div>
      </Link>
    )

    return [
      <div key="create-channel" className="ui center aligned vertical segment">
        <button className="ui primary small button" onClick={this.toggleCreateChannelModal.bind(this)}>
          <i className="add circle icon"></i>
          {T.translate("conversations.page.create_channel")}
        </button>
      </div>,

      channelList,

      <AddChannelModal
        onClose={this.toggleCreateChannelModal.bind(this)}
        open={openCreateChannelModal}
        toggleCreateChannelModal={this.toggleCreateChannelModal}
        key="add-channel-modal"
      />
    ]
  }
}

export default graphql(GET_CHANNELS_USERS_COUNT_QUERY)(List)



