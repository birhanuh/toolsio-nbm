import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { isSubdomainExist } from '../../actions/authenticationActions'
import { addFlashMessage } from '../../actions/flashMessageActions'

import { Validation, Authorization } from '../../utils'

// Localization 
import T from 'i18n-react'

import logo from '../../images/logo-square.png'

class Subdomain extends Component {
  constructor(props) {
    super(props)
    this.state = {
      subdomain: '',
      errors: {
        message: {
          errors: {}
        }
      },
      isLoading: false
    }
  }

  componentDidMount = () => {
    // Fetch Sale when id is present in params
    const subdomain = Authorization.getSubdomain()
    
    if (subdomain) {
      this.setState({ errros: {}, isLoading: true })
      this.props.isSubdomainExist(subdomain).then(
        (res) => {
          this.props.addFlashMessage({
            type: 'success',
            text: 'You are on your company page, now login with your credentials!'
          })
          window.location = `http://${res.data.result.subdomain}.lvh.me:3000/login`
        },
        ({ response }) => this.setState({ errors: response.data.errors, isLoading: false })
      )  
    } 
  }
  
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  isValid() {
    const { errors, isValid } = Validation.validateSubdomainInput(this.state.subdomain)

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
      this.setState({ errros: {}, isLoading: true })
      this.props.isSubdomainExist(this.state.subdomain).then(
        (res) => {
          this.props.addFlashMessage({
            type: 'success',
            text: 'You are on your company page, now login with your credentials!'
          })
          
          if (res.data.result !== null) {
            window.location = `http://${res.data.result.subdomain}.lvh.me:3000/login`  
          } else {

            let errors = { subdomain: { message: 'There is no account with such subdomain!' } }

            let updatedErrors = Object.assign({}, this.state.errors)
            updatedErrors.message.errors = errors

            this.setState({ errors: updatedErrors })

            this.setState({ 
              isLoading: false
            })
          }          
        },
        ({ response }) => this.setState({ errors: response.data.errors, isLoading: false })
      )  
    }
  }

  render() {
    const { errors, isLoading } = this.state
   
    return (  
      <div>
        <h2 className="ui teal image header">
          <a className="" href="/">
            <img src={logo} className="image" alt="logo-square" />
          </a>
          <div className="content">
            {T.translate("log_in.subdomain.header")}
          </div>
        </h2>
        <form className="ui large form" onSubmit={this.handleSubmit.bind(this)}>
          <div className="ui stacked segment">

            { !!errors.message && (typeof errors.message === "string") && <div className="ui negative message"><p>{errors.message}</p></div> } 

            <div className={classnames("field", { error: !!errors.message && errors.message.errors && errors.message.errors.subdomain })}>
              <div className="ui right labeled input">
                <input type="text" name="subdomain" placeholder={T.translate("log_in.subdomain.subdomain")} 
                  value={this.state.subdomain} onChange={this.handleChange.bind(this)} />
                <div className="ui label">toolsio.com</div>  
              </div>
              <span className="red">{errors.message && errors.message.errors && errors.message.errors.subdomain && errors.message.errors.subdomain.message}</span>
            </div>  

            <button disabled={isLoading} className="ui fluid large teal submit button">{T.translate("log_in.subdomain.continue_button")}</button>
              
          </div>
        </form>  
        <div className="ui message">
          {T.translate("log_in.new_to_us")}&nbsp;<a href="/signup">{T.translate("sign_up.sign_up")}</a>
        </div>
        <div className="ui center aligned vertical segment">
          <small className="block-i">{T.translate("landing.footer.copyright")}</small>
          <small className="block-i">{T.translate("landing.footer.address")}</small>
        </div>
      </div>       
      
    )
  }
}

Subdomain.propTypes = {
  isSubdomainExist: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired
}

Subdomain.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(null, { isSubdomainExist, addFlashMessage })(Subdomain)

