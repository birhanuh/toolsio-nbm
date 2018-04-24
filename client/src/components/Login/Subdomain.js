import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { isSubdomainExist } from '../../actions/authenticationActions'
import { addFlashMessage } from '../../actions/flashMessageActions'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { Validation, Authorization } from '../../utils'

// Localization 
import T from 'i18n-react'

import logo from '../../images/logo-square.png'

class Subdomain extends Component {
  constructor(props) {
    super(props)
    this.state = {
      subdomain: '',
      errors: {},
      isLoading: false
    }
  }

  componentDidMount = () => {
    // Fetch Sale when id is present in params
    const subdomain = Authorization.getSubdomain()
    
    if (subdomain) {
      this.setState({ errros: {}, isLoading: true })

      this.props.mutate({ variables: { subdomain } })
        .then(res => {
         
          const { success, subdomain, error } = res.data.isSubdomainExist
      
          if (success) {
            
            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("log_in.subdomain.on_your_account_page")
            })

            // Redirect to login page with subdoamin set 
            window.location = ''+process.env.HTTP+subdomain+'.'+process.env.DNS+'/login'
          } else {
            let errorsList = {}
            errors.map(error => errorsList[error.path] = error.message)
            this.setState({ errors: errorsList, isLoading: false })
          }
        })
        .catch(err => this.setState({ errors: err, isLoading: false }))    
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
    updatedErrors = errors

    if (!isValid) {
      this.setState({ errors: updatedErrors })
    }

    return isValid;
  }

  handleSubmit(e) {
    e.preventDefault()
 
    if (this.isValid()) {
      const { subdomain } = this.state
      this.setState({ errros: {}, isLoading: true })

      this.props.mutate({ variables: { subdomain } })
        .then(res => {
         
          const { success, subdomain, errors } = res.data.isSubdomainExist
          
          if (success) {
            console.log('sdfsdfs ', subdomain)
            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("log_in.subdomain.on_your_account_page")
            })

            // Redirect to login page with subdoamin set 
            window.location = ''+process.env.HTTP+subdomain+'.'+process.env.DNS+'/login'
          } else {
            let errorsList = {}
            errors.map(error => errorsList[error.path] = error.message)
            this.setState({ errors: errorsList, isLoading: false })
          }
        })
        .catch(err => this.setState({ errors: err, isLoading: false })) 
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

            { !!errors.message && <div className="ui negative message"><p>{errors.message}</p></div> } 

            <div className={classnames("field", { error: errors && errors.subdomain })}>
              <div className="ui right labeled input">
                <input type="text" name="subdomain" placeholder={T.translate("log_in.subdomain.subdomain")} 
                  value={this.state.subdomain} onChange={this.handleChange.bind(this)} />
                <div className="ui label">toolsio.com</div>  
              </div>
              <span className="red">{errors && errors.subdomain}</span>
            </div>  

            <button disabled={isLoading} className="ui fluid large teal submit button">{T.translate("log_in.subdomain.continue_button")}</button>
              
          </div>
        </form>  
        <div className="ui message">
          {T.translate("log_in.new_to_us")}&nbsp;<a href="/signup">{T.translate("sign_up.sign_up")}</a>
        </div>
        <div className="ui center aligned vertical segment">
          <small className="d-block">{T.translate("landing.footer.copyright")}</small>
          <small className="d-block">{T.translate("landing.footer.address")}</small>
        </div>
      </div>       
      
    )
  }
}

Subdomain.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
}

Subdomain.contextTypes = {
  router: PropTypes.object.isRequired
}


const isSubdomainExistMutation = gql`
  mutation($subdomain: String!) {
    isSubdomainExist(subdomain: $subdomain) {
      success
      subdomain
      errors {
        path
        message
      }
    }
  }
`
export default connect(null, { addFlashMessage }) (graphql(isSubdomainExistMutation)(Subdomain))

