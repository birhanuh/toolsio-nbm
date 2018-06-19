import React, { Component } from 'react'
import { Validation } from '../../utils'
// Semantic UI JS
import { Input, TextArea, Form } from 'semantic-ui-react'

// Localization 
import T from 'i18n-react'

/* jQuery */
import $ from 'jquery'
$.animate = require('jquery.easing')

class Landing extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      messageBody: '',
      errors: {},
      isLoading: false
    }
  }

  handleChange = (name, value) => {
    if (this.state.errors[name]) {
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
    const { errors, isValid } = Validation.validateContactMessageInput(this.state)

    let updatedErrors = Object.assign({}, this.state.errors)
    updatedErrors = errors

    if (!isValid) {
      this.setState({ errors: updatedErrors })
    }

    return isValid
  }

  componentDidMount = () => {
    // Scroll to top
    $(window).scroll(function() {
      if ($(this).scrollTop() > 100) {
        $('.back-to-top').fadeIn()
      } else {
        $('.back-to-top').fadeOut()
      }
    })

    $('.back-to-top').click(function() {
      $("html, body").animate({ scrollTop: 0 }, 1000)
      return false
    }) 
  }

  handleSubmit = async (event) => {
    event.preventDefault()

    // Validation
    if (this.isValid()) { 
      this.setState({ isLoading: true })
      const { name, email, message } = this.state
        
        this.props.createContactMessageMutation({ 
          variables: { name, email, message, },
          })
          .then(res => {   
            const { success, errors } = res.data.createContactMessage

            if (success) {
              this.props.addFlashMessage({
                type: 'success',
                text: T.translate("landing.contacts.flash.success_create_contact_message")
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
  

  render() {
    const { name, email, messageBody, errors, isLoading } = this.state

    return (
      <div>
        <div id="features" className="ui vertical stripe background-white">
          <div className="ui middle aligned container">
            <div className="ui two column stackable centered grid">
              <div className="column">
                <h2 className="ui header">{T.translate("landing.features.header")}</h2>
              </div>
              <div className="two column centered row">  
                <div className="column">     
                  <div className="sprite invoice left floated"></div>
                  <blockquote>
                    <h3 className="ui header">{T.translate("landing.features.invoice.header")}</h3>
                    <p>{T.translate("landing.features.invoice.text")}</p>
                  </blockquote>  
                </div>  
                <div className="column">     
                  <div className="sprite sale left floated"></div>
                  <blockquote>
                    <h3 className="ui header">{T.translate("landing.features.sale.header")}</h3>
                    <p>{T.translate("landing.features.sale.text")}</p>
                  </blockquote>  
                </div>  
                <div className="column">     
                  <div className="sprite project left floated"></div>
                  <blockquote>
                    <h3 className="ui header">{T.translate("landing.features.project.header")}</h3>
                    <p>{T.translate("landing.features.project.text")}</p>
                  </blockquote>  
                </div>  
                <div className="column">     
                  <div className="sprite analysis left floated"></div>
                  <blockquote>
                    <h3 className="ui header">{T.translate("landing.features.analysis.header")}</h3>
                    <p>{T.translate("landing.features.analysis.text")}</p>
                  </blockquote>  
                </div>  
              </div>
            </div>    
          </div>
        </div>

        <div id="clients" className="ui vertical stripe background-xx-light-grey">          
          <div className="ui middle aligned container">
            <div className="ui two column stackable centered grid">
              <div className="column">
                <h2 className="ui header">{T.translate("landing.clients.header")}</h2>
              </div>
              <div className="column row">
                <div className="ui three column grid">
                  <div className="column">
                    <div className="company-logo"><div className="sprite logo-one"></div></div>
                  </div>
                  <div className="column">  
                    <div className="company-logo"><div className="sprite logo-two"></div></div>
                  </div>
                  <div className="column">
                    <div className="company-logo"><div className="sprite logo-one"></div></div>
                  </div>
                  <div className="column">
                    <div className="company-logo"><div className="sprite logo-two"></div></div>
                  </div>
                  <div className="column">
                    <div className="company-logo"><div className="sprite logo-one"></div></div>
                  </div>
                  <div className="column">
                    <div className="company-logo"><div className="sprite logo-two"></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>  

        <div id="testimonials" className="ui vertical stripe">
          <div className="ui text container">
            <div className="center aligned row">
              <div className="column">
                <div className="slider slider1"> 
                  <div className="slides">
                    <div className="slide-item item1">
                      <i className="quote left icon"></i>
                      <h5 className="ui header"> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore, dolorum, fugiat, eligendi magni quibusdam iure cupiditate ex voluptas unde Lorem ipsum dolor sit amet..</h5>
                      <p>- Jonathan Deo</p>
                    </div>    
                    <div className="slide-item item2">
                      <i className="quote left icon"></i>
                      <h5 className="ui header"> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore, dolorum, fugiat, eligendi magni quibusdam iure cupiditate ex voluptas unde Lorem ipsum dolor sit amet..</h5>
                      <p>- Jonathan Deo</p>
                    </div>  
                    <div className="slide-item item3">
                      <i className="quote left icon"></i>
                      <h5 className="ui header"> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore, dolorum, fugiat, eligendi magni quibusdam iure cupiditate ex voluptas unde Lorem ipsum dolor sit amet..</h5>
                      <p>- Jonathan Deo</p>
                    </div>  
                  </div>
                </div>
              </div>
            </div>
          </div>  
        </div>

        <div id="pricing" className="ui vertical stripe background-xx-light-grey">          
          <div className="ui middle aligned container">
            <div className="ui three column stackable centered grid">
              <div className="column">
                <h2 className="ui header">{T.translate("landing.pricing.header")}</h2>
              </div>
              <div className="three column row">
                <div className="column">
                  <ul className="pricing-plan">
                    <li className="pricing-title">Basic</li>
                    <li className="pricing-desc">Lorem ipsum dolor sit amet, illum fastidii dissentias quo ne. Sea ne sint animal iisque, nam an soluta sensibus.</li>
                    <li className="pricing-price">$16</li>
                    <li>Dashboards</li>
                    <li>Projects view</li>
                    <li>Contacts</li>
                    <li>Calendar</li>
                    <li><a href="#" className="ui button">{T.translate("landing.pricing.learn_more")}</a></li>
                  </ul>
                </div>
                <div className="column">
                  <ul className="pricing-plan">
                    <li className="pricing-title">Standard</li>
                    <li className="pricing-desc">Lorem ipsum dolor sit amet, illum fastidii dissentias quo ne. Sea ne sint animal iisque, nam an soluta sensibus.</li>
                    <li className="pricing-price">$22</li>
                    <li>Dashboards</li>
                    <li>Projects view</li>
                    <li>Contacts</li>
                    <li>Calendar</li>
                    <li><a href="#" className="ui button">{T.translate("landing.pricing.learn_more")}</a></li>
                  </ul>
                </div>
                <div className="column">
                  <ul className="pricing-plan">
                    <li className="pricing-title">Premium</li>
                    <li className="pricing-desc">Lorem ipsum dolor sit amet, illum fastidii dissentias quo ne. Sea ne sint animal iisque, nam an soluta sensibus.</li>
                    <li className="pricing-price">$200</li>
                    <li>Dashboards</li>
                    <li>Projects view</li>
                    <li>Contacts</li>
                    <li>Calendar</li>
                    <li><a href="#" className="ui button">{T.translate("landing.pricing.learn_more")}</a></li>
                  </ul>
                </div>
              </div>  
            </div>
          </div>      
        </div>  

        <div id="bottom-cta" className="ui vertical stripe background-white">
          <div className="ui middle aligned container">  
            <div className="ui two column stackable centered grid">
              <div className="column centered row">
                <a href={`${process.env.SERVER_PROTOCOL}${process.env.SERVER_HOST}/signup`} className="ui huge primary button">{T.translate("landing.home.get_started")}<i className="right arrow icon"></i></a>
              </div>  
            </div>
          </div>
        </div>  

        <div id="contacts" className="ui vertical stripe background-xx-light-grey">  
          <div className="ui middle aligned container"> 
              <div className="ui two column stackable centered grid">
                <div className="column">
                  <h2 className="ui header">{T.translate("landing.contacts.header")}</h2>
                </div>
                <div className="column row">
                  <div className="column">
                    <p>{T.translate("landing.contacts.description")}</p>
                    
                    <Form loading={isLoading} onSubmit={this.handleSubmit.bind(this)}>

                      { !!errors.message && <div className="ui negative message"><p>{errors.message}</p></div> } 
                      
                      <Form.Field error={!!errors.name}>
                        <label>{T.translate("landing.contacts.name")}</label>
                        <Input
                          placeholder={T.translate("landing.contacts.name")}
                          name="name" 
                          value={name} 
                          onChange={(e, {value}) => this.handleChange('name', value)} 
                          error={!!errors.name}
                        />
                        <span className="red">{errors.name}</span>
                      </Form.Field>
                      
                      <Form.Field error={!!errors.email}>
                        <label>{T.translate("landing.contacts.email")}</label>
                        <Input
                          placeholder={T.translate("landing.contacts.email")}
                          email="email" 
                          value={email} 
                          onChange={(e, {value}) => this.handleChange('email', value)} 
                          error={!!errors.email}
                        />
                        <span className="red">{errors.email}</span>
                      </Form.Field>

                      <Form.Field error={!!errors.messageBody}>  
                        <label>{T.translate("landing.contacts.message_body")}</label>
                        <TextArea
                          placeholder={T.translate("landing.contacts.message_body")}
                          name="messageBody" 
                          value={messageBody} 
                          onChange={(e, {value}) => this.handleChange('messageBody', value)} 
                        />
                        <span className="red">{errors.messageBody}</span>
                      </Form.Field>
                      <button disabled={isLoading} className="ui primary button" type="submit">{T.translate("landing.contacts.send")}</button>
                    </Form>  
                  </div>
                </div>  
              </div> 
          </div>         
        </div>

      </div>
    )
  }  
}

export default Landing
