import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
// Semantic UI Form elements
import { Input, Select, TextArea, Form, Divider, Icon, Header, Button } from 'semantic-ui-react'

// Localization 
import T from 'i18n-react'

// Datepicker 
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function Details({ id, step1, step2, handleChangeDate, handleChange, handlePrevious, handleNext, errors}) {

  const paymentTermOptions = Array(99).fill().map((key, value) => 
    ({ key: value, value: value, text: value })
    )
  const paymentTermOptionsWithDefault = [{ key: 'default', value: '', text: T.translate("invoices.form.select_days") }, ...paymentTermOptions]
  return (
    <Form> 
      <div className="inline field"> 
        {id ? <Header>{T.translate("invoices.form.edit_invoice")}</Header> : 
          <Header as='h1'>{T.translate("invoices.form.new_invoice")}
            <Header.Subheader className="d-inline-block pl-1">{T.translate("invoices.form.invoice_details")}</Header.Subheader>
          </Header>
        }
      </div>
      <fieldset className="custom-fieldset">
        <legend className="custom-legend">{T.translate("invoices.form.select_payment_term_or_deadline")}</legend>

        <Form.Field inline error={!!errors.deadline}>
          <label>{T.translate("invoices.form.deadline")}</label>
          <DatePicker
            dateFormat="dd/MM/yyyy"
            selected={step2.deadline}
            onChange={handleChangeDate}
          />
          <span className="red d-inline-block">{errors.deadline}</span>
        </Form.Field>
        
        <Divider horizontal>Or</Divider>

        <Form.Field inline error={!!errors.paymentTerm}>
          <label>{T.translate("invoices.form.payment_term")}</label>
          <Select 
            placeholder={T.translate("invoices.form.select_days")}
            name="paymentTerm" 
            value={step2.paymentTerm ? step2.paymentTerm : ''} 
            onChange={(e, {value}) => handleChange('paymentTerm', value)} 
            error={!!errors.paymentTerm}
            options={paymentTermOptionsWithDefault}
            search
            searchInput={{ type: 'number' }}
            selection
          />
          <span className="red">{errors.paymentTerm}</span>
        </Form.Field>
      </fieldset>  

      <Form.Field inline  error={!!errors.interestInArrears}>
        <label>{T.translate("invoices.form.interest_in_arrears")}</label>
        <Input 
          placeholder="0"
          label={{ basic: true, content: '%' }}
          labelPosition='right'
          name="interestInArrears" 
          value={step2.interestInArrears && step2.interestInArrears} 
          onChange={(e, {value}) => handleChange('interestInArrears', value)} 
          error={!!errors.interestInArrears}
          style={{ width: '67% !important' }}
        />
        <span className="red">{errors.interestInArrears}</span>
      </Form.Field>

      <Form.Field inline error={!!errors.tax}>
        <label>{T.translate("invoices.form.tax")}</label>
        <Input 
          placeholder="0"
          label={{ basic: true, content: '%' }}
          labelPosition='right'
          name="tax" 
          value={step2.tax && step2.tax} 
          onChange={(e, {value}) => handleChange('tax', value)} 
          error={!!errors.tax}
          style={{ width: '67% !important' }}
        />
        <span className="red">{errors.tax}</span>
      </Form.Field>
      
      {step1.sale &&
        <Form.Field inline error={!!errors.total}>
          <label>{T.translate("invoices.form.total")}</label>
          <Input 
            placeholder="0%"
            name="total" 
            value={step1.sale.total} 
            onChange={(e, {value}) => handleChange('total', value)} 
            error={!!errors.total}
            disabled={true}
          />
          <span className="red">{errors.total}</span>
        </Form.Field>
      }
      
      {step1.project &&
        <Form.Field inline error={!!errors.total}>
          <label>{T.translate("invoices.form.total")}</label>
          <Input 
            placeholder="0%"
            name="total" 
            value={step1.project.total} 
            onChange={(e, {value}) => handleChange('total', value)} 
            error={!!errors.total}
            disabled={true}
          />
          <span className="red">{errors.total}</span>
        </Form.Field>
      }

      { id &&
        <Form.Field inline className={classnames("show", {blue: step2.status === 'new', orange: step2.status === 'pending', 
          green: step2.status === 'paid', red: step2.status === 'overdue', error: !!errors.staus})}>
          <label>{T.translate("invoices.form.status")}</label>
          <Select 
            placeholder={T.translate("invoices.form.select_status")}
            name="status"
            value={step2.status && step2.status} 
            onChange={(e, {value}) => handleChange('status', value)} 
            error={!!errors.staus}
            options={[
              { key: "default", value: "new", disabled: true, text: 'NEW' },
              { key: "pending", value: "pending", text: 'PENDING' },
              { key: "paid", value: "paid", text: 'PAID' },
              { key: "overdue", value: "overdue", text: 'OVERDUE' }
            ]}
            selection
          />
          <span className="red">{errors.status}</span>
        </Form.Field>
      }

      <Form.Field inline>  
        <label>{T.translate("invoices.form.description")}</label>
        <TextArea
          placeholder={T.translate("invoices.form.description")}
          name="description" 
          value={step2.description} 
          onChange={(e, {value}) => handleChange('description', value)} 
        />
        <span className={classnames({red: !!errors.description})}>{errors.status}</span>
      </Form.Field>

      <div className="inline field mt-5"> 
        <Button onClick={handlePrevious}><Icon name="chevron left" />{T.translate("invoices.form.previous")}</Button>
        <Button primary onClick={handleNext}>{T.translate("invoices.form.next")}<Icon name="chevron right" /></Button>

        <Link to="/invoices" className="ui primary outline button mt-3"> 
          <Icon name="minus circle" />
          {T.translate("invoices.form.cancel")}
        </Link>
      </div>  
    </Form> 
    )
}

