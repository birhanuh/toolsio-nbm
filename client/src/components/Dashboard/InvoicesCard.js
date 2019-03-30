import React from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
// Semantic UI Form elements
import { Segment, Header, Card, Icon, Image, Message } from "semantic-ui-react";
import { Query } from "react-apollo";
import { GET_INVOICES_DATA } from "../../graphql/dashboard";

import pick from "lodash/pick";
import groupBy from "lodash/groupBy";
import Moment from "moment";

import { Bar } from "react-chartjs-2";

// Localization
import T from "i18n-react";

const InvoicesCard = () => (
  <Query query={GET_INVOICES_DATA}>
    {({ loading, error, data }) => {
      let d = new Date();
      let year = d.getFullYear();
      let m = d.getMonth();
      let m1 = d.getMonth() - 1;
      let m2 = d.getMonth() - 2;
      let m3 = d.getMonth() - 3;

      let monthYear = [
        `Jan/${year}`,
        `Feb/${year}`,
        `Mar/${year}`,
        `Apr/${year}`,
        `May/${year}`,
        `Jun/${year}`,
        `Jul/${year}`,
        `Aug/${year}`,
        `Sep/${year}`,
        `Oct/${year}`,
        `Nov/${year}`,
        `Dec/${year}`
      ];

      let labels = [monthYear[m3], monthYear[m2], monthYear[m1], monthYear[m]];

      const countStatusMonth =
        data.getInvoicesData && data.getInvoicesData.countStatusMonth;
      const countMonth =
        data.getInvoicesData &&
        data.getInvoicesData.countMonth.map(item =>
          pick(item, ["month", "count"])
        );

      let countMonthSorted =
        countMonth &&
        countMonth.sort(function(a, b) {
          let x = new Date(Moment(a.month, "MM/YYYY"));
          let y = new Date(Moment(b.month, "MM/YYYY"));
          return x < y ? -1 : x > y ? 1 : 0;
        });

      let newData = [0, 0, 0, 0];
      let paidData = [0, 0, 0, 0];
      let pendingData = [0, 0, 0, 0];
      let overdueData = [0, 0, 0, 0];

      let groupByStatus =
        countStatusMonth && groupBy(countStatusMonth, "status");

      // Last four month New statuses
      groupByStatus &&
        groupByStatus["new"] &&
        groupByStatus["new"].map(
          item =>
            (newData[labels.findIndex(label => label === item.month)] =
              item.count)
        );

      // Last four month Paid statuses
      groupByStatus &&
        groupByStatus["paid"] &&
        groupByStatus["paid"].map(
          item =>
            (paidData[labels.findIndex(label => label === item.month)] =
              item.count)
        );

      // Last four month Pending statuses
      groupByStatus &&
        groupByStatus["pending"] &&
        groupByStatus["pending"].map(
          item =>
            (pendingData[labels.findIndex(label => label === item.month)] =
              item.count)
        );

      // Last four month Overdue statuses
      groupByStatus &&
        groupByStatus["overdue"] &&
        groupByStatus["overdue"].map(
          item =>
            (overdueData[labels.findIndex(label => label === item.month)] =
              item.count)
        );

      let chartData = {
        labels: labels,
        datasets: [
          {
            label: "New",
            data: newData,
            backgroundColor: "rgba(25,156,213,0.75)",
            hoverBackgroundColor: "rgba(25,156,213,0.9)",
            borderWidth: 2
          },
          {
            label: "Paid",
            data: paidData,
            backgroundColor: "rgba(125,164,13,0.75)",
            hoverBackgroundColor: "rgba(125,164,13,0.9)",
            borderWidth: 2
          },
          {
            label: "Pending",
            data: pendingData,
            backgroundColor: "rgba(240,115,15,0.75)",
            hoverBackgroundColor: "rgba(240,115,15,0.9)",
            borderWidth: 2
          },
          {
            label: "Overdue",
            data: overdueData,
            backgroundColor: "rgba(190,10,10,0.75)",
            hoverBackgroundColor: "rgba(190,10,10,0.9)",
            borderWidth: 2
          }
        ],
        scaleBeginAtZero: true,
        scaleShowGridLines: true,
        scaleGridLineColor: "rgba(0,0,0,.05)",
        scaleGridLineWidth: 1,
        barShowStroke: true,
        barStrokeWidth: 1,
        barValueSpacing: 5,
        barDatasetSpacing: 1,
        responsive: true
      };

      const chartOptions = {
        responsive: true,
        tooltips: {
          mode: "label"
        },
        hover: {
          mode: "dataset"
        },
        options: {
          legend: {
            borderWidth: false
          }
        }
        // scales: {
        //   xAxes: [{
        //     stacked: true,
        //   }],
        //   yAxes: [{
        //     stacked: true
        //   }]
        // }
      };

      return (
        <Card
          id="invoices"
          className={classnames("dashboard form", { loading: loading })}
        >
          <Card.Content>
            <Card.Header>
              <Header as="h4" floated="left">
                {T.translate("dashboard.invoices.header")}
              </Header>
              <Header as="h4" floated="right" className="mr-0">
                <Icon
                  floated="right"
                  name="file text outline"
                  className="mr-0"
                />
              </Header>
            </Card.Header>
          </Card.Content>
          <Image>
            <Bar data={chartData} options={chartOptions} height={100} />
          </Image>

          <Card.Content extra>
            {!!error && (
              <Message negative>
                <p>{error.message}</p>
              </Message>
            )}
            <Segment vertical floated="left" className="p-0">
              <Card.Meta>
                {countMonthSorted && countMonthSorted[0]
                  ? countMonthSorted[0].month
                    ? countMonthSorted[0].month
                    : "-"
                  : "-"}
              </Card.Meta>
              <Card.Header>
                {countMonthSorted && countMonthSorted[0]
                  ? countMonthSorted[0].count
                    ? countMonthSorted[0].count
                    : "-"
                  : "-"}
              </Card.Header>
            </Segment>
            <Segment vertical floated="right" className="p-0">
              <Card.Meta>
                {countMonthSorted && countMonthSorted[1]
                  ? countMonthSorted[1].month
                    ? countMonthSorted[1].month
                    : "-"
                  : "-"}
              </Card.Meta>
              <Card.Header>
                {countMonthSorted && countMonthSorted[1]
                  ? countMonthSorted[1].count
                    ? countMonthSorted[1].count
                    : "-"
                  : "-"}
                {countMonthSorted &&
                  countMonthSorted.count &&
                  countMonthSorted.count.length !== 0 &&
                  (countMonthSorted[0].count > countMonthSorted[1].count ? (
                    <Icon name="long arrow down" className="red" />
                  ) : (
                    <Icon name="long arrow up" className="green" />
                  ))}
              </Card.Header>
            </Segment>
          </Card.Content>

          {((countStatusMonth && countStatusMonth.length === 0) ||
            (countMonth && countMonth.length === 0)) && (
            <div className="content-btn-outer-container">
              <div className="content-btn-inner-container">
                <Link
                  to="/invoices"
                  className="ui primary outline button small"
                >
                  <i className="check circle outline icon" />
                  {T.translate("dashboard.invoices.create_first_invoice")}
                </Link>
              </div>
            </div>
          )}
        </Card>
      );
    }}
  </Query>
);

export default InvoicesCard;
