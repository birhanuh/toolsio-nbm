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

    cy.get('.content .ui.header.blue').click()
  })

  it('Create task', function() {
    cy.get('input[name=name]').type('Task 1')
    cy.get('div[name=paymentType]').click()
    cy.get('.visible.menu > .item:first-child').click()
    cy.get('input[name=hours]').type('1.5')
    cy.get('input[name=unitPrice]').type('20')

    // submit
    cy.contains('Add Task').click()

    // should contain Task 1
    cy.get('table td.show-task:first-child').should('contain', 'Task 1')
  })

  it('Update task', function() {
    cy.get('.ui.buttons.show-task > button:last-child').click()

    cy.get('table.tasks tr:first-child input[name=name]:first-child').type(' updated')

    // submit
    cy.get('.ui.buttons.edit-task > button:last-child').click()

    // should contain Task 1 updated
    cy.get('table td.show-task:first-child').should('contain', 'Task 1 updated')
  })

  it('Delete task', function() {
    cy.get('.ui.buttons.show-task:last-child > button:first-child').click()

    // confirm delete
    cy.get('.actions > .ui.negative.button').click()

    // should not contain Task 1 updated
    cy.get('table td.add-task:first-child').not('contain', 'Task 1 updated')
  })
})
