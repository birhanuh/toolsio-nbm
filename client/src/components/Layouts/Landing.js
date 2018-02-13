import React, { Component } from 'react'

// JS Custome
import '../../js/landing.js'

// Localization 
import T from 'i18n-react'

// Images

class Landing extends Component {

  render() {
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
                <a href="/signup" className="ui huge primary button">{T.translate("landing.home.get_started")}<i className="right arrow icon"></i></a>
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
                        <textarea placeholder={T.translate("landing.contacts.message")+'...'}></textarea>
                      </div>
                      <button className="ui primary button" type="submit">{T.translate("landing.contacts.send")}</button>
                    </form> 
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
