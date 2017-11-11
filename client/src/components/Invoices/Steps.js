import React from 'react'

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
              <div className="title">Shipping</div>
              <div className="description">Choose your shipping options</div>
            </div>
          </div>
          <div className="active step">
            <i className="file text icon"></i>
            <div className="content">
              <div className="title">Billing</div>
              <div className="description">Enter billing information</div>
            </div>
          </div>
          <div className="disabled step">
            <i className="info icon"></i>
            <div className="content">
              <div className="title">Confirm Order</div>
              <div className="description">Verify order details</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}