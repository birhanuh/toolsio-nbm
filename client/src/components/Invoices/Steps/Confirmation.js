import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

// Localization 
import T from 'i18n-react'

export default function Confirmation ({ _id, step2, sale, project, handlePrevious, handleSubmit, isLoading }) {

  return (
    <div className="row">
      <div className="ui text container segment"> 
        <div className="inline field"> 
          {_id ? <h1 className="ui header">{T.translate("invoices.form.edit_invoice")}</h1> : 
            <h1 className="ui header">{T.translate("invoices.form.new_invoice")}
              <div className="sub header d-inline-block pl-1">{T.translate("invoices.form.confirmation")}</div>
            </h1>
          }
        </div> 
        
        <dl className="dl-horizontal">
          {/*<dt>{T.translate("invoices.show.user")}</dt>
          <dd>{invoice.user.first_name}</dd>*/}  
          <dt>{T.translate("invoices.show.deadline")}</dt>
          <dd>{step2.deadline ? step2.deadline.toString() : '-'}</dd>
          <dt>{T.translate("invoices.show.status")}</dt>
          <dd><div className={classnames("ui tiny uppercase label", {blue: step2.status === 'new' || step2.status === '', orange: step2.status === 'pending', green: step2.status === 'paid', red: step2.status === 'overdue'})}>{step2.status ? step2.status : 'new' }</div></dd>
          <dt>{T.translate("invoices.show.payment_term")}</dt>
          <dd>{step2.paymentTerm ? step2.paymentTerm : '-'}</dd>
          <dt>{T.translate("invoices.show.interest_in_arrears")}</dt>
          <dd>{step2.interestInArrears}</dd>
          <dt>{T.translate("invoices.show.description")}</dt>
          <dd>{step2.description}</dd>
        </dl>  
        
        {sale &&
          <div>
            <div className="inline field"> 
              <h2 className="ui header">{T.translate("invoices.form.sale.header")}</h2>
            </div>
            <dl className="dl-horizontal">
              <dt>{T.translate("invoices.form.sale.name")}</dt>
              <dd>{sale.name}</dd>
              <dt>{T.translate("invoices.form.sale.status")}</dt>
              <dd>
                <div className={classnames("ui tiny uppercase label", {blue: sale.status === 'new', orange: sale.status === 'in progress', green: sale.status === 'ready' || sale.status === 'delivered', red: sale.status === 'delayed'})}> 
                  {sale.status}
                </div>
              </dd>
              <dt>{T.translate("invoices.form.sale.customer")}</dt>
              <dd>{sale.customer && sale.customer.name}</dd>
            </dl>
          </div>
        }
        
        {project &&
          <div>
            <div className="inline field"> 
              <h2 className="ui header">{T.translate("invoices.form.project.header")}</h2>
            </div>
            <dl className="dl-horizontal">
              <dt>{T.translate("invoices.form.project.name")}</dt>
              <dd>{project.name}</dd>
              <dt>{T.translate("invoices.form.project.status")}</dt>
              <dd>
                <div className={classnames("ui tiny uppercase label", {blue: project.status === 'new', orange: project.status === 'in progress', green: project.status === 'finished' || project.status === 'delivered', red: project.status === 'delayed'})}> 
                  {project.status}
                </div>
              </dd>
              <dt>{T.translate("invoices.form.project.customer")}</dt>
              <dd>{project.customer && project.customer.name}</dd>
            </dl>
          </div>
        }
        <br/>

        <div className="inline field">    
          <button className="ui button" onClick={handlePrevious}><i className="chevron left icon"></i>{T.translate("invoices.form.previous")}</button>
          <button disabled={isLoading} className="ui primary button" onClick={handleSubmit}><i className="check circle outline icon" aria-hidden="true"></i>&nbsp;{T.translate("invoices.form.save")}</button>
          
          <Link to="/invoices" className="ui negative d-block mt-3">{T.translate("invoices.form.cancel")}</Link>
        </div>  
      </div>
    </div>
    )
}

