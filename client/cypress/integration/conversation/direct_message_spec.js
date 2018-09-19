describe('Customers', function() {

  // creates a closure around 'account'
  let account

  before(function () {
    // redefine account
    account = {
      firstName: 'Testa',
      lastName: 'Testa',
      email: 'testa@toolsio.com',
      password: 'ppppp',
      industry: 'IT',
      subdomain: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
    }

    cy.visit('/')

    cy.contains('Sign up').click()

    const { firstName, lastName, email, password, subdomain } = account

    cy.get('input[name=firstName]').type(firstName)
    cy.get('input[name=lastName]').type(lastName)
    cy.get('input[name=email]').type(email)
    cy.get('input[name=password]').type(password)
    cy.get('input[name=confirmPassword]').type(password)
    cy.get('div[name=industry]').click()
    cy.get('div[name=industry] .item:first-child').click()
    cy.get('input[name=subdomain]').type(subdomain)

    // submit
    cy.contains('Sign up').click()
  })

  beforeEach(function () {
    const { email, password } = account

    // we should be redirected to /login
    cy.visit(`http://${account.subdomain}.lvh.me:3000/login`)

    // login
    cy.get('input[name=email]').type(email)
    // {enter} causes the form to submit
    cy.get('input[name=password]').type(`${password}{enter}`)
 
    // we should be redirected to /dashboard
    cy.url().should('include', '/dashboard')

    // go to conversations
    cy.visit(`http://${account.subdomain}.lvh.me:3000/conversations`)
  })

  it('Add User', function() {
    cy.contains('Add user').click()

    cy.get('div[name=user]').click()
    cy.get('div[name=user] input').type('Testa')
    cy.get('.visible.menu > .item:first-child').click()

    // we should be redirected to /conversations
    cy.url().should('include', '/conversations/receiver')

    // should contain Customera
    cy.get('.messages h3').should('contain', 'Testa')

    // write message and submit
    cy.get('.ui.form textarea[name=body]').type('Test message...{enter}')

    // we should be redirected to /conversations
    cy.url().should('include', '/conversations/receiver')

    // should contain Customera
    cy.get('.ui.comments .text').should('contain', 'Test message...')
  })
})
