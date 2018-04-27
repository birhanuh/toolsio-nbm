import React from 'react'
import { Link } from 'react-router-dom'
import { SelectField } from '../../../utils/FormFields'

// Localization 
import T from 'i18n-react'

export default function SaleProject({ id, step1, salesOption, projectsOption, handleChange, handleNext, errors }) {
  return (
    <div className="ui form"> 
      <div className="inline field"> 
        {id ? <h1 className="ui header">{T.translate("invoices.form.edit_invoice")}</h1> : 
          <h1 className="ui header">{T.translate("invoices.form.new_invoice")}
            <div className="sub header d-inline-block pl-1">{T.translate("invoices.form.sale_or_project")}</div>
          </h1>
        }
      </div>
      
      <fieldset className="custom-fieldset">
        <legend className="custom-legend">{T.translate("invoices.form.select_sale_or_project")}</legend>
        
        <SelectField
          label={T.translate("invoices.form.sales")}
          name="saleId"
          value={step1.saleId ? step1.saleId : ''} 
          onChange={handleChange} 
          error={errors.sale}
          formClass="inline field"

          options={[<option key="default" value="">{T.translate("invoices.form.select_sale")}</option>,
            salesOption]}
        />

         <div className="ui horizontal divider">Or</div>

         <SelectField
          label={T.translate("invoices.form.projects")}
          name="projectId"
          value={step1.projectId ? step1.projectId : ''} 
          onChange={handleChange} 
          error={errors.project}
          formClass="inline field"

          options={[<option key="default" value="">{T.translate("invoices.form.select_project")}</option>,
            projectsOption]}
        />
      </fieldset>

      <div className="inline field mt-5"> 
        <button className="ui primary button" onClick={handleNext}>{T.translate("invoices.form.next")}<i className="chevron right icon"></i></button>

        <Link to="/invoices" className="ui negative d-block mt-3">{T.translate("invoices.form.cancel")}</Link>
      </div>  
    </div> 
    )    
}

