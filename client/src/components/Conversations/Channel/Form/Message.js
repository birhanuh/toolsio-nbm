import React, { Component } from 'react' 
import Dropzone from 'react-dropzone'
// Semantic UI Form elements
import { Form, Icon } from 'semantic-ui-react'
import { graphql } from 'react-apollo'
import { CREATE_CHANNEL_MESSAGE_MUTATION } from '../../../../graphql/conversations/channelMessages'

// Localization 
import T from 'i18n-react'

const ENTER_KEY = 13

class Message extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      channelId: this.props.channelId ? this.props.channelId: null,
      body: '',
      errors: {},
      isLoading: false
    }
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (nextProps.channelId) {
      this.setState({
        channelId: nextProps.channelId
      })
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = (e) => {
    const { body } = this.state
    
    // Validation
    if (e.keyCode === ENTER_KEY) { 
      if (!body.trim()) { 
        return
      } else {
        const { channelId, body } = this.state

        this.setState({ isLoading: true })

        this.props.mutate({ 
          variables: { body, channelId: parseInt(channelId) }
          })
          .then(res => {
            const { success, errors } = res.data.createChannelMessage

            if (success) {
              // Rest message state
              this.setState({
                "body": ''
              })

              // Reset reload
              this.setState({ isLoading: false })
            } else {
              let errorsList = {}
              errors.map(error => errorsList[error.path] = error.message)

              this.setState({ errors: errorsList, isLoading: false })
            }
          })
          .catch(err => this.setState({ errors: err, isLoading: false }))
      }
    }
  }

  handleOnDrop = async ([file]) => {
    const { channelId } = this.state
    this.setState({ isLoading: true })
       
    await this.props.mutate({ 
      variables: { file, channelId: parseInt(channelId) },
      })
      .then(res => {       

        const { success, errors } = res.data.createChannelMessage

        if (success) {
          // Reset reload
          this.setState({ isLoading: false })
        } else {
          let errorsList = {}
          errors.map(error => errorsList[error.path] = error.message)

          this.setState({ errors: errorsList, isLoading: false })
        }
      })
      .catch(err => this.setState({ errors: err, isLoading: false }))
  }

  render() {
    const { body, errors, isLoading } = this.state

    return (  
      <Form loading={isLoading} className='pt-5'>
        { !!errors.message && <Message><p>{errors.message}</p></Message> }
        
        <div className="ui fluid action input" style={{marginRight: '10px'}}>
          <Dropzone onDrop={this.handleOnDrop.bind(this)} multiple={false} className="ignore ui primary button">
            <Icon name="plus" />  
          </Dropzone>        
          
          <Form.TextArea
            placeholder={T.translate("conversations.form.message")}
            name="body" 
            value={body} 
            onChange={this.handleChange.bind(this)} 
            onKeyDown={this.handleSubmit.bind(this)}
            rows="2"
          />                 
        </div>   
      </Form> 
    )
  }
}

export default graphql(CREATE_CHANNEL_MESSAGE_MUTATION)(Message)

