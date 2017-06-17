import React, { Component } from 'react'

// JS Custome
import '../../js/landing.js'

// Localization 
import T from 'i18n-react'

// Images
import nan from '../../images/nan.jpg'; 

class Landing extends Component {

  render() {
    return (
      <div>
        <div className="ui vertical stripe features background-white">
          <div className="ui middle aligned stackable grid container">
            <div className="row">
              <div className="center aligned column">
                <h3 className="ui header">{T.translate("landing.features.header")}</h3>
              </div>
            </div>  
            <div className="row">  
              <div className="eight wide column">     
                <div className="sprite invoice"></div>
                <blockquote>
                  <h4 className="ui header">{T.translate("landing.features.invoice.header")}</h4>
                  <div className="body-text">
                    <p>{T.translate("landing.features.invoice.text")}</p>
                  </div>
                </blockquote>  
              </div>  
              <div className="eight wide column">     
                <div className="sprite sale"></div>
                <blockquote>
                  <h4 className="ui header">{T.translate("landing.features.sale.header")}</h4>
                  <div className="body-text">
                    <p>{T.translate("landing.features.sale.text")}</p>
                  </div>
                </blockquote>  
              </div>  
              <div className="eight wide column">     
                <div className="sprite project"></div>
                <blockquote>
                  <h4 className="ui header">{T.translate("landing.features.project.header")}</h4>
                  <div className="body-text">
                    <p>{T.translate("landing.features.project.text")}</p>
                  </div>
                </blockquote>  
              </div>  
              <div className="eight wide column">     
                <div className="sprite analysis"></div>
                <blockquote>
                  <h4 className="ui header">{T.translate("landing.features.analysis.header")}</h4>
                  <div className="body-text">
                    <p>{T.translate("landing.features.analysis.text")}</p>
                  </div>
                </blockquote>  
              </div>  
            </div>  
          </div>
        </div>

        <div className="ui vertical stripe clients background-xx-light-grey">          
          <div className="ui middle aligned stackable grid container">
            <div className="row">
              <div className="center aligned column">
                <h3 className="ui header">{T.translate("landing.clients.header")}</h3>
              </div>
            </div>  
            <div className="ui text container">
              <div className="ui three column grid">
                <div className="center aligned row">
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

        <div className="ui vertical stripe testimonials">
          <div className="ui text container">
            <div className="center aligned row">
              <div className="column">
                <div className="slider slider1"> 
                  <div className="slides">
                    <div className="slide-item item1">
                      <i className="quote left icon"></i>
                      <h5> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore, dolorum, fugiat, eligendi magni quibusdam iure cupiditate ex voluptas unde Lorem ipsum dolor sit amet..</h5>
                      <p>- Jonathan Deo</p>
                    </div>    
                    <div className="slide-item item2">
                      <i className="quote left icon"></i>
                      <h5> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore, dolorum, fugiat, eligendi magni quibusdam iure cupiditate ex voluptas unde Lorem ipsum dolor sit amet..</h5>
                      <p>- Jonathan Deo</p>
                    </div>  
                    <div className="slide-item item3">
                      <i className="quote left icon"></i>
                      <h5> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore, dolorum, fugiat, eligendi magni quibusdam iure cupiditate ex voluptas unde Lorem ipsum dolor sit amet..</h5>
                      <p>- Jonathan Deo</p>
                    </div>  
                  </div>
                </div>
              </div>
            </div>
          </div>  
        </div>

        <div className="ui vertical stripe pricing background-xx-light-grey">          
          <div className="ui middle aligned stackable grid container">
            <div className="ui three column centered grid">
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

        <div className="ui vertical stripe bottom-cta background-white">
          <div className="ui text container">
            <div className="ui one column centered grid">
              <div className="ui huge primary button">{T.translate("landing.home.get_started")}<i className="right arrow icon"></i></div>
            </div>
          </div>
        </div>  

        <div className="ui vertical stripe contacts background-xx-light-grey">  
          <div className="ui middle aligned stackable grid container">        
            <div className="ui text container">
              <div className="ui one column centered grid">
                <div className="one column centered row">
                  <h3 className="ui header">{T.translate("landing.clients.header")}</h3>
                </div>
                <div className="one column centered row">
                  <div className="column">
                    <p>{T.translate("landing.contacts.description")}</p>
                    
                    <form className="ui form">
                      <div className="field">
                        <label>{T.translate("landing.contacts.name")}</label>
                        <input type="text" name="name" placeholder={T.translate("landing.contacts.name")} />
                      </div>
                      <div className="field">
                        <label>{T.translate("landing.contacts.email")}</label>
                        <input type="text" name="email" placeholder={T.translate("landing.contacts.email")} />
                      </div>
                      <div className="field">
                        <label>{T.translate("landing.contacts.message")}</label>
                        <textarea></textarea>
                      </div>
                      <button className="ui primary button" type="submit">{T.translate("button.send")}</button>
                    </form> 
                  </div>
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
