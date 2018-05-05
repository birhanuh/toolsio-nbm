import React, { Component } from 'react' 
import PropTypes from 'prop-types'
require('babel-polyfill')
import { connect } from 'react-redux'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Dropzone from 'react-dropzone'
import { Validation } from '../../utils'
import { addFlashMessage } from '../../actions/flashMessageActions'
// Semantic UI Form elements
import { Input, Form } from 'semantic-ui-react'
import classnames from 'classnames'
import { graphql, compose } from 'react-apollo'
import { GET_USER_BY_EMAIL_QUERY, UPDATE_USER_MUTATION, S3_SIGN_AVATAR_MUTATION } from '../../queries/accountQueriesMutations'

// Localization 
import T from 'i18n-react'

import $ from 'jquery'

import moment from 'moment'

// Modal
$.fn.dimmer = require('semantic-ui-dimmer')

// Images
import avatarPlaceholderSmall from '../../images/avatar-placeholder-small.png'

class UserForm extends Component {
  
  constructor(props) {
    super(props)
    this.state = {    
      firstName: this.props.data.getUser ? this.props.data.getUser.firstName : '',
      lastName: this.props.data.getUser ? this.props.data.getUser.lastName : '',
      email: this.props.data.getUser ? this.props.data.getUser.email : '',
      password: '',
      confirmPassword: '',
      avatarUrl: this.props.data.getUser ? this.props.data.getUser.avatarUrl : '',
      file: null,
      errors: {},
      isLoadingLogo: false,
      isLoadingForm: false
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.data.getUser) {
      this.setState({
        firstName: nextProps.data.getUser.firstName,
        lastName: nextProps.data.getUser.lastName,
        email: nextProps.data.getUser.email,
        avatarUrl: nextProps.data.getUser.avatarUrl,
      })
    }
  }

  componentDidMount() {
    
    $('.ui.card .image').dimmer({
      on: 'hover'
    })
  }

  handleChange = (name, value) => {
    if (this.state.errors[name]) {
      // Clone errors form state to local variable
      let errors = Object.assign({}, this.state.errors)
      delete errors[name]

      this.setState({
        [name]: value,
        errors
      })
    } else {
      this.setState({
        [name]: value
      })
    }
  }

  isValid() {
    const { errors, isValid } = Validation.validateUserInput(this.state)

    let updatedErrors = Object.assign({}, this.state.errors)
    updatedErrors = errors

    if (!isValid) {
      this.setState({ errors: updatedErrors })
    }

    return isValid;
  }

