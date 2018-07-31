import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import map from 'lodash/map'
import { Validation } from '../../utils'
import { addFlashMessage } from '../../actions/flashMessageActions'
// Semantic UI JS
import { Grid, Container, Segment } from 'semantic-ui-react'
import Steps from './Steps'
import { graphql, compose } from 'react-apollo'
import { GET_INVOICES_QUERY, GET_INVOICE_FORM_QUERY, GET_PROJECTS_WITHOUT_INVOICE_QUERY, GET_SALES_WITHOUT_INVOICE_QUERY, CREATE_INVOICE_MUTATION, UPDATE_INVOICE_MUTATION } from '../../graphql/invoices'

import SaleProject from './Steps/SaleProject'
import Details from './Steps/Details'
import Confirmation from './Steps/Confirmation'

// Localization 
import T from 'i18n-react'

// Moment
import moment from 'moment'

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.data.getInvoice ? this.props.data.getInvoice.id : null,
      step1: {
        sale: this.props.data.getInvoice ? this.props.data.getInvoice.sale : null,
        project: this.props.data.getInvoice ? this.props.data.getInvoice.project : null,
        projectsWithoutInvoice: [],
        salesWithoutInvoice: []
      },
      step2: {
        deadline: this.props.data.getInvoice ? moment(this.props.data.getInvoice.deadline) : moment(),
        paymentTerm: this.props.data.getInvoice ? this.props.data.getInvoice.paymentTerm : '',
        interestInArrears: this.props.data.getInvoice ? this.props.data.getInvoice.interestInArrears : '',
        status: this.props.data.getInvoice ? this.props.data.getInvoice.status : 'new',
        description: this.props.data.getInvoice ? (!this.props.data.getInvoice.description ? '' : this.props.data.getInvoice.description) : '',
        tax: this.props.data.getInvoice ? this.props.data.getInvoice.tax : '',
      },
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
          sale: nextProps.data.getInvoice.sale,
          project: nextProps.data.getInvoice.project
        },
        step2: {
          deadline: nextProps.data.getInvoice.deadline ? moment(nextProps.data.getInvoice.deadline) : null,
          paymentTerm: nextProps.data.getInvoice.paymentTerm,
          interestInArrears: nextProps.data.getInvoice.interestInArrears,
          status: nextProps.data.getInvoice.status,
          description: !nextProps.data.getInvoice.description ? '' : nextProps.data.getInvoice.description,
          tax: nextProps.data.getInvoice.tax,
          customer: nextProps.data.getInvoice.customer
        },
        currentStep: 'step2',
      })
    }
  }

  handleChange = (name, value) => {
    if (this.state.errors[name]) {
      // Clone errors form state to local variable
      let errors = Object.assign({}, this.state.errors)
      delete errors[name]

      if (name === "saleId") {
        const sale = this.state.step1.salesWithoutInvoice.find(item => item.id === parseInt(value) ) 

        this.setState({
          step1: { ...this.state.step1, sale },
          errors
        })
      } else if (name === "projectId") {
        const project = this.state.step1.projectsWithoutInvoice.find(item => item.id === parseInt(value) ) 

        this.setState({
          step1: { ...this.state.step1, project },
          errors
        })
      } else if (name === "deadline" || name === "paymentTerm"
        || name === "interestInArrears" || name === "status"
        || name === "description" || name === "tax") {

        this.setState({
          step2: { ...this.state.step2, [name]: value },
          errors
        })
      } else {

        this.setState({
          [name]: value,
          errors
        })
      }
    } else {

      if (name === "saleId") {
        const sale = this.state.step1.salesWithoutInvoice.find(item => item.id === parseInt(value) ) 

        this.setState({
          step1: { ...this.state.step1, sale }
        })
      }
      else if (name === "projectId") {
        const project = this.state.step1.projectsWithoutInvoice.find(item => item.id === parseInt(value) ) 

        this.setState({
          step1: { ...this.state.step1, project }
        })
      } else if (name === "deadline" || name === "paymentTerm"
        || name === "interestInArrears" || name === "status"
        || name === "description" || name === "tax") {

        this.setState({
          step2: { ...this.state.step2, [name]: value }
        })
      } else {

        this.setState({
          [name]: value,
        })
      }
    }
   
  }

  handleSearchChangeProject = (e) => {
    e.preventDefault()
    
    if (e.target.value !== "") {
      this.props.getProjectsWithoutInvoiceQuery.fetchMore({ 
        variables: { name: e.target.value },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev
          
          this.setState({
            step1: { ...this.state.step1, projectsWithoutInvoice: fetchMoreResult.getProjectsWithoutInvoice }
          }) 
        }})   
    }
  }

  handleSearchChangeSale = (e) => {
    e.preventDefault()
    
    if (e.target.value !== "") {
      this.props.getSalesWithoutInvoiceQuery.fetchMore({ 
        variables: { name: e.target.value },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev
          
          this.setState({
            step1: { ...this.state.step1, salesWithoutInvoice: fetchMoreResult.getSalesWithoutInvoice }
          }) 
        }})   
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
    if (this.isValid()) { 
      const { id } = this.state
      const { project, sale } = this.state.step1
      const { deadline, paymentTerm, interestInArrears, status, description, tax, customer } = this.state.step2

      this.setState({ isLoading: true })
    
      if (id) {
        this.props.updateInvoiceMutation({ 
        variables: { id, deadline, paymentTerm: parseInt(paymentTerm), interestInArrears: parseInt(interestInArrears), 
          status, description, tax, projectId: project && parseInt(project.id), 
          saleId: sale && parseInt(sale.id), customerId: customer.id },
        update: (store, { data: { updateInvoice } }) => {
          const { success, invoice } = updateInvoice

          if (!success) {
            return
          }

          // Read the data from our cache for this query.
          const data = store.readQuery({ query: GET_INVOICES_QUERY, 
            variables: {
              order: 'DESC',
              offset: 0,
              limit: 10,
              search: ""
            } 
          })
          // Add our Invoice from the mutation to the end.          
          let updatedInvoices = data.getInvoices.invoices.map(item => {
            if (item.id === invoice.id) {
              return {...invoice, __typename: 'Invoice'}
            }
            return item
          })
          data.getInvoices.invoices = updatedInvoices
          // Write our data back to the cache.
          store.writeQuery({ query: GET_INVOICES_QUERY, 
            variables: {
              order: 'DESC',
              offset: 0,
              limit: 10,
              search: ""
            }, data })
        }})
        .then(res => {         
          const { success, errors } = res.data.updateInvoice

          if (success) {
            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("invoices.form.flash.success_update", { name: (project && project.name) || (sale && sale.name)})
            })  

            this.context.router.history.push('/invoices') 
          } else {
            let errorsList = {}
            errors.map(error => errorsList[error.path] = error.message)

            this.setState({ errors: errorsList, isLoading: false })
          }
        })
        .catch(err => this.setState({ errors: err, isLoading: false }))
      } else { 
        this.props.createInvoiceMutation({ 
          variables: { id, deadline, paymentTerm: parseInt(paymentTerm), interestInArrears: parseInt(interestInArrears), 
            status, description, tax, projectId: project && parseInt(project.id), 
            saleId: sale && parseInt(sale.id), customerId: parseInt(project ? project.customer_id : sale.customer_id) },
          update: (store, { data: { createInvoice } }) => {
            const { success, invoice } = createInvoice

            if (!success) {
              return
            }

            // Read the data from our cache for this query.
            const data = store.readQuery({ query: GET_INVOICES_QUERY,
              variables: {
                order: 'DESC',
                offset: 0,
                limit: 10,
                search: ""
              } 
            })
            // Add our Invoice from the mutation to the end.
            data.getInvoices.invoices.push(invoice)
            // Write our data back to the cache.
            store.writeQuery({ query: GET_INVOICES_QUERY, 
              variables: {
                order: 'DESC',
                offset: 0,
                limit: 10,
                search: ""
              }, data })
          }})
          .then(res => {            
            const { success, errors } = res.data.createInvoice

            if (success) {
              this.props.addFlashMessage({
                type: 'success',
                text: T.translate("invoices.form.flash.success_create", { name: (project && project.name) || (sale && sale.name)})
              })

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
    if (this.state.errors['deadline']) {
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
    const { id, step1, step2, errors, isLoading, currentStep } = this.state
    
    const { projectsWithoutInvoice, salesWithoutInvoice } = step1

    const salesOption = salesWithoutInvoice && map(salesWithoutInvoice, (sale) => 
      ({ key: sale.id, value: sale.id, text: sale.name })
    )
    
    const projectsOption = projectsWithoutInvoice && map(projectsWithoutInvoice, (project) => 
      ({ key: project.id, value: project.id, text: project.name })
    )

    return (        
      <Grid.Row columns={1}>
        <Container text>
          {/* Steps component */}
          <Steps currentStep={this.state.currentStep}/> 

          <Segment className="invoices">
            {currentStep === 'step1' && <SaleProject id={id} salesOption={salesOption}  projectsOption={projectsOption} 
              handleChange={this.handleChange} step1={step1} handleSearchChangeProject={this.handleSearchChangeProject} 
              handleSearchChangeSale={this.handleSearchChangeSale} handleNext={this.handleNext.bind(this)} errors={errors} />}

            {currentStep === 'step2' && <Details id={id} step1={step1} step2={step2} handleChangeDate={this.handleChangeDate.bind(this)} 
              handleChange={this.handleChange} handlePrevious={this.handlePrevious.bind(this)}
              handleNext={this.handleNext.bind(this)} errors={errors} /> }

            {currentStep === 'step3' && <Confirmation id={id} step2={step2} sale={step1.sale} project={step1.project} 
              handlePrevious={this.handlePrevious.bind(this)} 
              handleSubmit={this.handleSubmit.bind(this)} isLoading={isLoading} errors={errors} /> }

          </Segment>
       </Container>
      </Grid.Row>  
    )
  }
}

// Proptypes definition
Form.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
}

Form.contextTypes = {
  router: PropTypes.object.isRequired
}

const MutationsQuery =  compose(
  graphql(CREATE_INVOICE_MUTATION, {
    name : 'createInvoiceMutation'
  }),
  graphql(UPDATE_INVOICE_MUTATION, {
    name: 'updateInvoiceMutation'
  }),
  graphql(GET_PROJECTS_WITHOUT_INVOICE_QUERY, {
    name : 'getProjectsWithoutInvoiceQuery',
    options: (props) => ({
      variables: {
        name: props.name ? props.name : '-//-'
      },
      fetchPolicy: 'network-only'
    })
  }),
  graphql(GET_SALES_WITHOUT_INVOICE_QUERY, {
    name : 'getSalesWithoutInvoiceQuery',
    options: (props) => ({
      variables: {
        name: props.name ? props.name : '-//-'
      },
      fetchPolicy: 'network-only'
    })
  }),
  graphql(GET_INVOICE_FORM_QUERY, {
    options: (props) => ({
      variables: {
        id: props.match.params.id ? parseInt(props.match.params.id) : 0
      }
    })
  })
)(Form)

export default connect(null, { addFlashMessage } ) (MutationsQuery)

