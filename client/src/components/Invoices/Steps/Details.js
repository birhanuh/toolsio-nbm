import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
// Semantic UI Form elements
import { Input, Select, TextArea, Form } from 'semantic-ui-react'

// Localization 
import T from 'i18n-react'

// Datepicker 
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function Details({ id, step1, step2, handleChangeDate, handleChange, handlePrevious, handleNext, errors}) {

  const paymentTermOptions = Array(99).fill().map((key, value) => 
    ({ key: value, value: value, text: value })
    )
  
  return (
    <div className="ui form"> 
      <div className="inline field"> 
        {id ? <h1 className="ui header">{T.translate("invoices.form.edit_invoice")}</h1> : 
          <h1 className="ui header">{T.translate("invoices.form.new_invoice")}
            <div className="sub header d-inline-block pl-1">{T.translate("invoices.form.invoice_details")}</div>
          </h1>
        }
      </div>
      <fieldset className="custom-fieldset">
        <legend className="custom-legend">{T.translate("invoices.form.select_payment_term_or_deadline")}</legend>

        <Form.Group inline error={errors.deadline}>
          <label>{T.translate("invoices.form.deadline")}</label>
          <DatePicker
            dateFormat="DD/MM/YYYY"
            selected={step2.deadline}
            onChange={handleChangeDate}
          />
          <span className="red">{errors.deadline}</span>
        </Form.Group>
        
        <div className="ui horizontal divider">Or</div>

        <Form.Group inline error={errors.paymentTerm}>
          <Form.Field 
            label={T.translate("invoices.form.payment_term")}
            placeholder={T.translate("invoices.form.select_days")}
            control={Select}
            name="paymentTerm" 
            value={step2.paymentTerm ? step2.paymentTerm.toString() : ''} 
            onChange={(e, {value}) => handleChange('paymentTerm', value)} 
            error={!!errors.paymentTerm}
            options={paymentTermOptions}
            selection
          />
          <span className="red">{errors.paymentTerm}</span>
        </Form.Group>
      </fieldset>  

      <Form.Group inline error={errors.interestInArrears}>
        <Form.Field 
          label={T.translate("invoices.form.interest_in_arrears")}
          placeholder="0%"
          control={Input}
          name="interestInArrears" 
          value={step2.interestInArrears && step2.interestInArrears.toString()} 
          onChange={(e, {value}) => handleChange('interestInArrears', value)} 
          error={!!errors.interestInArrears}
        />
        <span className="red">{errors.interestInArrears}</span>
      </Form.Group>

      <Form.Group inline error={errors.tax}>
        <Form.Field 
          label={T.translate("invoices.form.tax")}
          placeholder="0%"
          control={Input}
          name="tax" 
          value={step2.tax && step2.tax.toString()} 
          onChange={(e, {value}) => handleChange('tax', value)} 
          error={!!errors.tax}
          disabled={true}
        />
        <span className="red">{errors.tax}</span>
      </Form.Group>
      
      <Form.Group inline error={errors.total}>
        <Form.Field 
          label={T.translate("invoices.form.total")}
          placeholder="0%"
          control={Input}
          name="total" 
          value={(step1.sale && step1.sale.total) || (step1.project && step1.project.total)} 
          onChange={(e, {value}) => handleChange('total', value)} 
          error={!!errors.total}
          disabled={true}
        />
        <span className="red">{errors.total}</span>
      </Form.Group>

      { id &&
        <Form.Group inline error={errors.status}>
          <Form.Field 
            label={T.translate("invoices.form.status")}
            placeholder={T.translate("invoices.form.select_status")}
            control={Select}
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
        </Form.Group>
      }

      <Form.Group inline error={errors.description}>  
        <Form.Field 
          label={T.translate("invoices.form.description")}
          placeholder={T.translate("invoices.form.description")}
          control={TextArea}
          name="description" 
          value={step2.description} 
          onChange={(e, {value}) => handleChange('description', value)} 
        />
        <span className={classnames({red: !!errors.description})}>{errors.status}</span>
      </Form.Group>

      <div className="inline field mt-5"> 
        <button className="ui button" onClick={handlePrevious}><i className="chevron left icon"></i>{T.translate("invoices.form.previous")}</button>
        <button className="ui primary button" onClick={handleNext}>{T.translate("invoices.form.next")}<i className="chevron right icon"></i></button>

        <Link to="/invoices" className="ui negative d-block mt-3">{T.translate("invoices.form.cancel")}</Link>
      </div>  
    </div> 
    )
}

