import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import classnames from 'classnames'
import map from 'lodash/map'
import { Validation } from '../../utils'
import Steps from './Steps'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import SaleProject from './Steps/SaleProject'
import Details from './Steps/Details'
import Confirmation from './Steps/Confirmation'

// Moment
import moment from 'moment'

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.data.getInvoice ? this.props.data.getInvoice.id : null,
      step1: {
        saleId: this.props.data.getInvoice ? (this.props.data.getInvoice.sale ? this.props.data.getInvoice.sale.id : '') : '',
        projectId: this.props.data.getInvoice ? (this.props.data.getInvoice.project ? this.props.data.getInvoice.project.id : '') : '' 
      },
      step2: {
        deadline: this.props.data.getInvoice ? moment(this.props.data.getInvoice.deadline, "MM-DD-YYYY") : moment(),
        paymentTerm: this.props.data.getInvoice ? this.props.data.getInvoice.paymentTerm : '',
        interestInArrears: this.props.data.getInvoice ? this.props.data.getInvoice.interestInArrears : '',
        status: this.props.data.getInvoice ? this.props.data.getInvoice.status : 'new',
        description: this.props.data.getInvoice ? this.props.data.getInvoice.description : ''
      },
      sale: this.props.data.getInvoice ? this.props.data.getInvoice.sale : null,
      project:this.props.data.getInvoice ? this.props.data.getInvoice.project : null,
      currentStep: 'step1',
      errors: {},
      isLoading: false
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.data.getInvoice) {
      this.setState({
        id: nextProps.data.getInvoice.id,
        step1: {
          saleId: !!nextProps.data.getInvoice.sale && nextProps.data.getInvoice.sale.id,
          projectId: !!nextProps.data.getInvoice.project && nextProps.data.getInvoice.project.id
        },
        step2: {
          deadline: nextProps.data.getInvoice.deadline ? moment(nextProps.data.getInvoice.deadline) : null,
          paymentTerm: nextProps.data.getInvoice.paymentTerm,
          interestInArrears: nextProps.data.getInvoice.interestInArrears,
          status: nextProps.data.getInvoice.status,
          description: nextProps.data.getInvoice.description
        },
        sale: nextProps.data.getInvoice.sale,
        project: nextProps.data.getInvoice.project,
      })
    }
  }

  handleChange = (e) => {
    if (!!this.state.errors[e.target.name]) {
      // Clone errors form state to local variable
      let errors = Object.assign({}, this.state.errors)
      delete errors[e.target.name]

      if (e.target.name === "saleId" || e.target.name === "projectId") {
    
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

     if (e.target.name === "saleId" || e.target.name === "projectId") {
    
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
    updatedErrors = errors

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
    if (true) { 
      const { id, project, sale } = this.state
      const { saleId, projectId } = this.state.step1
      const { deadline, paymentTerm, interestInArrears, status, description } = this.state.step2

      this.setState({ isLoading: true })
      
      // Get total either form Project or Sale
      let total = (sale && sale.total) || (project && project.total)

      // Get customerId either form Project or Sale
      let customerId = (sale && sale.customer.id) || (project && project.customer.id)
      console.log('customerId ', total +' / '+customerId)
      if (id) {
        this.props.updateInvoiceMutation({ 
        variables: { id, deadline, paymentTerm: parseInt(paymentTerm), interestInArrears: parseInt(interestInArrears), 
          status, description, total: parseInt(total), projectId: parseInt(projectId), 
          saleId: parseInt(saleId), customerId: parseInt(customerId) },
        update: (proxy, { data: { updateInvoice } }) => {
          const { success, invoice } = updateInvoice

          if (!success) {
            return
          }
          // Read the data from our cache for this query.
          const data = proxy.readQuery({ query: getInvoicesQuery })
          // Add our comment from the mutation to the end.
          data.getInvoices.push(invoice)
          // Write our data back to the cache.
          proxy.writeQuery({ query: getInvoicesQuery, data })
        }})
        .then(res => {
          // this.props.addFlashMessage({
          //   type: 'success',
          //   text: T.translate("invoices.form.flash.success_update", { name: name})
          // })  
          // this.context.router.history.push('/invoices')
          

          const { success, invoice, errors } = res.data.updateInvoice

          if (success) {
            this.context.router.history.push('/invoices')
          } else {
            let errorsList = {}
            errors.map(error => errorsList[error.path] = error.message)

            this.setState({ errors: errorsList, isLoading: false })
          }
        })
        .catch(err => this.setState({ errors: err, isLoading: false }))
      }

      this.props.createInvoiceMutation({ 
        variables: { id, deadline, paymentTerm: parseInt(paymentTerm), interestInArrears: parseInt(interestInArrears), 
          status, description, total: parseInt(total), projectId: parseInt(projectId), 
          saleId: parseInt(saleId), customerId: parseInt(customerId) },
        update: (proxy, { data: { createInvoice } }) => {
          const { success, invoice } = createInvoice

          if (!success) {
            return
          }
          // Read the data from our cache for this query.
          const data = proxy.readQuery({ query: getInvoicesQuery })
          // Add our comment from the mutation to the end.
          data.getInvoices.push(invoice)
          // Write our data back to the cache.
          proxy.writeQuery({ query: getInvoicesQuery, data })
        }})
        .then(res => {
          // this.props.addFlashMessage({
          //   type: 'success',
          //   text: T.translate("invoices.form.flash.success_update", { name: name})
          // })  
          // this.context.router.history.push('/invoices')
          

          const { success, invoice, errors } = res.data.createInvoice

          if (success) {
            this.context.router.history.push('/invoices')
          } else {
            let errorsList = {}
            errors.map(error => errorsList[error.path] = error.message)

            this.setState({ errors: errorsList, isLoading: false })
          }
        })
        .catch(err => this.setState({ errors: err, isLoading: false }))
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

    if (this.state.id === null) {
      const sale = this.props.getProjectsAndSalesQuery.getSales.find(item => item.id === parseInt(this.state.step1.saleId) ) 
      this.setState({
        sale: sale
      })

      const project = this.props.getProjectsAndSalesQuery.getProjects.find(item => item.id === parseInt(this.state.step1.projectId) ) 
      console.log('projectId', project)
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
    const { id, step1, step2, sale, project, errors, isLoading, currentStep } = this.state

    const { getProjects, getSales } = this.props.getProjectsAndSalesQuery
 
    const salesOptions = map(getSales, (sale) => 
      <option key={sale.id} value={sale.id}>{sale.name}</option>
    )

    const projectsOptions = map(getProjects, (project) => 
      <option key={project.id} value={project.id}>{project.name}</option>
    )

    return ( 
      <div className="ui form">
        
        {/* Steps component */}
        <Steps currentStep={this.state.currentStep}/> 

        {currentStep === 'step1' &&  <SaleProject id={id} salesOptions={salesOptions} projectsOptions={projectsOptions} step1={step1} handleChange={this.handleChange.bind(this)} handleNext={this.handleNext.bind(this)} errors={errors} />}

        {currentStep === 'step2' && <Details id={id} step2={step2} handleChangeDate={this.handleChangeDate.bind(this)} handleChange={this.handleChange.bind(this)} handlePrevious={this.handlePrevious.bind(this)}
            handleNext={this.handleNext.bind(this)} errors={errors} /> }

        <form className={classnames("ui form", { loading: isLoading })}>

          { !!errors && !!errors.message && (typeof errors.message === "string") && <div className="ui negative message"><p>{errors.message}</p></div> } 

          {currentStep === 'step3' && <Confirmation id={id} step2={step2} sale={sale} project={project} handlePrevious={this.handlePrevious.bind(this)} 
              handleSubmit={this.handleSubmit.bind(this)} isLoading={isLoading} /> }

        </form> 
      </div>

    )
  }
}

const createInvoiceMutation = gql`
  mutation createInvoice($deadline: Date, $paymentTerm: Int, $interestInArrears: Int!, $status: String!, 
    $description: String, $total: Int, $projectId: Int, $saleId: Int, $customerId: Int!) {
    createInvoice(deadline: $deadline, paymentTerm: $paymentTerm, interestInArrears: $interestInArrears, status: $status,
      description: $description, total: $total, projectId: $projectId, saleId: $saleId, customerId: $customerId) {
      success
      invoice {
        id
      }
      errors {
        path
        message
      }
    }
  }
`

const updateInvoiceMutation = gql`
  mutation updateInvoice($id: Int!, $deadline: Date!, $status: String!, $progress: Int, $description: String, $total: Int, $customerId: Int!) {
    updateInvoice(id: $id, deadline: $deadline, status: $status, progress: $progress, description: $description, total: $total, customerId: $customerId) {
      success
      invoice {
        id
      }
      errors {
        path
        message
      }
    }
  }
`

const getProjectsAndSalesQuery = gql`
  {
    getProjects {
      id
      name 
      deadline
      status
      progress
      description
      total
      customer {
        id
        name
      }
    }
    getSales {
      id
      name 
      deadline
      status
      description
      total
      customer {
        id
        name
      }
    }
}
`

const getInvoicesQuery = gql`
  query {
    getInvoices {
      id
      deadline
      referenceNumber
      status
      total
      project {
        id
        name
      }
      sale {
        id
        name
      }
      customer {
        id
        name
        vatNumber
        email
        phoneNumber
      }
    }
  }
`

const getInvoiceQuery = gql`
  query getInvoice($id: Int!) {
    getInvoice(id: $id) {
      id
      deadline
      paymentTerm
      interestInArrears
      referenceNumber
      status
      createdAt
      project {
        id
        name
        deadline
        progress
        status
      }
      sale {
        id
        name
        deadline
        status
      }
    }
  }
`
const Mutations =  compose(
  graphql(createInvoiceMutation, {
    name : 'createInvoiceMutation'
  }),
  graphql(updateInvoiceMutation, {
    name: 'updateInvoiceMutation'
  }),
  graphql(getProjectsAndSalesQuery, {
    name : 'getProjectsAndSalesQuery'
  }),
  graphql(getInvoicesQuery, {
    name : 'getInvoicesQuery'
  }),
  graphql(getInvoiceQuery, {
    options: (props) => ({
      variables: {
        id: props.match.params.id ? parseInt(props.match.params.id) : 0
      },
    })
  })
)(Form)

export default Mutations

