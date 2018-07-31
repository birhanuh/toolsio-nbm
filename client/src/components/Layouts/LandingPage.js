import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Validation } from '../../utils'
import { Link } from 'react-router-dom'
import { addFlashMessage } from '../../actions/flashMessageActions'
// Semantic UI JS
import { Grid, Container, Segment, Input, TextArea, Form, Header, Button } from 'semantic-ui-react'
import { graphql, compose } from 'react-apollo'
import { CREATE_CONTACT_MESSAGE_MUTATION } from '../../graphql/contactMessage'

// Localization 
import T from 'i18n-react'

/* jQuery */
import $ from 'jquery'
$.animate = require('jquery.easing')

class LandingPage extends Component {

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
    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('.ui.footer .ui.inverted.link.list a').on('click', function(event) {
      event.preventDefault()
      var $anchor = $(this)
      $('html, body').stop().animate({
          scrollTop: $($anchor.attr('href')).offset().top - 50
      }, 1500, 'easeInOutExpo')
    })

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

    // Custome carousel
    let slideIndex = 0
    // Run showSlides only on root path 
    if (window.location.pathname.indexOf('/') === 0) {
      showSlides()
    }

    function showSlides() {
      let i
      let slides = $(".slide-item")
      let dots = $(".dot")
      
      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none"  
      }
      
      slideIndex++
      if (slideIndex > slides.length) {slideIndex = 1}    
      
