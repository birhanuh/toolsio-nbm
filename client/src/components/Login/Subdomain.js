import React, { Component } from 'react' 
import { connect } from 'react-redux'
import { Validation } from '../../utils'
import { subdomainRequest } from '../../actions/authentication'
import { addFlashMessage } from '../../actions/flashMessages'
import classnames from 'classnames'

// Localization 
import T from 'i18n-react'

class Subdomain extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Subdomain: '',
      errors: {
        message: {
          errors: {}
        }
      },
      isLoading: false
    }
  }
  
  componentDidMount = () => {
    // Fetch Project when id is present in params
    const { match } = this.props
    console.log('match: ', match)
  }

  handleChange(e) {
    this.setState({
      [e.target.name] = e.target.value
    })
  }

  isValid() {
    const { errors, isValid } = Validation.validateLoginInput(this.state.user)

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
          this.context.router.history.push(`http://${subdomain}.lvh.me:3000/login`)
        },
        ({ response }) => this.setState({ errors: response.data.errors, isLoading: false })
      )  
    }
  }

  render() {
    const { errors, isLoading } = this.state
   
    return (  
        <form className="ui large form" onSubmit={this.handleSubmit.bind(this)}>
          <div className="ui stacked segment">

            { !!errors.message && (typeof errors.message === "string") && <div className="ui negative message"><p>{errors.message}</p></div> } 

            <div className={classnames("field", { error: !!errors.message && errors.message.errors && errors.message.errors.subdomain })}>
              <div className="ui right labeled input">
                <input type="text" name="email" placeholder={T.translate("sign_in.subdomain.company_name")} 
                  value={this.state.user.subdomain} onChange={this.handleChange.bind(this)} />
                <div className="ui label">toolsio.com</div>  
              </div>
              <span className="red">{errors.message && errors.message.errors && errors.message.errors.subdomain && errors.message.errors.subdomain.message}</span>
            </div>  

            <button disabled={isLoading} className="ui fluid large teal submit button">{T.translate("sign_in.subdomain.continue_button")}</button>
              
          </div>
        </form>         
      
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

