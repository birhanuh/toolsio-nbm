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
  })

  it('Create customer', function() {
    cy.visit(`http://${account.subdomain}.lvh.me:3000/customers`)

    cy.contains('Add new Customer').click()

    cy.get('input[name=name]').type('Customera')
    cy.get('input[name=vatNumber]').type(12345)
    cy.get('input[name=phoneNumber]').type('12345678910')
    cy.get('input[name=street]').type('Street 1')
    cy.get('input[name=postalCode]').type('1234')
    cy.get('select[name=rcrs-country]').select('Algeria')
    cy.get('select[name=rcrs-region]').select('Batna')

    // submit
    cy.contains('Save').click()

    // we should be redirected to /customers
    cy.url().should('include', '/customers')

    // should contain Customera
    cy.get('table td').should('contain', 'Customera')

  })

  it('Update customer', function() {
    cy.visit(`http://${account.subdomain}.lvh.me:3000/customers`)

    cy.get('.basic.button.green').click()

    // we should be redirected to /customers/edit
    cy.url().should('include', '/customers/edit')

    cy.get('input[name=name]').type(' updated')

    // submit
    cy.contains('Save').click()

    // we should be redirected to /customers
    cy.url().should('include', '/customers')

    // should contain Customera
    cy.get('table td').should('contain', 'Customera updated')
  })

  it('Delete customer', function() {
    cy.visit(`http://${account.subdomain}.lvh.me:3000/customers`)

    cy.get('.basic.button.blue').click()

    cy.contains('Delete').click()

    // confirm delete
    cy.get('.actions > .ui.negative.button').click()
    
    // we should be redirected to /customers
    cy.url().should('include', '/customers')

    // should contain Customera
    cy.get('table td').not('contain', 'Customera updated')
  })
})
