import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

// Localization 
import T from 'i18n-react'

import moment from 'moment'

export default function Confirmation ({ id, step2, sale, project, handlePrevious, handleSubmit, isLoading, errors }) {

  return (
    <form className={classnames("ui form text container", { loading: isLoading })}>
      { !!errors.message && <div className="ui negative message"><p>{errors.message}</p></div> } 

      <div className="inline field"> 
        {id ? <h1 className="ui header">{T.translate("invoices.form.edit_invoice")}</h1> : 
          <h1 className="ui header">{T.translate("invoices.form.new_invoice")}
            <div className="sub header d-inline-block pl-1">{T.translate("invoices.form.confirmation")}</div>
          </h1>
        }
      </div> 
      
      <table className="ui column very basic collapsing celled table">
        <tbody>
          <tr>
            <td>
              <i className="ui tiny header">{T.translate("invoices.show.deadline")}</i>
            </td>
            <td>
              {step2.deadline ? moment(step2.deadline).format('ll')  : '-'}
            </td>
          </tr>
          <tr>
            <td>
              <i className="ui tiny header">{T.translate("invoices.show.status")}</i>
            </td>
            <td>
              <div className={classnames("ui tiny uppercase label", {blue: step2.status === 'new' || step2.status === '', orange: step2.status === 'pending', green: step2.status === 'paid', red: step2.status === 'overdue'})}>{step2.status ? step2.status : 'new' }</div>
            </td>
          </tr>
          <tr>
            <td>
              <i className="ui tiny header">{T.translate("invoices.show.payment_term")}</i>
            </td>
            <td>
              {step2.paymentTerm ? step2.paymentTerm : '-'}
            </td>
          </tr>
          <tr>
            <td>
              <i className="ui tiny header">{T.translate("invoices.show.interest_in_arrears")}</i>
            </td>
            <td>
              {step2.interestInArrears}
            </td>
          </tr>
          <tr>
            <td>
              <i className="ui tiny header"><strong>{T.translate("invoices.show.total")}</strong></i>
            </td>
            <td>
              {project && project.total} {sale && sale.total}
            </td>
          </tr>
          <tr>
            <td>
              <i className="ui tiny header">{T.translate("invoices.show.tax")}</i>
            </td>
            <td>
              {step2.tax}
            </td>
          </tr>
          <tr>
            <td>
              <i className="ui tiny header">{T.translate("invoices.show.description")}</i>
            </td>
            <td>
              {step2.description ? step2.description : '-'}
            </td>
          </tr>
        </tbody>
      </table>
      
      {sale &&
        <div>
          <div className="inline field"> 
            <h2 className="ui header">{T.translate("invoices.form.sale.header")}</h2>
          </div>
          <table className="ui very basic collapsing celled table">
            <tbody>
              <tr>
                <td>
                  <i className="ui tiny header">{T.translate("invoices.form.sale.name")}</i>
                </td>
                <td>
                  {sale.name}
                </td>
              </tr>
              <tr>
                <td>
                  <i className="ui tiny header">{T.translate("invoices.form.sale.status")}</i>
                </td>
                <td>
                  <div className={classnames("ui tiny uppercase label", {blue: sale.status === 'new', orange: sale.status === 'in progress', green: sale.status === 'finished' || sale.status === 'delivered', red: sale.status === 'delayed'})}> 
                    {sale.status}
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <i className="ui tiny header">{T.translate("invoices.form.sale.customer")}</i>
                </td>
                <td>
                  {id ? step2.customer.name : sale.customer_name }
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      }
      
      {project &&
        <div>
          <div className="inline field"> 
            <h2 className="ui header">{T.translate("invoices.form.project.header")}</h2>
          </div>
          <table className="ui very basic collapsing celled table">
            <tbody>
              <tr>
                <td>
                  <i className="ui tiny header">{T.translate("invoices.form.project.name")}</i>
                </td>
                <td>
                  {project.name}
                </td>
              </tr>
              <tr>
                <td>
                  <i className="ui tiny header">{T.translate("invoices.form.project.status")}</i>
                </td>
                <td>
                  <div className={classnames("ui tiny uppercase label", {blue: project.status === 'new', orange: project.status === 'in progress', green: project.status === 'finished' || project.status === 'delivered', red: project.status === 'delayed'})}> 
                {project.status}
              </div>
                </td>
              </tr>
              <tr>
                <td>
                  <i className="ui tiny header">{T.translate("invoices.form.project.customer")}</i>
                </td>
                <td>
                  {id ? step2.customer.name : project.customer_name }
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      }
      <br/>

      <div className="inline field">    
        <button className="ui button" onClick={handlePrevious}><i className="chevron left icon"></i>{T.translate("invoices.form.previous")}</button>
        <button disabled={isLoading} className="ui primary button" onClick={handleSubmit}><i className="check circle outline icon" aria-hidden="true"></i>&nbsp;{T.translate("invoices.form.save")}</button>
        
        <Link to="/invoices" className="ui negative d-block mt-3">{T.translate("invoices.form.cancel")}</Link>
      </div>  
    </form>
    )
}

