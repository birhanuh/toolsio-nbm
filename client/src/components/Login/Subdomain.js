import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
// Semantic UI Form elements
import { Container, Segment, Header, Input, Form, Button, Message } from 'semantic-ui-react'
import { addFlashMessage } from '../../actions/flashMessageActions'
import { graphql } from 'react-apollo'
import { IS_SUBDOMAIN_EXIST_MUTATION } from '../../graphql/authentications'

import { Validation, getSubdomain } from '../../utils'

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
    const subdomain = getSubdomain()
    
    if (subdomain) {
      this.setState({ errros: {}, isLoading: true })

      this.props.mutate({ variables: { subdomain } })
        .then(res => {         
          const { success, errors, subdomain } = res.data.isSubdomainExist
      
          if (success) {
            
            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("log_in.subdomain.on_your_account_page")
            })

            // Redirect to login page with subdoamin set 
            window.location = process.env.CLIENT_PROTOCOL+subdomain+'.'+process.env.CLIENT_URL+'/login'
          } else {
            let errorsList = {}
            errors.map(error => errorsList[error.path] = error.message)
            this.setState({ errors: errorsList, isLoading: false })
          }
        })
        .catch(err => this.setState({ errors: err, isLoading: false }))    
    } 
  }
  
  handleChange(name, value) {
    this.setState({
      [name]: value
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
             window.location = ''+process.env.CLIENT_PROTOCOL+subdomain+'.'+process.env.CLIENT_URL+'/login'
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
    const { subdomain, errors, isLoading } = this.state
   
    return (   
      <Container text>
        <Header as="h2" image className="turquoise">
          <Link className="" to="/">
            <img src={logo} className="image" alt="logo-square" />
          </Link>
          <Header.Content>{T.translate("log_in.subdomain.header")}</Header.Content>
        </Header>    

        <Segment>
          <Form loading={isLoading} onSubmit={this.handleSubmit.bind(this)}>

            { !!errors.message && <Message negative><p>{errors.message}</p></Message> } 

            <Form.Field error={!!errors.subdomain}>
              <label>{T.translate("log_in.subdomain.subdomain")}</label>
              <Input
                label="toolsio.com"
                labelPosition='right'
                placeholder={T.translate("log_in.subdomain.subdomain")}
                name="subdomain" 
                value={subdomain} 
                onChange={(e, {value}) => this.handleChange('subdomain', value)} 
                error={!!errors.subdomain}
                fluid
              />
              <span className="red">{errors.subdomain}</span>
            </Form.Field> 

            <Button disabled={isLoading} primary fluid>{T.translate("log_in.subdomain.continue_button")}</Button>
              
          </Form>
        </Segment>  
        <Segment>
          {T.translate("log_in.new_to_us")}&nbsp;<Link to="/signup">{T.translate("sign_up.sign_up")}</Link>
        </Segment>
        <Segment vertical align="center">
          <small className="d-block">{T.translate("landing.footer.copy_right")}</small>
          <small className="d-block">{T.translate("landing.footer.address")}</small>
        </Segment>
      </Container>)
  }
}

Subdomain.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
}

Subdomain.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(null, { addFlashMessage }) (graphql(IS_SUBDOMAIN_EXIST_MUTATION)(Subdomain))

