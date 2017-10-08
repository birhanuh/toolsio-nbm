// Mongodb connection
import db from '../../db'

// Macros
import Macros from '../helpers/macros'

browser.addCommand("dropDb", function async ()  {
  return Macros.drop()
})

describe("User", () => { 

  beforeEach(() => {
    browser.dropDb()
  })

  afterEach(() => {
    browser.dropDb()
  })

  it('allows to register via the registration page', function (done) {

    browser
      .url('')
      .click('a.ui.huge.primary.button')
      .setValue('input#firstName', 'Test 1')
      .setValue('input#lastName', 'Test 1')
      .setValue('input#email', 'test1@example.com')
      .setValue('input#password', 'ps')
      .setValue('input#confirmPassword', 'ps')
      .selectByAttribute('select', 'value', 'technology')
      .setValue('input#subdomain', 'test1')
      .click('button.ui.submit')
      .isVisible('.ui.message.positive')
      .then(function (isVisible) {
        expect(isVisible).toBe(true)
        done()
      })
    })

})
