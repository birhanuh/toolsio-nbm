import React from 'react'
import { Link } from 'react-router-dom'
import { SelectField } from '../../../utils/FormFields'

// Localization 
import T from 'i18n-react'

export default function SaleProject({ _id, step1, salesOptions, projectsOptions, handleChange, handleNext, errors }) {

  return (
    <div className="row">
      <div className="ui text container ui segment"> 
        <div className="inline field"> 
          {_id ? <h1 className="ui header">{T.translate("invoices.form.edit_invoice")}</h1> : 
            <h1 className="ui header">{T.translate("invoices.form.new_invoice")}
              <div className="sub header inline-block-i pl-1">{T.translate("invoices.form.sale_or_project")}</div>
            </h1>
          }
        </div>
        
        <fieldset className="custom-fieldset">
          <legend className="custom-legend">{T.translate("invoices.form.select_sale_or_project")}</legend>
          
          <SelectField
            label={T.translate("invoices.form.sales")}
            name="sale"
            value={step1.sale ? step1.sale : ''} 
            onChange={handleChange} 
            error={errors.message && errors.message.errors && errors.message.errors.sale && errors.message.errors.sale.message}
            formClass="inline field"

            options={[<option key="default" value="">{T.translate("invoices.form.select_sale")}</option>,
              salesOptions]}
          />

           <div className="ui horizontal divider">Or</div>

           <SelectField
            label={T.translate("invoices.form.projects")}
            name="project"
            value={step1.project ? step1.project : ''} 
            onChange={handleChange} 
            error={errors.message && errors.message.errors && errors.message.errors.project && errors.message.errors.project.message}
            formClass="inline field"

            options={[<option key="default" value="">{T.translate("invoices.form.select_project")}</option>,
              projectsOptions]}
          />
        </fieldset>

        <div className="inline field mt-5"> 
          <button className="ui primary button" onClick={handleNext}>{T.translate("invoices.form.next")}<i className="chevron right icon"></i></button>

          <Link to="/invoices" className="ui negative block-i mt-3">{T.translate("invoices.form.cancel")}</Link>
        </div>  
      </div>
    </div>  
    )    
}

