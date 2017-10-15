import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { createInvoice, fetchInvoice, updateInvoice } from '../../actions/invoiceActions'
import { fetchSales } from '../../actions/saleActions'
import { fetchProjects } from '../../actions/projectActions'
import Form from './Form'

// Localization 
import T from 'i18n-react'

class FormPage  extends Component {
  
  state = {
    redirect: false
  }

  componentDidMount = () => {
    // Fetch Invoice when id is present in params
    const { match } = this.props
    if (match.params.id) {
      this.props.fetchInvoice(match.params.id)
    } 

    // Fetch Sales and Project
    this.props.fetchSales()
    this.props.fetchProjects()
  }

  saveInvoice = ({ _id, sale, project, deadline, paymentTerm, intersetInArrears, status, description }) => {
    if (_id) {
      return this.props.updateInvoice({ _id, sale, project, deadline, paymentTerm, intersetInArrears, status, description })
        .then(() => 
          { 
            this.setState({ redirect: true }) 

            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("invoices.form.flash.success_update")
            })  
            this.context.router.history.push('/invoices')
        })   
    } else {        
      return this.props.createInvoice({ _id, sale, project, deadline, paymentTerm, intersetInArrears, status, description })
        .then(() => 
          { 
            this.setState({ redirect: true }) 

            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("invoices.form.flash.success_create")
            })  
            this.context.router.history.push('/invoices')
          })   
    }
  }

  render() {
   return (
      <div>
        {
          this.state.redirect ? 
          <Redirect to="/invoices" /> : 
          <Form invoice={this.props.invoice} saveInvoice={this.saveInvoice} sales={this.props.sales} invoices={this.props.invoices}/>
        }
      </div>
    )
  }
}

FormPage.propTypes = {
  createInvoice: PropTypes.func.isRequired,
  fetchInvoice: PropTypes.func.isRequired,
  updateInvoice: PropTypes.func.isRequired,
  fetchSales: PropTypes.func.isRequired,
  fetchProjects: PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  const { match } = props
  if (match.params.id) {
    return {
      invoice: state.invoices.find(item => item._id === match.params.id),
      sales: state.sales,
      invoices: state.invoices
    }
  } 
  return { 
    invoice: null,
    sales: state.sales,
    invoices: state.invoices
  }
}

FormPage.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(mapStateToProps, { createInvoice, fetchInvoice, updateInvoice, fetchSales, fetchProjects })(FormPage)

