import React from 'react'
import classnames from 'classnames'

// Localization 
import T from 'i18n-react'

export default function Steps({currentStep}) {
  return (
    <div className="row mb-4">
      <div className="ui text container"> 
        <div className="ui small steps">
          <div className={classnames("step", {active: currentStep === 'step1'})}>
            <div>
              <i className="suitcase icon"></i><br/>
              <i className="cart icon"></i>
            </div>
            <div className="content">
              <div className="title">{T.translate("invoices.form.sale_or_project")}</div>
            </div>
          </div>
          <div className={classnames("step", {active: currentStep === 'step2'})}>
            <i className="file text icon"></i>
            <div className="content">
              <div className="title">{T.translate("invoices.form.invoice_details")}</div>
            </div>
          </div>
          <div className={classnames("step", {active: currentStep === 'step3'})}>
            <i className="info icon"></i>
            <div className="content">
              <div className="title">{T.translate("invoices.form.confirmation")}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}