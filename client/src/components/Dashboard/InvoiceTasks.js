import React from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
// Semantic UI Form elements
import { Card, Header, List, Message, Divider } from "semantic-ui-react";
import { Query } from "react-apollo";
import { GET_INVOICE_TASKS_DATA } from "../../graphql/dashboard";

// Localization
import T from "i18n-react";

const InvoiceTasksCard = () => (
  <Query query={GET_INVOICE_TASKS_DATA}>
    {({ loading, error, data }) => {
      const countStatus =
        data.getInvoiceTasksData && data.getInvoiceTasksData.countStatus;
      const idProjectStatus =
        data.getInvoiceTasksData && data.getInvoiceTasksData.idProjectStatus;
      const idSaleStatus =
        data.getInvoiceTasksData && data.getInvoiceTasksData.idSaleStatus;

      let newNotification;
      let overdueNotification;

      let newInvoices = [];
      let overdueInvoices = [];

      countStatus &&
        countStatus.map(item => {
          if (item.status === "pending") {
            newNotification = (
              <Message warning>
                <Message.Content>
                  {T.translate("dashboard.invoice_tasks.pending_invoices", {
                    count: item.count
                  })}
                </Message.Content>
              </Message>
            );
          }

          if (item.status === "overdue") {
            overdueNotification = (
              <Message negative>
                <Message.Content>
                  {T.translate("dashboard.invoice_tasks.overdue_invoices", {
                    count: item.count
                  })}
                </Message.Content>
              </Message>
            );
          }
        });

      idProjectStatus &&
        idProjectStatus.map(invoice => {
          if (invoice.status === "pending") {
            newInvoices.push(invoice);
          } else if (invoice.status === "overdue") {
            overdueInvoices.push(invoice);
          }
        });

      idSaleStatus &&
        idSaleStatus.map(invoice => {
          if (invoice.status === "pending") {
            newInvoices.push(invoice);
          } else if (invoice.status === "overdue") {
            overdueInvoices.push(invoice);
          }
        });

      const list = (
        <Card.Content>
          {newNotification}
          <List ordered>
            {newInvoices &&
              newInvoices.map(invoice => (
                <List.Item
                  key={invoice.id}
                  content={
                    <Link
                      to={`/invoices/show/${invoice.id}`}
                      className="item orange"
                    >
                      {"Invoice of " + invoice.name}
                    </Link>
                  }
                />
              ))}
          </List>

          <Divider />

          {overdueNotification}
          <List ordered>
            {overdueInvoices &&
              overdueInvoices.map(invoice => (
                <List.Item
                  key={invoice.id}
                  content={
                    <Link
                      to={`/invoices/show/${invoice.id}`}
                      className="item red"
                    >
                      {"Invoice of " + invoice.name}
                    </Link>
                  }
                />
              ))}
          </List>
        </Card.Content>
      );

      return (
        <div
          id="invoiceTask"
          className={classnames("dashboard form", { loading: loading })}
        >
          <Header as="h4">
            {T.translate("dashboard.invoice_tasks.header")}
          </Header>
          <Card>
            {countStatus && countStatus.length === 0 ? (
              <Card.Content>
                {!!error && (
                  <Message negative>
                    <p>{error.message}</p>
                  </Message>
                )}
                <Message info>
                  <Message.Content>
                    <p>
                      {T.translate(
                        "dashboard.invoice_tasks.no_pending_invoices"
                      )}
                    </p>
                    <p>
                      {T.translate(
                        "dashboard.invoice_tasks.no_overdue_invoices"
                      )}
                    </p>
                  </Message.Content>
                </Message>
              </Card.Content>
            ) : (
              list
            )}
          </Card>
        </div>
      );
    }}
  </Query>
);

export default InvoiceTasksCard;
