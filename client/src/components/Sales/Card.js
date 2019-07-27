import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Link } from "react-router-dom";

// Localization
import T from "i18n-react";

import moment from "moment";

export default function Card({ sale }) {
  return (
    <div key={sale.id} className="card">
      <div className="content">
        <div
          className={classnames("ui uppercase tiny right ribbon label", {
            blue: sale.status === "new",
            orange: sale.status === "in progress",
            red: sale.status === "delayed",
            green: sale.status === "finished",
            turquoise: sale.status === "delivered"
          })}
        >
          {sale.status}
        </div>

        <Link
          to={`/sales/show/${sale.id}`}
          className={classnames("ui header", {
            blue: sale.status === "new",
            orange: sale.status === "in progress",
            red: sale.status === "delayed",
            green: sale.status === "finished",
            turquoise: sale.status === "delivered"
          })}
        >
          <h3>{sale.name}</h3>
        </Link>

        <div className="description">{sale.description}</div>

        <table className="ui very basic center aligned table sales">
          <thead>
            <tr>
              <th>{T.translate("sales.show.user")}</th>
              <th>{T.translate("sales.page.deadline")}</th>
              <th>{T.translate("sales.page.customer")}</th>
              <th>{T.translate("sales.page.invoiced")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{sale.user.firstName}</td>
              <td>{moment(sale.deadline).format("ll")}</td>
              <td>
                {sale.customer ? (
                  sale.customer.name
                ) : (
                  <p className="blue">
                    {T.translate("sales.page.no_customer")}
                  </p>
                )}
              </td>
              <td>
                {sale.isInvoiced === true && (
                  <i className="check circle outline green icon" />
                )}
                {sale.isInvoiced === false && (
                  <i className="times circle outline red icon" />
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

Card.propTypes = {
  sale: PropTypes.object.isRequired
};