  handleSubmit(e) {
    e.preventDefault()

    if (this.isValid()) { 
      // Empty errros state for each submit
      this.setState({ errros: {}, isLoadingForm: true })
      
      const { firstName, lastName, email, password, confirmPassword, avatarUrl } = this.state
      // Make submit
      this.props.updateUserMutation({ variables: { firstName, lastName, email, password, confirmPassword, avatarUrl } })
        .then((res) => {

          const { success, errors } = res.data.updateUser
           
          if (success) {
            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("settings.user.flash.success_update")
            })
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

  // Save File to S3
  uploadAvatar = (signedRequest, file, options) => {
    return axios.put(signedRequest, file, options)
  }

  uploadToS3 = async (url, file, signedRequest) => {

    const options = {
      headers: {
        "Content-Type": file.type
      }
    }
    
    const uploadAvatarResponse = await this.uploadAvatar(signedRequest, file, options)

    if (uploadAvatarResponse.status === 200) {
      this.setState({
        avatarUrl: url
      })

      const { id, avatarUrl } = this.state

      this.setState({ isLoadingAvatar: true })
      this.props.updateUser({ id, avatarUrl})
        .then(() => {
          this.props.addFlashMessage({
            type: 'success',
            text: T.translate("settings.user.flash.success_update")
          })
          this.setState({ isLoadingAvatar: false })
        },
        ({ response }) => this.setState({ errors: response.data.errors, isLoadingForm: false })
      )
    }
  }

  formatFileName = filename => {
    const date = moment().format("DDMMYYYY")
    const randomString = Math.random()
      .toString(36)
      .substring(2, 7)
    const cleanFileName = filename.toLowerCase().replace(/[^a-z0-9]/g, "-")
    const newFileName = `avatarUrls/${date}-${randomString}-${cleanFileName}`
    return newFileName.substring(0, 60)
  }

  handleOnDrop = async files => {

    this.setState({
      'file': files[0]
    })
  }

  handleSubmitImage = async () => {
    const { file } = this.state
    const response = await this.props.s3SignAvatarMutation({
      variables: {
        fileName: this.formatFileName(file.name),
        fileType: file.type
      }
    })

    const { signedRequest, url } = response.data.s3SignAvatar
    await this.uploadToS3(url, file, signedRequest)
  }

  render() {

    const { firstName, lastName, email, avatarUrl, password, confirmPassword, errors, isLoadingAvatar, isLoadingForm } = this.state
  
    return (            

      <div className="twelve wide column"> 
        <div className="ui items segment user">
          <div className="ui item">    
            <div className="image">
              <div className={classnames("ui card circular image form", { loading: isLoadingAvatar })}>
                <div className="blurring dimmable image">
                  <div className="ui dimmer">
                    <div className="content">
                      <div className="center">
                        <Dropzone onDrop={this.handleOnDrop.bind(this)} multiple={false} className="ignore ui inverted button">
                          {T.translate("settings.user.select_avatar")}
                        </Dropzone>
                      </div>
                    </div>
                  </div>
                  <img src={avatarPlaceholderSmall} alt="avatar-placeholder-small" />
                </div>
              </div>

              <button disabled={isLoadingAvatar} onClick={this.handleSubmitImage.bind(this)} className="fluid ui primary button"><i className="upload icon" aria-hidden="true"></i>&nbsp;{T.translate("settings.user.upload")}</button>
             
            </div>
            <div className="content">                
              <h1 className="ui header mt-2 mb-3">{T.translate("settings.user.header")}</h1> 

              <Form loading={isLoadingForm} onSubmit={this.handleSubmit.bind(this)}>
             
                { !!errors.message && (typeof errors.message === "string") && <div className="ui negative message"><p>{errors.message}</p></div> } 
                
                <Form.Field>
                  <label>{T.translate("settings.user.first_name")}</label>
                  <Input
                    placeholder={T.translate("settings.user.first_name")}
                    name="firstName" 
                    value={firstName} 
                    onChange={(e, {value}) => this.handleChange('firstName', value)} 
                    error={!!errors.firstName}
                  />
                  <span className="red">{errors.firstName}</span>
                </Form.Field>

                <Form.Field>
                  <label>{T.translate("settings.user.last_name")}</label>
                  <Input
                    placeholder={T.translate("settings.user.last_name")}
                    name="lasttName" 
                    value={lastName} 
                    onChange={(e, {value}) => this.handleChange('lasttName', value)} 
                    error={!!errors.lasttName}
                  />
                  <span className="red">{errors.lasttName}</span>
                </Form.Field>

                <Form.Field>
                  <label className={classnames({red: !!errors.email})}>{T.translate("settings.user.email")}</label>
                  <Input
                    placeholder={T.translate("settings.user.email")}
                    name="email" 
                    value={email} 
                    onChange={(e, {value}) => this.handleChange('email', value)} 
                    error={!!errors.email}
                  />
                  <span className="red">{errors.email}</span>
                </Form.Field>

                <Form.Field>
                  <label className={classnames({red: !!errors.password})}>{T.translate("settings.user.password")}</label>
                  <Input
                    placeholder={T.translate("settings.user.password")}
                    name="password" 
                    value={password} 
                    onChange={(e, {value}) => this.handleChange('password', value)} 
                    error={!!errors.password}
                  />
                  <span className="red">{errors.password}</span>
                </Form.Field>

                <Form.Field>
                  <label className={classnames({red: !!errors.confirmPassword})}>{T.translate("settings.user.confirm_password")}</label>
                  <Input
                    placeholder={T.translate("settings.user.confirm_password")}
                    name="confirmPassword" 
                    value={confirmPassword} 
                    onChange={(e, {value}) => this.handleChange('confirmPassword', value)} 
                    error={!!errors.confirmPassword}
                  />
                  <span className="red">{errors.confirmPassword}</span>
                </Form.Field>

                <div className="field">  
                  <Link className="ui primary outline button" to="/dashboard">
                    <i className="minus circle icon"></i>
                    {T.translate("settings.user.cancel")}
                  </Link>  
                  <button disabled={isLoadingForm} className="ui primary button"><i className="check circle outline icon" aria-hidden="true"></i>&nbsp;{T.translate("settings.user.edit")}</button>
                </div>  
              </Form>      

            </div>  
          </div> 
        </div>
      </div>  
    )
  }
}

UserForm.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
}

const MutationQuery =  compose(
  graphql(UPDATE_USER_MUTATION, {
    name : 'updateUserMutation',
    options: (props) => ({
      variables: {
        subdomain: props.subdomain
      },
    })
  }),
  graphql(S3_SIGN_AVATAR_MUTATION, {
    name : 's3SignAvatarMutation'
  }),
  graphql(GET_USER_BY_EMAIL_QUERY, {
    options: (props) => ({
      variables: {
        email: props.email
      },
    })
  })
)(UserForm)

export default connect(null, { addFlashMessage } ) (MutationQuery)
