import React, { Component } from 'react' 
import { connect } from 'react-redux'
import { Validation } from '../../utils'
import { subdomainRequest } from '../../actions/authentication'
import { addFlashMessage } from '../../actions/flashMessages'
import classnames from 'classnames'

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
      this.props.subdomainRequest(this.state.user).then(
        () => {
          this.props.addFlashMessage({
            type: 'success',
            text: 'You are on your company page, now login with your credentials!'
          })
          this.context.router.history.push(`http://${this.state.subdomain}.lvh.me:3000/login`)
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
                <input type="text" name="email" placeholder={T.translate("log_in.subdomain.company_name")} 
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
        <div className="ui centered grid m-t-m">
          <small className="visible-all-block">{T.translate("landing.footer.copyright")}</small>
          <small className="visible-all-block">{T.translate("landing.footer.address")}</small>
        </div>
      </div>       
      
    )
  }
}

Subdomain.propTypes = {
  subdomainRequest: React.PropTypes.func.isRequired,
  addFlashMessage: React.PropTypes.func.isRequired
}

Subdomain.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default connect(null, { subdomainRequest, addFlashMessage })(Subdomain)

