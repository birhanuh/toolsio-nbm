import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import classnames from 'classnames'
import map from 'lodash/map'
import { Validation } from '../../utils'
import Steps from './Steps'

import SaleProject from './Steps/SaleProject'
import Details from './Steps/Details'
import Confirmation from './Steps/Confirmation'

// Moment
import moment from 'moment'

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      _id: this.props.invoice ? this.props.invoice._id : null,
      step1: {
        sale: this.props.invoice ? (this.props.invoice.sale ? this.props.invoice.sale._id : '') : '',
        project: this.props.invoice ? (this.props.invoice.project ? this.props.invoice.project._id : '') : '' 
      },
      step2: {
        deadline: this.props.invoice ? moment(this.props.invoice.deadline, "MM-DD-YYYY") : moment(),
        paymentTerm: this.props.invoice ? this.props.invoice.paymentTerm : '',
        interestInArrears: this.props.invoice ? this.props.invoice.interestInArrears : '',
        status: this.props.invoice ? this.props.invoice.status : '',
        description: this.props.invoice ? this.props.invoice.description : ''
      },
      sale: this.props.invoice ? this.props.invoice.sale : null,
      project:this.props.invoice ? this.props.invoice.project : null,
      currentStep: 'step1',
      errors: {
        message: {
          errors: {}
        }
      },
      isLoading: false
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.invoice) {
      this.setState({
        _id: nextProps.invoice._id,
        step1: {
          sale: nextProps.invoice.sale && nextProps.invoice.sale._id,
          project: nextProps.invoice.project && nextProps.invoice.project._id
        },
        step2: {
          deadline: nextProps.invoice.deadline ? moment(nextProps.invoice.deadline) : null,
          paymentTerm: nextProps.invoice.paymentTerm,
          interestInArrears: nextProps.invoice.interestInArrears,
          status: nextProps.invoice.status,
          description: nextProps.invoice.description
        },
        sale: nextProps.invoice.sale,
        project: nextProps.invoice.project,
      })
    }
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

    let updatedErrors = Object.assign({}, this.state.errors)
    updatedErrors.message.errors = errors

    if (!isValid) {
      this.setState({ 
        errors: updatedErrors 
      })
    }

    return isValid
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
        .catch( ({response}) => this.setState({ errors: response.data.errors, isLoading: false }) ) 
    }
  }

  handleNext = (e) => {
    e.preventDefault()
    
    if (this.state.currentStep === 'step1') {
      // Validation
      if (this.isValid()) { 
        this.setState({ currentStep: 'step2' })
      }
    } else if (this.state.currentStep === 'step2') {
      // Validation
      if (this.isValid()) { 
        this.setState({ currentStep: 'step3' })
      }
    }

    if (this.state._id === null) {
      const sale = this.props.sales.find(item => item._id === this.state.step1.sale ) 
      this.setState({
        sale: sale
      })

      const project = this.props.projects.find(item => item._id === this.state.step1.project ) 
      this.setState({
        project: project
      })
    }

  }

  handlePrevious = (e) => {
    e.preventDefault()
    
    // Just set curretSetop to 'step1'
    if (this.state.currentStep === 'step2') {
      this.setState({ currentStep: 'step1' })
    } else if (this.state.currentStep === 'step3') {
      this.setState({ currentStep: 'step2' })
    }
  }

  handleChangeDate(deadline) {
    if (!!this.state.errors['deadline']) {
      // Clone errors form state to local variable
      let errors = Object.assign({}, this.state.errors)
      delete errors['deadline']
      
      this.setState({
        step2: { ...this.state.step2, deadline: deadline },
        errors
      })
    } else {
      this.setState({
        step2: { ...this.state.step2, deadline: deadline }
      })
    }
  } 

  render() {
    const { _id, step1, step2, sale, project, errors, isLoading, currentStep } = this.state

    const salesOptions = map(this.props.sales, (sale) => 
      <option key={sale._id} value={sale._id}>{sale.name}</option>
    )

    const projectsOptions = map(this.props.projects, (project) => 
      <option key={project._id} value={project._id}>{project.name}</option>
    )

    return ( 
      <div className="ui form">
        
        {/* Steps component */}
        <Steps currentStep={this.state.currentStep}/> 

        {currentStep === 'step1' &&  <SaleProject _id={_id} salesOptions={salesOptions} projectsOptions={projectsOptions} step1={step1} handleChange={this.handleChange.bind(this)} handleNext={this.handleNext.bind(this)} errors={errors} />}

        {currentStep === 'step2' && <Details _id={_id} step2={step2} handleChangeDate={this.handleChangeDate.bind(this)} handleChange={this.handleChange.bind(this)} handlePrevious={this.handlePrevious.bind(this)}
            handleNext={this.handleNext.bind(this)} errors={errors} /> }

        <form className={classnames("ui form", { loading: isLoading })}>

          { !!errors && !!errors.message && (typeof errors.message === "string") && <div className="ui negative message"><p>{errors.message}</p></div> } 

          {currentStep === 'step3' && <Confirmation _id={_id} step2={step2} sale={sale} project={project} handlePrevious={this.handlePrevious.bind(this)} 
              handleSubmit={this.handleSubmit.bind(this)} isLoading={isLoading} /> }

        </form> 
      </div>

    )
  }
}

Form.propTypes = {
  saveInvoice: PropTypes.func.isRequired,
  sales: PropTypes.array.isRequired,
  projects: PropTypes.array.isRequired
}

export default Form

