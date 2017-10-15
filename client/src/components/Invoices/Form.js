import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Validation } from '../../utils'
import { InputField } from '../../utils/FormFields'

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
      sale: this.props.invoice ? this.props.invoice.sale : '',
      project: this.props.invoice ? this.props.invoice.project : '',
      deadline: this.props.invoice ? this.props.invoice.deadline : '',
      paymentTerm: this.props.invoice ? this.props.invoice.paymentTerm : '',
      intersetInArrears: this.props.invoice ? this.props.invoice.intersetInArrears : '',
      status: this.props.invoice ? this.props.invoice.contact.status : '',
      description: this.props.invoice ? this.props.invoice.contact.description : ''
      step: 1,
      errors: {},
      isLoading: false
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      _id: nextProps.invoice._id,
      sale: this.props.invoice ? this.props.invoice.sale,
      project: this.props.invoice ? this.props.invoice.project,
      date_of_an_invoice: this.props.invoice ? this.props.invoice.date_of_an_invoice,
      deadline: this.props.invoice ? this.props.invoice.deadline,
      paymentTerm: this.props.invoice ? this.props.invoice.paymentTerm,
      intersetInArrears: this.props.invoice ? this.props.invoice.intersetInArrears,
      status: this.props.invoice ? this.props.invoice.contact.status,
      description: this.props.invoice ? this.props.invoice.contact.description
    })
  }

  componentDidMount = () => {
    let classContextThis = this
    
    if (this.state.includeContactOnInvoice === true) {
      $('.ui.toggle.checkbox').checkbox('check')
    }

    $('.ui.toggle.checkbox').checkbox({
      onChecked: function() {
         classContextThis.setState({
          includeContactOnInvoice: true
        })
      },
      onUnchecked: function() {
        classContextThis.setState({
          includeContactOnInvoice: false
        })
      }
    })

  }

  handleChange = (e) => {
    if (!!this.state.errors[e.target.name]) {
      // Clone errors form state to local variable
      let errors = Object.assign({}, this.state.errors)
      delete errors[e.target.name]

      this.setState({
        [e.target.name]: e.target.value,
        errors
      })
    } else {

      this.setState({
        [e.target.name]: e.target.value
      })
    }
   
  }

  isValid() {
    const { errors, isValid } = Validation.validateCustomerInput(this.state)

    if (!isValid) {
      this.setState({ errors })
    }

    return isValid;
  }

  handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (this.isValid) { 
      const { _id, name, vatNumber, contact, includeContactOnInvoice, address } = this.state
      this.setState({ isLoading: true })
      this.props.saveCustomer({ _id, name, vatNumber, includeContactOnInvoice, contact, address })
        .catch( ( {response} ) => this.setState({ errors: response.data.errors, isLoading: false }) ) 
    }
  }

  handleChangeDate(deadline) {
    this.setState({
      deadline: deadline
    })
  } 

  render() {
    const { _id, sale, project, deadline, paymentTerm, intersetInArrears, status, description, errors, isLoading } = this.state
    
     const salesOptions = map(this.props.sales, (sale) => 
      <option key={sale._id} value={sale._id}>{sale.name}</option>
    )

    const projectsOptions = map(this.props.projects, (project) => 
      <option key={project._id} value={project._id}>{project.name}</option>
    )

    // const paymentTermOptions = Array(99).fill().map((key, value) => 
    //   <option key={key} value={value}>{value}</option>
    // )

    return (  
       <div className="row">
        <div className="ui text container ui segment">  

          <form className={classnames("ui form", { loading: isLoading })} onSubmit={this.handleSubmit.bind(this)}>
            <div className="inline field"> 
              {_id ? <h1 className="ui header">{T.translate("invoices.form.edit_invoice")}</h1> : <h1 className="ui header">{T.translate("invoices.form.new_invoice")}</h1>}
            </div>
            
            { !!errors.message && (typeof errors.message === "string") && <div className="ui negative message"><p>{errors.message}</p></div> } 

            <fieldset className="custom-fieldset">
              <legend className="custom-legend">{T.translate("invoices.select_sale_or_project")}</legend>
              
              <SelectField
                label={T.translate("sales.page.header")}
                name="sale"
                value={sale ? (typeof sale === 'object' ? sale._id : sale) : ''} 
                onChange={this.handleChange.bind(this)} 
                error={errors.message && errors.message.errors && errors.message.errors.sale && errors.message.errors.sale.message}
                formClass="inline field"

                options={[<option key="default" value="" disabled>{T.translate("invoices.form.select_sale")}</option>,
                  salesOptions]}
              />

               <SelectField
                label={T.translate("projects.page.header")}
                name="project"
                value={project ? (typeof project === 'object' ? project._id : project) : ''} 
                onChange={this.handleChange.bind(this)} 
                error={errors.message && errors.message.errors && errors.message.errors.project && errors.message.errors.project.message}
                formClass="inline field"

                options={[<option key="default" value="" disabled>{T.translate("invoices.form.select_project")}</option>,
                  projectsOptions]}
              />
            </fieldset>

            <fieldset className="custom-fieldset">
              <legend className="custom-legend">{T.translate("invoices.payment_term_or_deadline")}</legend>

              <div  className={classnames("inline field", { error: !!errors.deadline })}>
                <label className="" htmlFor="date">{T.translate("sales.form.deadline")}</label>
                <DatePicker
                  dateFormat="DD/MM/YYYY"
                  selected={deadline}
                  onChange={this.handleChangeDate.bind(this)}
                />
                <span>{errors.password}</span>
              </div>

              <InputField
                label={T.translate("invoices.form.payment_term")}
                name="name" 
                value={name} 
                onChange={this.handleChange.bind(this)} 
                placeholder="Name"
                error={errors.message && errors.message.errors && errors.message.errors.paymentTerm && errors.message.errors.paymentTerm.message}
                  formClass="inline field"
              />
            </fieldset>  

            <InputField
              label={T.translate("invoices.form.interset_in_arrears")}
              name="intersetInArrears" 
              value={intersetInArrears} 
              onChange={this.handleChange.bind(this)} 
              placeholder="Name"
              error={errors.message && errors.message.errors && errors.message.errors.intersetInArrears && errors.message.errors.intersetInArrears.message}
                formClass="inline field"
            />
            
            { _id &&
              <SelectField
                label={T.translate("invoices.form.status")}
                name="status"
                type="select"
                value={status} 
                onChange={this.handleChange.bind(this)} 
                error={errors.message && errors.message.errors && errors.message.errors.status && errors.message['status'].message}
                formClass="inline field"

                options={[
                  <option key="default" value="new" disabled>NEW</option>,
                  <option key="on going" value="on going">ON GOING</option>,
                  <option key="finished" value="finished">FINISHED</option>,
                  <option key="delayed" value="delayed">DELAYED</option>,
                  <option key="delivered" value="delivered">DELIVERED</option>
                  ]
                }
              />
            }

            <TextAreaField
              label={T.translate("invoices.form.description")}
              name="description" 
              value={description} 
              onChange={this.handleChange.bind(this)} 
              placeholder={T.translate("invoices.form.description")}
              formClass="inline field"
            /> 

            <div className="inline field">    
              <button disabled={isLoading} className="ui primary button"><i className="check circle outline icon" aria-hidden="true"></i>&nbsp;{T.translate("button.save")}</button>
            </div>  
          </form> 
        </div>  
      </div>
    )
  }
}

Form.propTypes = {
  sales: PropTypes.array.isRequired,
  projects: PropTypes.array.isRequired
}

export default Form

