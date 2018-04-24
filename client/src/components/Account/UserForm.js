import React, { Component } from 'react' 
import PropTypes from 'prop-types'
require('babel-polyfill')
import { connect } from 'react-redux'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Dropzone from 'react-dropzone'
import { Validation } from '../../utils'
import { addFlashMessage } from '../../actions/flashMessageActions'
import { InputField } from '../../utils/FormFields'
import classnames from 'classnames'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

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

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
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
      
      const { user } = this.state
      // Make submit
      this.props.updateUser({ user})
        .then((res) => {
          this.props.addFlashMessage({
            type: 'success',
            text: T.translate("settings.user.flash.success_update")
          })
        },
        ({ response }) => this.setState({ errors: response.data.errors, isLoadingForm: false })
      )
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
        .then((res) => {
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
    const { id, file } = this.state
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

              <form className={classnames("ui large form", { loading: isLoadingForm })} onSubmit={this.handleSubmit.bind(this)}>
             
                { !!errors.message && (typeof errors.message === "string") && <div className="ui negative message"><p>{errors.message}</p></div> } 
                
                <InputField
                  id='firstName'
                  label={T.translate("settings.user.first_name")}
                  name="firstName" 
                  value={firstName} 
                  onChange={this.handleChange.bind(this)} 
                  placeholder={T.translate("settings.user.first_name")}
                  error={errors && errors.firstName}
                  formClass="field"
                />
                <InputField
                  id='lastName'
                  label={T.translate("settings.user.last_name")}
                  name="lastName" 
                  value={lastName} 
                  onChange={this.handleChange.bind(this)} 
                  placeholder={T.translate("settings.user.last_name")}
                  error={errors && errors.lastName}
                  formClass="field"
                />
                <InputField
                  type="email"
                  name="email" 
                  value={email} 
                  id='email'
                  label={T.translate("settings.user.email")}
                  onChange={this.handleChange.bind(this)} 
                  placeholder={T.translate("settings.user.email")}
                  error={errors && errors.email}
                  formClass="field"
                />
                <InputField
                  type="password"
                  name="password" 
                  value={password} 
                  id="password"
                  label={T.translate("settings.user.password")}
                  onChange={this.handleChange.bind(this)} 
                  placeholder={T.translate("settings.user.password")}
                  error={errors && errors.password}
                  formClass="field"
                />
                <InputField
                  type="password"
                  name="confirmPassword" 
                  value={confirmPassword} 
                  id="confirmPassword"
                  label={T.translate("settings.user.confirm_password")}
                  onChange={this.handleChange.bind(this)} 
                  placeholder={T.translate("sign_up.confirm_password")}
                  error={errors && errors.confirmPassword}
                  formClass="field"
                /> 

                <div className="field">  
                  <Link className="ui primary outline button" to="/dashboard">
                    <i className="minus circle icon"></i>
                    {T.translate("settings.user.cancel")}
                  </Link>  
                  <button disabled={isLoadingForm} className="ui primary button"><i className="check circle outline icon" aria-hidden="true"></i>&nbsp;{T.translate("settings.user.edit")}</button>
                </div>  
              </form>       

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

const getUserQuery = gql`
  query getUser($email: String!) {
    getUser(email: $email) {
      id
      firstName
      lastName
      email
      avatarUrl
      isAdmin
    }
  }
`

const updateUserMutation = gql`
  mutation updateUser($firstName: String!, $lastName: String, $email: String!, $avatarUrl: String) {
    updateUser(firstName: $firstName, lastName: $lastName, email: $email, avatarUrl: $avatarUrl) {
      success
      user {
        id
        email
      }
      errors {
        path
        message
      }
    }
  }
`

const s3SignAvatarMutation = gql`
  mutation s3SignAvatar($fileName: String!, $fileType: String!) {
    s3SignAvatar(fileName: $fileName, fileType: $fileType) {
      signedRequest
      url
      errors
    }
  }
`

const MutationQuery =  compose(
  graphql(updateUserMutation, {
    name : 'updateUserMutation',
    options: (props) => ({
      variables: {
        subdomain: props.subdomain
      },
    })
  }),
  graphql(s3SignAvatarMutation, {
    name : 's3SignAvatarMutation'
  }),
  graphql(getUserQuery, {
    options: (props) => ({
      variables: {
        email: props.email
      },
    })
  })
)(UserForm)

export default connect(null, { addFlashMessage } ) (MutationQuery)
