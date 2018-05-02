import React from 'react'
import { Link } from 'react-router-dom'
// Semantic UI Form elements
import { Select, Form } from 'semantic-ui-react'

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
        
        {salesOption && <Form.Group inline>
          <Form.Field 
            label={T.translate("invoices.form.sales")}
            placeholder={T.translate("invoices.form.select_sale")}
            control={Select}
            name="saleId"
            value={step1.saleId ? step1.saleId : ''} 
            onChange={(e, {value}) => handleChange('saleId', value)} 
            error={errors.sale}
            options={salesOption}
            selection
          />
          <span className="red">{errors.saleId}</span>
        </Form.Group>}

        <div className="ui horizontal divider">Or</div>

        {projectsOption && <Form.Group inline>
          <Form.Field 
            label={T.translate("invoices.form.projects")}
            placeholder={T.translate("invoices.form.select_project")}
            control={Select}
            name="projectId"
            value={step1.projectId ? step1.projectId : ''} 
            onChange={(e, {value}) => handleChange('projectId', value)} 
            error={errors.project}
            options={projectsOption}
            selection
          />
          <span className="red">{errors.projectId}</span>
        </Form.Group> }
      </fieldset>

      <div className="inline field mt-5"> 
        <button className="ui primary button" onClick={handleNext}>{T.translate("invoices.form.next")}<i className="chevron right icon"></i></button>

        <Link to="/invoices" className="ui negative d-block mt-3">{T.translate("invoices.form.cancel")}</Link>
      </div>  
    </div> 
    )    
}

