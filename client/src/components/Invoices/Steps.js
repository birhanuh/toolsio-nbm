import React from 'react'

// Localization 
import T from 'i18n-react'

export default function Steps() {
  return (
    <div className="row mb-4">
      <div className="ui text container"> 
        <div className="ui small steps">
          <div className="step">
            <div>
              <i className="suitcase icon"></i><br/>
              <i className="cart icon"></i>
            </div>
            <div className="content">
              <div className="title">{T.translate("invoices.form.sale_or_project")}</div>
            </div>
          </div>
          <div className="active step">
            <i className="file text icon"></i>
            <div className="content">
              <div className="title">{T.translate("invoices.form.invoice_details")}</div>
            </div>
          </div>
          <div className="disabled step">
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