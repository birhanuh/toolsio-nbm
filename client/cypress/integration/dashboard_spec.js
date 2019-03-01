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

    // we should be redirected to /dashboard
    cy.url().should('include', '/dashboard')
  })

  it('Check anchors existance', function() {
    // should contain anchors
    cy.get('.ui.four.grid .column:nth-child(2) a').should('contain', 'Create your first Invoice')
    cy.get('.ui.four.grid .column:nth-child(3) a').should('contain', 'Create your first Project')
    cy.get('.ui.four.grid .column:nth-child(4) a').should('contain', 'Create your first Sale')
    cy.get('.ui.two.grid .column:first-child a').should('contain', 'Create your first Customer')
    cy.get('.ui.two.grid .column:nth-child(2) a').should('contain', 'Create your first Invoice')

    cy.get('.ui.four.grid .column:first-child h1').should('contain', '0')
  })

  it('Open links from anchors', function() {
    cy.get('.ui.four.grid .column:nth-child(2) a').click()
    cy.url().should('include', '/invoices')

    cy.visit(`http://${account.subdomain}.lvh.me:3000/dashboard`)
    cy.get('.ui.four.grid .column:nth-child(3) a').click()
    cy.url().should('include', '/projects')

    cy.visit(`http://${account.subdomain}.lvh.me:3000/dashboard`)
    cy.get('.ui.four.grid .column:nth-child(4) a').click()
    cy.url().should('include', '/sales')

    cy.visit(`http://${account.subdomain}.lvh.me:3000/dashboard`)
    cy.get('.ui.two.grid .column:first-child a').click()
    cy.url().should('include', '/customers')
  })
})
