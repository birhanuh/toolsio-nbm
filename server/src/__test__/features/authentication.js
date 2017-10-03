require('babel/register')
   
// Mongodb connection
import db from '../../db'

// Macros
import Macros from '../helpers/Macros'
  
describe("User", () => { 

  beforeAll((done) => {
    // Connect to test db
    db.connect('mongodb://localhost/toolsio_test')

    done()
  })

  afterAll((done) => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
  })


  it('allows to register via the registration page', function (done) {

    browswer.init()
      .url(paceUrl)
      .click('a.ui.huge.primary.button')
      .setValue('input#firstname', 'Test 1')
      .setValue('input#lastname', 'Test 2')
      .setValue('input#email', 'test1@example.com')
      .setValue('input#password', 'ps')
      .setValue('input#confirmPassword', 'ps')
      .setValue('input#industry', 'technology')
      .setValue('input#subdomain', 'test1')
      .click('button#submit')
      .isVisible('.ui.message.positive')
      .then(function (isVisible) {
          expect(isVisible).toBe(true)
          done()
      })
      .end()
    })

})
