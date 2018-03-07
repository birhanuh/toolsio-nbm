import React, { Component } from 'react' 
import PropTypes from 'prop-types'
require('babel-polyfill')
import { Link } from 'react-router-dom'
import Dropzone from 'react-dropzone'
import { Validation } from '../../utils'
import { InputField } from '../../utils/FormFields'
import classnames from 'classnames'

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
      _id: this.props.user ? this.props.user._id : null,
      firstName: this.props.user ? this.props.user.firstName : '',
      lastName: this.props.user ? this.props.user.lastName : '',
      password: this.props.user ? this.props.user.password : '',
      confirmPassword: this.props.user ? this.props.user.confirmPassword : '',
      avatar: this.props.user ? this.props.user.avatar : '',
      file: '',
      errors: {
        message: {
          errors: {}
        }
      },
      isLoading: false
    }
  }
  
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.user) {
      this.setState({
        _id: nextProps.user._id,
        firstName: nextProps.user.firstName,
        lastName: nextProps.user.lastName,
        password: nextProps.user.password,
        confirmPassword: nextProps.user.confirmPassword,
        avatar: nextProps.user.avatar,
      })
    }
  }

  componentDidMount() {
     console.log('user ', this.props.user)
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
    updatedErrors.message.errors = errors

    if (!isValid) {
      this.setState({ errors: updatedErrors })
    }

    return isValid;
  }

  handleSubmit(e) {
    e.preventDefault()

    if (this.isValid()) { 
      // Empty errros state for each submit
      this.setState({ errros: {}, isLoading: true })
      
      const { user } = this.state
      // Make submit
      this.props.updateUser({ user})
        .then((res) => {
          this.props.addFlashMessage({
            type: 'success',
            text: T.translate("account.form.success_update_user")
          })
        },
        ({ response }) => this.setState({ errors: response.data.errors, isLoading: false })
      )
    }  
  }

  uploadToS3 = async (file, signedRequest) => {

    const options = {
      headers: {
        "Content-Type": file.type
      }
    }
    
    await this.props.uploadAvatar(signedRequest, file, options)
  }

  formatFileName = filename => {
    const date = moment().format("DDMMYYYY")
    const randomString = Math.random()
      .toString(36)
      .substring(2, 7)
    const cleanFileName = filename.toLowerCase().replace(/[^a-z0-9]/g, "-")
    const newFileName = `logos/${date}-${randomString}-${cleanFileName}`
    return newFileName.substring(0, 60)
  }

  handleOnDrop = async files => {

    this.setState({
      'file': files[0]
    })
  }

  handleSubmitImage = async () => {
    const { _id, file } = this.state
    const response = await this.props.s3SignAvatar(_id, {
      variables: {
        filename: this.formatFileName(file.name),
        filetype: file.type
      }
    })

    const { signedRequest, url } = response.data.result
    await this.uploadToS3(file, signedRequest)
  }

  render() {
    const { _id, firstName, lastName, avatar, password, confirmPassword, errors, isLoading } = this.state
    
    return (            

      <div className="twelve wide column"> 
        <div className="ui items segment user">
          <div className="ui item">    
            <div className="image">
              <div className="ui card circular image">
                <div className="blurring dimmable image">
                  <div className="ui dimmer">
                    <div className="content">
                      <div className="center">
                        <Dropzone onDrop={this.handleOnDrop.bind(this)} multiple={false} className="ui inverted button">
                          {T.translate("account.page.select_avatar")}
                        </Dropzone>
                      </div>
                    </div>
                  </div>
                  <img src={avatarPlaceholderSmall} alt="avatar-placeholder-small" />
                </div>
              </div>

              <button disabled={isLoading} onClick={this.handleSubmitImage.bind(this)} className="fluid ui primary button"><i className="upload icon" aria-hidden="true"></i>&nbsp;{T.translate("account.page.upload")}</button>
             
            </div>
            <div className="content">                
              <h1 className="ui header">{T.translate("account.page.user")}</h1> 

              <form className={classnames("ui large form", { loading: isLoading })} onSubmit={this.handleSubmit.bind(this)}>
             
                { !!errors.message && (typeof errors.message === "string") && <div className="ui negative message"><p>{errors.message}</p></div> } 
                
                <InputField
                  id='firstName'
                  label={T.translate("account.page.first_name")}
                  name="firstName" 
                  value={firstName} 
                  onChange={this.handleChange.bind(this)} 
                  placeholder={T.translate("account.page.first_name")}
                  formClass="field"
                />
                <InputField
                  id='lastName'
                  label={T.translate("account.page.last_name")}
                  name="lastName" 
                  value={lastName} 
                  onChange={this.handleChange.bind(this)} 
                  placeholder={T.translate("account.page.last_name")}
                  formClass="field"
                />
                <InputField
                  type="password"
                  name="password" 
                  value={password} 
                  id="password"
                  label={T.translate("account.page.password")}
                  onChange={this.handleChange.bind(this)} 
                  placeholder={T.translate("account.page.password")}
                  error={errors.message && errors.message.errors && errors.message.errors['password'] && errors.message.errors['password'].message}
                  formClass="field"
                />
                <InputField
                  type="password"
                  name="confirmPassword" 
                  value={confirmPassword} 
                  id="confirmPassword"
                  label={T.translate("account.page.confirm_password")}
                  onChange={this.handleChange.bind(this)} 
                  placeholder={T.translate("sign_up.confirm_password")}
                  error={errors.confirmPassword}
                  formClass="field"
                /> 

                <div className="field">  
                  <Link className="ui primary outline button" to="/dashboard">
                    <i className="minus circle icon"></i>
                    {T.translate("account.page.cancel")}
                  </Link>  
                  <button disabled={isLoading} className="ui primary button"><i className="check circle outline icon" aria-hidden="true"></i>&nbsp;{T.translate("account.page.edit")}</button>
                </div>  
              </form>       

            </div>  
          </div> 
        </div>
      </div>  
    )
  }
}

// Proptypes definition
UserForm.propTypes = {
  updateUser: PropTypes.func.isRequired,
  uploadAvatar: PropTypes.func.isRequired,
  s3SignAvatar: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
  user: PropTypes.object
}

// Contexttype definition
UserForm.contextTypes = {
  router: PropTypes.object.isRequired
}

export default UserForm


