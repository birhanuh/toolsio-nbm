describe("Events", function() {
  // creates a closure around 'account'
  let account;

  before(function() {
    // redefine account
    account = {
      firstName: "Testa",
      lastName: "Testa",
      email: "testa@toolsio.com",
      password: "ppppp",
      industry: "IT",
      subdomain: Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, "")
        .substr(0, 5)
    };

    cy.visit("/");

    cy.contains("Sign up").click();

    const { firstName, lastName, email, password, subdomain } = account;

    cy.get("input[name=firstName]").type(firstName);
    cy.get("input[name=lastName]").type(lastName);
    cy.get("input[name=email]").type(email);
    cy.get("input[name=password]").type(password);
    cy.get("input[name=confirmPassword]").type(password);
    cy.get("div[name=industry]").click();
    cy.get("div[name=industry] .item:first-child").click();
    cy.get("input[name=subdomain]").type(subdomain);

    // submit
    cy.contains("Sign up").click();

    // we should be redirected to /login
    cy.visit(`http://${subdomain}.lvh.me:3000/login`);

    // login
    cy.get("input[name=email]").type(email);
    // {enter} causes the form to submit
    cy.get("input[name=password]").type(`${password}{enter}`);

    // we should be redirected to /dashboard
    cy.url().should("include", `http://${subdomain}.lvh.me:3000/dashboard`);

    // go to events
    cy.visit(`http://${account.subdomain}.lvh.me:3000/events`);
  });

  beforeEach(function() {
    Cypress.Cookies.preserveOnce("currentAccount");
  });

  it("Create event", function() {
    cy.get(
      ".fc-widget-content .fc-row:nth-child(5) .fc-bg table tr .fc-widget-content.fc-today"
    ).click();

    cy.get(".ui.form input[name=title]").type("Event 1");
    cy.get(".ui.form input[name=url]").type("http://example.com");
    cy.get(".ui.form textarea[name=description]").type(
      "Event 1 description..."
    );

    // submit
    cy.contains("Save").click();

    // we should be redirected to /events
    cy.url().should("include", "/events");

    // should contain Customera
    cy.get(
      ".fc-widget-content .fc-row:nth-child(5) .fc-content-skeleton table tr td.fc-event-container .fc-content span:nth-child(2)"
    ).should("contain", "Event 1");
  });

  it("Edit event", function() {
    cy.get(
      ".fc-widget-content .fc-row:nth-child(5) .fc-content-skeleton table tr td.fc-event-container a"
    ).click();

    cy.get(".ui.form input[name=title]").type(" updated");

    // submit
    cy.contains("Save").click();

    // we should be redirected to /events
    cy.url().should("include", "/events");

    // should contain Customera
    cy.get(
      ".fc-widget-content .fc-row:nth-child(5) .fc-content-skeleton table tr td.fc-event-container .fc-content span:nth-child(2)"
    ).should("contain", "Event 1 updated");
  });

  xit("Delete event", function() {
    cy.contains("Delete").click();

    // confirm delete
    cy.get(".actions > .ui.negative.button").click();

    // we should be redirected to /settings
    cy.url().should("include", "/");

    // should contain Your account is now...
    cy.get(".ui.message p]").should(
      "contain",
      "Your account is now deleted. Sorry to not see you again!"
    );
  });

  after(function() {
    cy.visit("/logout");

    // we should be redirected to /login
    cy.url().should("include", "/");
  });
});
