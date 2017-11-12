import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import classnames from 'classnames'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import { Validation } from '../../utils'
import { InputField, SelectField, TextAreaField } from '../../utils/FormFields'
import Steps from './Steps'

// Datepicker 
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

// Localization 
import T from 'i18n-react'

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      _id: this.props.invoice ? this.props.invoice._id : null,
      step1: {
        sale: this.props.invoice ? this.props.invoice.sale : '',
        project: this.props.invoice ? this.props.invoice.project : '' 
      },
      step2: {
        deadline: this.props.invoice ? moment(this.props.invoice.deadline, "MM-DD-YYYY") : moment(),
        paymentTerm: this.props.invoice ? this.props.invoice.paymentTerm : '',
        interestInArrears: this.props.invoice ? this.props.invoice.interestInArrears : '',
        status: this.props.invoice ? this.props.invoice.contact.status : '',
        description: this.props.invoice ? this.props.invoice.contact.description : ''
      },
      currentStep: 'step1',
      errors: {},
      isLoading: false
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.invoice) {
      this.setState({
        _id: nextProps.invoice._id,
        step1: {
          sale: nextProps.invoice.sale,
          project: nextProps.invoice.project
        },
        step2: {
          deadline: moment(nextProps.invoice.deadline),
          paymentTerm: nextProps.invoice.paymentTerm,
          interestInArrears: nextProps.invoice.interestInArrears,
          status: nextProps.invoice.contact.status,
          description: nextProps.invoice.contact.description
        }
      })
    }
  }

  componentDidMount = () => {

  }

  handleChange = (e) => {
    if (!!this.state.errors[e.target.name]) {
      // Clone errors form state to local variable
      let errors = Object.assign({}, this.state.errors)
      delete errors[e.target.name]

      if (e.target.name === "sale" || e.target.name === "project") {
    
        this.setState({
          step1: { ...this.state.step1, [e.target.name]: e.target.value },
          errors
        })
      } else if (e.target.name === "deadline" || e.target.name === "paymentTerm"
        || e.target.name === "interestInArrears" || e.target.name === "status"
        || e.target.name === "description" ) {

        this.setState({
          step2: { ...this.state.step2, [e.target.name]: e.target.value },
          errors
        })
      } else {

        this.setState({
          [e.target.name]: e.target.value,
          errors
        })
      }
    } else {

     if (e.target.name === "sale" || e.target.name === "project") {
    
        this.setState({
          step1: { ...this.state.step1, [e.target.name]: e.target.value }
        })
      } else if (e.target.name === "deadline" || e.target.name === "paymentTerm"
        || e.target.name === "interestInArrears" || e.target.name === "status"
        || e.target.name === "description" ) {

        this.setState({
          step2: { ...this.state.step2, [e.target.name]: e.target.value }
        })
      } else {

        this.setState({
          [e.target.name]: e.target.value,
        })
      }
    }
   
  }

  isValid() {
    const { errors, isValid } = Validation.validateInvoiceInput(this.state)

    if (!isValid) {
      this.setState({ errors })
    }

    return isValid;
  }

  handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (this.isValid()) { 
      const { _id } = this.state
      const { sale, project } = this.state.step1
      const { deadline, paymentTerm, interestInArrears, status, description } = this.state.step2

      this.setState({ isLoading: true })
      this.props.saveInvoice({ _id, sale, project, deadline, paymentTerm, interestInArrears, status, description })
        .catch( ( {response} ) => this.setState({ errors: response.data.errors, isLoading: false }) ) 
    }
  }

  handleStep1 = (arg, e) => {
    e.preventDefault()
    
    if ((this.state.step1.sale  !== '' || this.state.step1.project !== '') && isEmpty(this.state.errors)) {
      this.setState({ currentStep: 'step2' })
    }
  }

   handleStep2 = (arg, e) => {
    e.preventDefault()
    
    if ((this.state.step2.deadline  !== '' || this.state.step2.paymentTerm !== '') && 
      this.state.step2.interestInArrears !== '' && isEmpty(this.state.errors)) {
      this.setState({ currentStep: 'step3' })
    }
  }

  handleChangeDate(deadline) {
    this.setState({
      deadline: deadline
    })
  } 

  render() {
    const { _id, step1, step2, errors, isLoading, currentStep } = this.state
    
     const salesOptions = map(this.props.sales, (sale) => 
      <option key={sale._id} value={sale._id}>{sale.name}</option>
    )

    const projectsOptions = map(this.props.projects, (project) => 
      <option key={project._id} value={project._id}>{project.name}</option>
    )

    const paymentTermOptions = Array(99).fill().map((key, value) => 
      <option key={key} value={value}>{value}</option>
    )

    const saleAndProjectDetails = (
      <div className="row">
        <div className="ui text container ui segment"> 
          <div className="inline field"> 
            {_id ? <h1 className="ui header">{T.translate("invoices.form.edit_invoice")}</h1> : 
              <h1 className="ui header">{T.translate("invoices.form.new_invoice")}
                <div className="sub header d-inline-block pl-1">{T.translate("invoices.form.sale_or_project")}</div>
              </h1>
            }
          </div>
          
          <fieldset className="custom-fieldset">
            <legend className="custom-legend">{T.translate("invoices.form.select_sale_or_project")}</legend>
            
            <SelectField
              label={T.translate("invoices.form.sales")}
              name="sale"
              value={step1.sale} 
              onChange={this.handleChange.bind(this)} 
              error={errors.message && errors.message.errors && errors.message.errors.sale && errors.message.errors.sale.message}
              formClass="inline field"

              options={[<option key="default" value="" disabled>{T.translate("invoices.form.select_sale")}</option>,
                salesOptions]}
            />

             <div className="ui horizontal divider">Or</div>

             <SelectField
              label={T.translate("invoices.form.projects")}
              name="project"
              value={step1.project} 
              onChange={this.handleChange.bind(this)} 
              error={errors.message && errors.message.errors && errors.message.errors.project && errors.message.errors.project.message}
              formClass="inline field"

              options={[<option key="default" value="" disabled>{T.translate("invoices.form.select_project")}</option>,
                projectsOptions]}
            />
          </fieldset>

          <div className="inline field mt-5"> 
            <button className="ui button" onClick={this.handleStep1.bind(this, 'cancel')}><i className="chevron left icon"></i>{T.translate("invoices.form.previous")}</button>
            <button className="ui primary button" onClick={this.handleStep1.bind(this, 'cancel')}>{T.translate("invoices.form.next")}<i className="chevron right icon"></i></button>

            <a href="#" onClick={this.handleStep1.bind(this, 'cancel')} className="ui negative d-block mt-3">{T.translate("invoices.form.cancel")}</a>
          </div>  
        </div>
      </div>      
    )

    const invocieDetails = (
      <div className="row">
        <div className="ui text container ui segment"> 
          <div className="inline field"> 
            {_id ? <h1 className="ui header">{T.translate("invoices.form.edit_invoice")}</h1> : 
              <h1 className="ui header">{T.translate("invoices.form.new_invoice")}
                <div className="sub header d-inline-block pl-1">{T.translate("invoices.form.invoice_details")}</div>
              </h1>
            }
          </div>
          <fieldset className="custom-fieldset">
            <legend className="custom-legend">{T.translate("invoices.form.select_payment_term_or_deadline")}</legend>

            <div  className={classnames("inline field", { error: !!errors.deadline })}>
              <label className="" htmlFor="date">{T.translate("sales.form.deadline")}</label>
              <DatePicker
                dateFormat="DD/MM/YYYY"
                selected={step2.deadline}
                onChange={this.handleChangeDate.bind(this)}
              />
              <span>{errors.password}</span>
            </div>
            
            <div className="ui horizontal divider">Or</div>

            <SelectField
              label={T.translate("invoices.form.payment_term")}
              name="paymentTerm" 
              value={step2.paymentTerm} 
              onChange={this.handleChange.bind(this)} 
              placeholder="Name"
              error={errors.message && errors.message.errors && errors.message.errors.paymentTerm && errors.message.errors.paymentTerm.message}
                formClass="inline field"

              options={[<option key="default" value="" disabled>{T.translate("invoices.form.select_days")}</option>,
                paymentTermOptions]}
            />
          </fieldset>  

          <InputField
            label={T.translate("invoices.form.interest_in_arrears")}
            name="interestInArrears" 
            value={step2.interestInArrears} 
            onChange={this.handleChange.bind(this)} 
            placeholder="0%"
            error={errors.message && errors.message.errors && errors.message.errors.interestInArrears && errors.message.errors.interestInArrears.message}
              formClass="inline field"
          />
          
          { _id &&
            <SelectField
              label={T.translate("invoices.form.status")}
              name="status"
              type="select"
              value={step2.status} 
              onChange={this.handleChange.bind(this)} 
              error={errors.message && errors.message.errors && errors.message.errors.status && errors.message['status'].message}
              formClass="inline field"

              options={[
                <option key="default" value="pending" disabled>PENDING</option>,
                <option key="paid" value="paid">PAID</option>,
                <option key="overdue" value="overdue">OVERDUE</option>
                ]
              }
            />
          }

          <TextAreaField
            label={T.translate("invoices.form.description")}
            name="description" 
            value={step2.description} 
            onChange={this.handleChange.bind(this)} 
            placeholder={T.translate("invoices.form.description")}
            formClass="inline field"
          /> 

          <div className="inline field mt-5"> 
            <button className="ui button" onClick={this.handleStep2.bind(this, 'cancel')}><i className="chevron left icon"></i>{T.translate("invoices.form.previous")}</button>
            <button className="ui primary button" onClick={this.handleStep2.bind(this, 'cancel')}>{T.translate("invoices.form.next")}<i className="chevron right icon"></i></button>

            <a href="#" onClick={this.handleStep2.bind(this, 'cancel')} className="ui negative d-block mt-3">{T.translate("invoices.form.cancel")}</a>
          </div>  
        </div>  
      </div>
    )

    const confirmation = (
      <div className="row">
        <div className="ui text container ui segment"> 
          <div className="inline field"> 
            {_id ? <h1 className="ui header">{T.translate("invoices.form.edit_invoice")}</h1> : 
              <h1 className="ui header">{T.translate("invoices.form.new_invoice")}
                <div className="sub header d-inline-block pl-1">{T.translate("invoices.form.confirmation")}</div>
              </h1>
            }
          </div> 
          
          <dl className="dl-horizontal">
            {/*<dt>{T.translate("invoices.show.user")}</dt>
            <dd>{invoice.user.first_name}</dd>*/}  
            <dt>{T.translate("invoices.show.deadline")}</dt>
            <dd>{step2.deadline.toString()}</dd>
            <dt>{T.translate("invoices.show.status")}</dt>
            <dd><div className="ui uppercase tiny label orange">pending</div></dd>
            <dt>{T.translate("invoices.show.payment_term")}</dt>
            <dd>{step2.paymentTerm ? step2.paymentTerm : '-'}</dd>
            <dt>{T.translate("invoices.show.interest_in_arrears")}</dt>
            <dd>{step2.interestInArrears}</dd>
            <dt>{T.translate("invoices.show.description")}</dt>
            <dd>{step2.description}</dd>
          </dl>  
          <br/>
          
          {step1.sale &&
            <dl className="dl-horizontal">
              <dt>{T.translate("invoices.form.sale")}</dt>
              <dd>{step1.sale.name}</dd>
            </dl>
          }
          
          {step1.project &&
            <dl className="dl-horizontal">
              <dt>{T.translate("invoices.form.project")}</dt>
              <dd>{step1.project.name}</dd>
            </dl>
          }
          <br/>

          <div className="inline field">    
            <button disabled={isLoading} className="ui primary button" onClick={this.handleSubmit.bind(this)}><i className="check circle outline icon" aria-hidden="true"></i>&nbsp;{T.translate("invoices.form.save")}</button>
          </div>  
        </div>
      </div>
    )

    return (  
      <div className="ui form">
        <Steps /> 
        {currentStep === 'step1' &&  saleAndProjectDetails}
        {currentStep === 'step2' && invocieDetails}

        <form className={classnames("ui form", { loading: isLoading })}>

          { !!errors && !!errors.message && (typeof errors.message === "string") && <div className="ui negative message"><p>{errors.message}</p></div> } 

          {currentStep === 'step3' && confirmation}

        </form> 
      </div>
    )
  }
}

Form.propTypes = {
  sales: PropTypes.array.isRequired,
  projects: PropTypes.array.isRequired
}

export default Form

