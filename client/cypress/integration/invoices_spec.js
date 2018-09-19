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

    // we should be redirected to /login
    cy.visit(`http://${account.subdomain}.lvh.me:3000/login`)

    // login
    cy.get('input[name=email]').type(email)
    // {enter} causes the form to submit
    cy.get('input[name=password]').type(`${password}{enter}`)
    
    // we should be redirected to /dashboard
    cy.url().should('include', '/dashboard')

    // create Customer
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

    // Create Project
    cy.visit(`http://${account.subdomain}.lvh.me:3000/projects`)

    cy.contains('Create new Project').click()

    cy.get('input[name=name]').type('Project 1')
    cy.get('.react-datepicker-wrapper').click()
    cy.get('.react-datepicker__month .react-datepicker__week:last-child .react-datepicker__day:last-child').click()
    cy.get('div[name=customerId]').click()
    cy.get('.selected.item:first-child').click()
    cy.get('textarea[name=description]').type('Project 1 description...')

    // submit
    cy.contains('Save').click()

    // we should be redirected to /projects
    cy.url().should('include', '/projects')

    // should contain Project 1
    cy.get('.content h3').should('contain', 'Project 1')
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

    // go to projects
    cy.visit(`http://${account.subdomain}.lvh.me:3000/invoices`)
  })

  it('Create invoice', function() {
    cy.contains('Create new Invoice').click()

    // Project or Sale
    cy.get('div[name=projectId]').click()
    cy.get('div[name=projectId] input').type('Project 1')
    cy.get('.visible.menu > .item:first-child').click()
    cy.contains('Next').click()

    // Invoice details 
    cy.get('input[name=interestInArrears]').type('5')
    cy.get('input[name=tax]').type('15')
    cy.get('textarea[name=description]').type('Invoice for Project 1.')
    cy.contains('Next').click()

    // should contain Project 1
    cy.get('table:nth-child(2) tr:first-child td:nth-child(2)').should('contain', 'Project 1')

    cy.contains('Save').click()

    // we should be redirected to /invoices
    cy.url().should('include', '/invoices')

    // should contain Invoice for (Project 1)
    cy.get('table tr:first-child td:first-child').should('contain', 'Project 1')
  })

  it('Update invoice', function() {
    cy.get('table tr:first-child td:last-child .ui.buttons > a:first-child').click()

    cy.get('div[name=status]').click()
    cy.get('.visible.menu > .item:nth-child(2)').click()

    cy.contains('Next').click()
    cy.contains('Save').click()

    // we should be redirected to /invoices
    cy.url().should('include', '/invoices')

    // should contain Task 1 updated
    cy.get('table tr:first-child td:nth-child(5) div').should('contain', 'pending')
  })

  it('Delete invoice', function() {
    cy.get('table tr:first-child td:last-child .ui.buttons > a:last-child').click()

    cy.contains('Delete').click()

    // confirm delete
    cy.get('.actions > .ui.negative.button').click()

    // we should be redirected to /invoices
    cy.url().should('include', '/invoices')

    // should not contain Project
    cy.get('table tr:first-child td:first-child').not('contain', 'Project 1')
  })
})
