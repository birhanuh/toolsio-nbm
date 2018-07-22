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
import { Input, Form, Dimmer, Image } from 'semantic-ui-react'
import { Image as CloudinaryImage } from 'cloudinary-react'
import classnames from 'classnames'
import { graphql, compose } from 'react-apollo'
import { GET_USER_BY_EMAIL_QUERY, UPDATE_USER_MUTATION, S3_SIGN_AVATAR_MUTATION } from '../../graphql/settings'

// Localization 
import T from 'i18n-react'

import moment from 'moment'

// Avatar placeholder
import avatarPlaceholderLarge from '../../images/avatar-placeholder-large.png'

class UserForm extends Component {
  
  constructor(props) {
    super(props)
    this.state = {    
      firstName: this.props.data.getUserByEmail ? this.props.data.getUserByEmail.firstName : '',
      lastName: this.props.data.getUserByEmail ? this.props.data.getUserByEmail.lastName : '',
      email: this.props.data.getUserByEmail ? this.props.data.getUserByEmail.email : '',
      password: '',
      confirmPassword: '',
      avatarUrl: this.props.data.getUserByEmail ? this.props.data.getUserByEmail.avatarUrl : '',
      file: null,
      errors: {},
      active: false,
      isLoadingAvatar: false,
      isLoadingForm: false
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.data.getUserByEmail) {
      this.setState({
        firstName: nextProps.data.getUserByEmail.firstName,
        lastName: nextProps.data.getUserByEmail.lastName,
        email: nextProps.data.getUserByEmail.email,
        avatarUrl: nextProps.data.getUserByEmail.avatarUrl,
      })
    }
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
            this.setState({ isLoadingForm: false })
          } else {
            let errorsList = {}
            errors.map(error => errorsList[error.path] = error.message)
            this.setState({ errors: errorsList, isLoadingForm: false })
          }
        })
        .catch(err => this.setState({ errors: err, isLoadingForm: false }))
    }  
  }

  uploadToServer = async (public_id) => {

    this.setState({
      avatarUrl: public_id
    })

    const { email, avatarUrl } = this.state

    this.props.updateUserMutation({ variables: { email, avatarUrl } })
      .then((res) => {
        const { success, errors } = res.data.updateUser     
              
        if (success) {
          this.props.addFlashMessage({
            type: 'success',
            text: T.translate("settings.user.flash.success_update")
          })
          this.setState({ isLoadingAvatar: false, file: null, active: false })
        } else {
          let errorsList = {}
          errors.map(error => errorsList[error.path] = error.message)
          this.setState({ errors: errorsList, isLoadingAvatar: false })
        }
      })
      .catch(err => this.setState({ errors: err, isLoadingAvatar: false }))
    
  }

  formatFileName = filename => {
    const date = moment().format("DDMMYYYY")
    const randomString = Math.random()
      .toString(36)
      .substring(2, 7)
    const cleanFileName = filename.toLowerCase().replace(/[^a-z0-9]/g, "-")
    const newFileName = `avatars/${date}-${randomString}-${cleanFileName}`
    return newFileName.substring(0, 60)
  }

  handleOnDrop = async files => {

    this.setState({
      'file': files[0],
      'active': true
    })
  }

  handleSubmitImage = async () => {
    const { file } = this.state
    let response
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', process.env.CLOUDINARY_PRESET_AVATARS)

      this.setState({ isLoadingAvatar: true })

      response = await axios.post(process.env.CLOUDINARY_API_URL_IMAGE, formData)
      const { public_id } = response.data
      await this.uploadToServer(public_id)
    } else {
      this.props.addFlashMessage({
        type: 'error',
        text: T.translate("settings.user.flash.upload_first")
      })
    }
  }

  toggleShow = () => this.setState(state => ({ active: !state.active }))

  render() {
    const { firstName, lastName, avatarUrl, password, confirmPassword, errors, active, file, isLoadingAvatar, isLoadingForm } = this.state
    
    return (            
      <div className="ui items segment user">
        <div className="ui item">    
          <div className="image">
            <div className={classnames("ui card circular image form", { loading: isLoadingAvatar })} style={{height: "175px"}}>
              <Dimmer.Dimmable 
                onMouseEnter={this.toggleShow}
                onMouseLeave={this.toggleShow}
                blurring
              >
                {avatarUrl ? <CloudinaryImage cloudName="toolsio" publicId={avatarUrl} width="175" height="175" crop="thumb" /> : 
                  <Image size="medium" src={avatarPlaceholderLarge} alt="avatarPlaceholderLarge" /> }
                <Dimmer
                  active={file ? true : active}
                >
                  {file ? <small className="ui inverted">{file.name}</small> : 
                    <Dropzone onDrop={this.handleOnDrop.bind(this)} multiple={false} className="ignore ui inverted button" >
                      {T.translate("settings.user.select_avatar")}
                    </Dropzone>
                  }
                </Dimmer>  
              </Dimmer.Dimmable>
            </div>

            <button disabled={isLoadingAvatar} onClick={this.handleSubmitImage.bind(this)} className="fluid ui primary button"><i className="upload icon" aria-hidden="true"></i>&nbsp;{T.translate("settings.user.upload")}</button>
           
          </div>
          <div className="content">                
            <h1 className="ui header mt-2 mb-3">{T.translate("settings.user.header")}</h1> 

            <input type="hidden" value="prayer" />
            <Form loading={isLoadingForm} onSubmit={this.handleSubmit.bind(this)} autoComplete="off">
           
              { !!errors.message && (typeof errors.message === "string") && <div className="ui negative message"><p>{errors.message}</p></div> } 
              
              <Form.Field>
                <label>{T.translate("settings.user.first_name")}</label>
                <Input
                  placeholder={T.translate("settings.user.first_name")}
                  name="firstName" 
                  value={firstName} 
                  onChange={(e, {value}) => this.handleChange('firstName', value)}
                  autoComplete="off"  
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
                  autoComplete="off"  
                />
                <span className="red">{errors.lasttName}</span>
              </Form.Field>

              <Form.Field error={!!errors.password}>
                <label>{T.translate("settings.user.password")}</label>
                <Input
                  placeholder={T.translate("settings.user.password")}
                  name="password" 
                  value={password} 
                  onChange={(e, {value}) => this.handleChange('password', value)}
                  autoComplete="new-password"
                  type='password'
                  error={!!errors.password}
                />
                <span className="red">{errors.password}</span>
              </Form.Field>

              <Form.Field error={!!errors.confirmPassword}>
                <label>{T.translate("settings.user.confirm_password")}</label>
                <Input
                  placeholder={T.translate("settings.user.confirm_password")}
                  name="confirmPassword" 
                  value={confirmPassword} 
                  onChange={(e, {value}) => this.handleChange('confirmPassword', value)}
                  autoComplete="new-password"
                  type='password'
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
