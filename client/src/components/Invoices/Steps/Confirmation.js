import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
// Semantic UI Form elements
import { Form, Table, Message, Header, Icon, Label, Button } from 'semantic-ui-react'

// Localization 
import T from 'i18n-react'

import moment from 'moment'

export default function Confirmation ({ id, step2, sale, project, handlePrevious, handleSubmit, isLoading, errors }) {

  return (
    <Form loading={isLoading}>
      { !!errors.message && <Message negative><p>{errors.message}</p></Message> } 

      <div className="inline field"> 
        {id ? <Header as='h1'>{T.translate("invoices.form.edit_invoice")}</Header> : 
          <Header as='h1'>{T.translate("invoices.form.new_invoice")}
            <Header.Subheader className="d-inline-block pl-1">{T.translate("invoices.form.confirmation")}</Header.Subheader>
          </Header>
        }
      </div> 
      
      <div className="inline field"> 
        <Table width="73%" very='basic' collapsing celled stackable>
          <tbody>
            <tr>
              <td>
                <i><Header size='tiny'>{T.translate("invoices.show.deadline")}</Header></i>
              </td>
              <td>
                {step2.deadline ? moment(step2.deadline).format('ll')  : '-'}
              </td>
            </tr>
            <tr>
              <td>
                <i><Header size='tiny'>{T.translate("invoices.show.status")}</Header></i>
              </td>
              <td>
                <Label size='tiny' className={classnames("uppercase", {blue: step2.status === 'new' || step2.status === '', orange: step2.status === 'pending', green: step2.status === 'paid', red: step2.status === 'overdue'})}>{step2.status ? step2.status : 'new' }</Label>
              </td>
            </tr>
            <tr>
              <td>
                <i><Header size='tiny'>{T.translate("invoices.show.payment_term")}</Header></i>
              </td>
              <td>
                {step2.paymentTerm ? step2.paymentTerm : '-'}
              </td>
            </tr>
            <tr>
              <td>
                <i><Header size='tiny'>{T.translate("invoices.show.interest_in_arrears")}</Header></i>
              </td>
              <td>
                {step2.interestInArrears}
              </td>
            </tr>
            <tr>
              <td>
                <i><Header size='tiny'><strong>{T.translate("invoices.show.total")}</strong></Header></i>
              </td>
              <td>
                {project && project.total} {sale && sale.total}
              </td>
            </tr>
            <tr>
              <td>
                <i><Header size='tiny'>{T.translate("invoices.show.tax")}</Header></i>
              </td>
              <td>
                {step2.tax}
              </td>
            </tr>
            <tr>
              <td>
                <i><Header size='tiny'>{T.translate("invoices.show.description")}</Header></i>
              </td>
              <td>
                {step2.description ? step2.description : '-'}
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
      
      {sale &&
        <div className="inline field"> 
          <Header as='h2'>{T.translate("invoices.form.sale.header")}</Header>
         
          <Table width="73%" very='basic' collapsing celled>
            <tbody>
              <tr>
                <td>
                  <i><Header size='tiny'>{T.translate("invoices.form.sale.name")}</Header></i>
                </td>
                <td>
                  {sale.name}
                </td>
              </tr>
              <tr>
                <td>
                  <i><Header size='tiny'>{T.translate("invoices.form.sale.status")}</Header></i>
                </td>
                <td>
                  <div className={classnames("ui tiny uppercase label", {blue: sale.status === 'new', orange: sale.status === 'in progress', green: sale.status === 'finished' || sale.status === 'delivered', red: sale.status === 'delayed'})}> 
                    {sale.status}
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <i><Header size='tiny'>{T.translate("invoices.form.sale.customer")}</Header></i>
                </td>
                <td>
                  {id ? step2.customer.name : sale.customer_name }
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      }
      
      {project &&
        <div className="inline field"> 
          <Header as='h2'>{T.translate("invoices.form.project.header")}</Header>
          <Table width="73%" very='basic' collapsing celled>
            <tbody>
              <tr>
                <td>
                  <i><Header size='tiny'>{T.translate("invoices.form.project.name")}</Header></i>
                </td>
                <td>
                  {project.name}
                </td>
              </tr>
              <tr>
                <td>
                  <i><Header size='tiny'>{T.translate("invoices.form.project.status")}</Header></i>
                </td>
                <td>
                  <div className={classnames("ui tiny uppercase label", {blue: project.status === 'new', orange: project.status === 'in progress', green: project.status === 'finished' || project.status === 'delivered', red: project.status === 'delayed'})}> 
                {project.status}
              </div>
                </td>
              </tr>
              <tr>
                <td>
                  <i><Header size='tiny'>{T.translate("invoices.form.project.customer")}</Header></i>
                </td>
                <td>
                  {id ? step2.customer.name : project.customer_name }
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      }
      <br/>

      <div className="inline field">    
        <Button onClick={handlePrevious}><Icon className="chevron left icon" />{T.translate("invoices.form.previous")}</Button>
        <Button primary disabled={isLoading} onClick={handleSubmit}><Icon name="check circle outline" />&nbsp;{T.translate("invoices.form.save")}</Button>
        
        <Link to="/invoices" className="ui primary outline button mt-3"> 
          <Icon name="minus circle" />
          {T.translate("invoices.form.cancel")}
        </Link>
      </div>  
    </Form>
    )
}

