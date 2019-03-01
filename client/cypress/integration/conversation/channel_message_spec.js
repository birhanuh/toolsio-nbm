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

    // go to conversations
    cy.visit(`http://${account.subdomain}.lvh.me:3000/conversations`)
  })

  it('Create Channel', function() {
    cy.contains('Create Channel').click()

    cy.get('.ui.form input[name=name]').type('Channel 1')

    // submit
    cy.get('.ui.modal .content').contains('Create').click()

    // we should be redirected to /conversations
    cy.url().should('include', '/conversations/channel')

    // should contain Channel 1
    cy.get('.messages h3').should('contain', 'Channel 1')
  })

  it('Write message', function() {
    cy.get('.conversations-sidebar a.item').click()

     // we should be redirected to /conversations
    cy.url().should('include', '/conversations/channel')

    // write message and submit
    cy.get('.ui.form textarea[name=body]').type('Test message...{enter}')

    // we should be redirected to /conversations
    cy.url().should('include', '/conversations')

    // should contain Comments
    cy.get('.ui.comments .comment').should('contain', 'Test message...')
  })
})
