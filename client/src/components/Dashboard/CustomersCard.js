import React from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
// Semantic UI Form elements
import { Header, Card, Icon, Image } from "semantic-ui-react";
import { Query } from "react-apollo";
import { GET_CUSTOMERS_DATA } from "../../graphql/dashboard";

import { Polar } from "react-chartjs-2";

// Localization
import T from "i18n-react";

const CustomersCard = () => (
  <Query query={GET_CUSTOMERS_DATA}>
    {({ loading, error, data }) => {
      const nameCountProjectsSales =
        data.getCustomersData && data.getCustomersData.nameCountProjectsSales;
      const countCustomers =
        data.getCustomersData && data.getCustomersData.countCustomers;

      let colorsCollection = [
        "#25959f",
        "#038b98",
        "#165b61",
        "#88A60D",
        "#7DA40D",
        "#619E0D",
        "#BE220A",
        "#be0a0a",
        "#B50921",
        "#FAC30A",
        "#faca0a",
        "#FAD10A",
        "#f08b34",
        "#F0730F",
        "#c05c0c",
        "#199CD5",
        "#1C89D6",
        "#FFF5DD",
        "#ffecbf",
        "#DAC084",
        "#b6b6b6",
        "#cccccc",
        "#d6d6d6",
        "#3C3C3C",
        " #484848",
        "#2d2f32",
        "#3b3f45",
        "#5e656e"
      ];

      const nameCountProjectsSalesColors =
        nameCountProjectsSales &&
        nameCountProjectsSales.map(item => ({
          name: item.name,
          projectsSalesCount: item.projectsSalesCount,
          color:
            colorsCollection[
              Math.floor(Math.random() * colorsCollection.length)
            ]
        }));

      const names =
        nameCountProjectsSalesColors &&
        nameCountProjectsSalesColors.map(item => item.name);
      const projectsSalesCounts =
        nameCountProjectsSalesColors &&
        nameCountProjectsSalesColors.map(item => item.projectsSalesCount);
      const colors =
        nameCountProjectsSalesColors &&
        nameCountProjectsSalesColors.map(item => item.color);

      let chartData = {
        labels: names,
        datasets: [
          {
            data: projectsSalesCounts,
            backgroundColor: colors
          }
        ]
      };

      const chartOptions = {
        responsive: true,
        legend: {
          position: "right"
        },
        title: {
          display: true,
          text: T.translate(
            "dashboard.customers.customer_project_sale_relationship"
          )
        },
        scale: {
          ticks: {
            beginAtZero: true
          },
          reverse: false
        },
        animation: {
          animateRotate: false,
          animateScale: true
        }
      };

      return (
        <Card
          id="customers"
          className={classnames("dashboard customer form", {
            loading: loading
          })}
        >
          <Card.Content>
            <Card.Header>
              <Header as="h4" floated="left">
                {T.translate("dashboard.customers.header")}
              </Header>
              <Header as="h4" floated="right" className="mr-0">
                <Icon floated="right" name="users" className="mr-0" />
              </Header>
            </Card.Header>
          </Card.Content>
          <Image>
            <Polar data={chartData} options={chartOptions} />
          </Image>
          <Card.Header className="p-5">
            {!!error && (
              <div className="ui negative message">
                <p>{error.message}</p>
              </div>
            )}
          </Card.Header>

          {countCustomers === 0 && (
            <div className="content-btn-outer-container">
              <div className="content-btn-inner-container">
                <Link
                  to="/customers"
                  className="ui primary outline button small"
                >
                  <Icon name="check circle outline" />
                  {T.translate("dashboard.customers.create_first_customer")}
                </Link>
              </div>
            </div>
          )}
        </Card>
      );
    }}
  </Query>
);

export default CustomersCard;
