import React from "react";
// Semantic UI Form elements
import { Segment, Step, Icon } from "semantic-ui-react";

// Localization
import T from "i18n-react";

export default function Steps({ currentStep }) {
  return (
    <Segment basic className="p-0">
      <Step.Group stackable="tablet" size="small">
        <Step active={currentStep === "step1"}>
          <div>
            <Icon name="suitcase" />
            <br />
            <Icon name="cart" />
          </div>
          <Step.Content>
            <Step.Title>
              {T.translate("invoices.form.sale_or_project")}
            </Step.Title>
          </Step.Content>
        </Step>
        <Step active={currentStep === "step2"}>
          <Icon name="file text" />
          <Step.Content>
            <Step.Title>
              {T.translate("invoices.form.invoice_details")}
            </Step.Title>
          </Step.Content>
        </Step>
        <Step active={currentStep === "step3"}>
          <Icon name="info" />
          <Step.Content>
            <Step.Title>{T.translate("invoices.form.confirmation")}</Step.Title>
          </Step.Content>
        </Step>
      </Step.Group>
    </Segment>
  );
}