      for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "")
      }

      slides[slideIndex-1].style.display = "block"  
      dots[slideIndex-1].className += " active"
      setTimeout(showSlides, 5000); // Change image every 5 seconds
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault()

    // Validation
    if (this.isValid()) { 
      this.setState({ isLoading: true })
      const { name, email, messageBody } = this.state
        
        this.props.createContactMessageMutation({ 
          variables: { name, email, messageBody, },
          })
          .then(res => {   
            const { success, errors } = res.data.createContactMessage

            if (success) {
              this.props.addFlashMessage({
                type: 'success',
                text: T.translate("landing.contacts.flash.success_create_contact_message")
              })  
              // Reset state
              this.setState({ name: '', email: '', messageBody: '', isLoading: false })
            } else {
              let errorsList = {}
              errors.map(error => errorsList[error.path] = error.message)

              this.setState({ errors: errorsList, isLoading: false })
            }
          })
          .catch(err => {
              this.props.addFlashMessage({
                type: 'error',
                text: T.translate("landing.contacts.flash.error_create_contact_message")
              })  
              
              this.setState({ errors: err, isLoading: false })
            })
    }
  }    
  

  render() {
    const { name, email, messageBody, errors, isLoading } = this.state

    return (
      <div onClick={this.hideSidebarVisibility}>
        <Segment style={{ padding: '4em 0em' }} vertical id="features" className=" background-white">
          <Grid container stackable verticalAlign='middle'>
            <Grid columns={2} centered> 
              <Header as='h2' aligned='center'>{T.translate("landing.features.header")}</Header>
              
                <Grid.Column>     
                  <div className="sprite invoice left floated"></div>
                  <blockquote>
                    <h3 className="ui header">{T.translate("landing.features.invoice.header")}</h3>
                    <p>{T.translate("landing.features.invoice.text")}</p>
                  </blockquote>  
                </Grid.Column>  
                <Grid.Column>     
                  <div className="sprite sale left floated"></div>
                  <blockquote>
                    <h3 className="ui header">{T.translate("landing.features.sale.header")}</h3>
                    <p>{T.translate("landing.features.sale.text")}</p>
                  </blockquote>  
                </Grid.Column>  
                <Grid.Column>     
                  <div className="sprite project left floated"></div>
                  <blockquote>
                    <h3 className="ui header">{T.translate("landing.features.project.header")}</h3>
                    <p>{T.translate("landing.features.project.text")}</p>
                  </blockquote>  
                </Grid.Column>  
                <Grid.Column>     
                  <div className="sprite analysis left floated"></div>
                  <blockquote>
                    <h3 className="ui header">{T.translate("landing.features.analysis.header")}</h3>
                    <p>{T.translate("landing.features.analysis.text")}</p>
                  </blockquote>  
                </Grid.Column>  
              
            </Grid>    
          </Grid>
        </Segment>

        <Segment style={{ padding: '4em 0em' }} vertical id="clients" className=" background-xx-light-grey">          
          <Grid container stackable verticalAlign='middle'>
            <Grid columns={2} centered>
              <Header as='h2' aligned='center'>{T.translate("landing.clients.header")}</Header>
              
              <Grid columns={3}>
                <Grid.Column>
                  <div className="company-logo"><div className="sprite logo-one"></div></div>
                </Grid.Column>
                <Grid.Column>  
                  <div className="company-logo"><div className="sprite logo-two"></div></div>
                </Grid.Column>
                <Grid.Column>
                  <div className="company-logo"><div className="sprite logo-one"></div></div>
                </Grid.Column>
                <Grid.Column>
                  <div className="company-logo"><div className="sprite logo-two"></div></div>
                </Grid.Column>
                <Grid.Column>
                  <div className="company-logo"><div className="sprite logo-one"></div></div>
                </Grid.Column>
                <Grid.Column>
                  <div className="company-logo"><div className="sprite logo-two"></div></div>
                </Grid.Column>
              </Grid>
            </Grid>
          </Grid>
        </Segment>  

        <div id="testimonial" className="">
          <Container text>
            <Segment vertical textAlign='center'>
              <div className="slider slider1"> 
                <div className="slides">
                  <div className="slide-item item1 fade">
                    <i className="quote left icon"></i>
                    <h5 className="ui header">Simply dummy text of the printing and typesetting industry. Simply dummy text of the printing and typesetting industry. Simply dummy text of the printing and typesetting industry.</h5>
                    <p>- Jonathan Deo</p>
                  </div>    
                  <div className="slide-item item2 fade">
                    <i className="quote left icon"></i>
                    <h5 className="ui header">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. Simply dummy text of the printing and typesetting industry.</h5>
                    <p>- Anthon Marchal</p>
                  </div>  
                  <div className="slide-item item3 fade">
                    <i className="quote left icon"></i>
                    <h5 className="ui header">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.</h5>
                    <p>- Thomas Deep</p>
                  </div>  
                </div>
              </div>
            </Segment>            
            <Segment vertical textAlign='center' className="pt-0">
              <div>
                <span className="dot"></span> 
                <span className="dot"></span> 
                <span className="dot"></span> 
              </div>
            </Segment>
          </Container>  
        </div>

        <Segment style={{ padding: '4em 0em' }} vertical id="pricing" className="background-xx-light-grey">          
          <Grid container stackable verticalAlign='middle'>
            <Grid.Row columns={1} centered>
              <Header as='h2'>{T.translate("landing.pricing.header")}</Header>
              <Grid columns={3} stackable>
                <Grid.Column>
                  <ul className="pricing-plan">
                    <li className="pricing-title">{T.translate("landing.pricing.basic.title")}</li>
                    <li className="pricing-desc">{T.translate("landing.pricing.basic.description")}</li>
                    <li className="pricing-price">$0</li>
                    <li>{T.translate("landing.pricing.basic.analytics")}</li>
                    <li>{T.translate("landing.pricing.basic.invitation")}</li>
                    <li>{T.translate("landing.pricing.basic.messaging")}</li>
                    <li>{T.translate("landing.pricing.basic.calendar")}</li>
                    <li><Link to="" className="ui button">{T.translate("landing.pricing.basic.learn_more")}</Link></li>
                  </ul>
                </Grid.Column>
                <Grid.Column>
                  <ul className="pricing-plan">
                    <li className="pricing-title">{T.translate("landing.pricing.standard.title")}</li>
                    <li className="pricing-desc">{T.translate("landing.pricing.standard.description")}</li>
                    <li className="pricing-price">$0</li>
                    <li>{T.translate("landing.pricing.standard.analytics")}</li>
                    <li>{T.translate("landing.pricing.standard.invitation")}</li>
                    <li>{T.translate("landing.pricing.standard.messaging")}</li>
                    <li>{T.translate("landing.pricing.standard.calendar")}</li>
                    <li><Link to="" className="ui button disabled">{T.translate("landing.pricing.standard.learn_more")}</Link></li>
                  </ul>
                </Grid.Column>
                <Grid.Column>
                  <ul className="pricing-plan">
                    <li className="pricing-title">{T.translate("landing.pricing.premium.title")}</li>
                    <li className="pricing-desc">{T.translate("landing.pricing.premium.description")}</li>
                    <li className="pricing-price">$0</li>
                    <li>{T.translate("landing.pricing.premium.analytics")}</li>
                    <li>{T.translate("landing.pricing.premium.invitation")}</li>
                    <li>{T.translate("landing.pricing.premium.messaging")}</li>
                    <li>{T.translate("landing.pricing.premium.calendar")}</li>
                    <li><Link to="" className="ui button disabled">{T.translate("landing.pricing.premium.learn_more")}</Link></li>
                  </ul>
                </Grid.Column>
              </Grid>  
            </Grid.Row>
          </Grid>      
        </Segment>

        <Segment style={{ padding: '4em 0em' }} vertical id="bottom-cta" className="background-white">
          <Grid container stackable verticalAlign='middle'>  
            <Grid columns={2} centered> 
              <div className="column centered row">
                <a href={`${process.env.CLIENT_PROTOCOL}${process.env.CLIENT_URL}/signup`} className="ui huge primary button">{T.translate("landing.home.get_started")}<i className="right arrow icon"></i></a>
              </div>  
            </Grid>
          </Grid>
        </Segment>  

        <Segment style={{ padding: '4em 0em' }} vertical id="contacts" className="background-xx-light-grey">  
          <Grid container stackable verticalAlign='middle'> 
            <Grid columns={2} centered> 
              <Header as='h2' aligned='center'>{T.translate("landing.contacts.header")}</Header>             
              <Grid.Column>
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
                  <Button disabled={isLoading} primary type="submit">{T.translate("landing.contacts.send")}</Button>
                </Form>  
              </Grid.Column> 
            </Grid> 
          </Grid>         
        </Segment>
      </div>)
  }  
}

const Mutation =  compose(
  graphql(CREATE_CONTACT_MESSAGE_MUTATION, {
    name : 'createContactMessageMutation'
  })
)(LandingPage)

export default connect(null, { addFlashMessage }) (Mutation)
