import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { addFlashMessage } from '../../actions/flashMessages'
import { fetchInvoice, deleteInvoice } from '../../actions/invoiceActions'

// Localization 
import T from 'i18n-react'

import $ from 'jquery'

// Modal
$.fn.modal = require('semantic-ui-modal')
$.fn.dimmer = require('semantic-ui-dimmer')

class Show extends Component {
  
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
    }
  }

  componentDidMount = () => {
    // Fetch Invoice when id is present in params
    const { match } = this.props
    if (match.params.id) {
      this.props.fetchInvoice(match.params.id)
    } 
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.invoice) {
      this.setState({
        _id: nextProps.invoice._id,
        sale: nextProps.invoice.sale,
        project: nextProps.invoice.project,
        date_of_an_invoice: nextProps.invoice.date_of_an_invoice,
        deadline: nextProps.invoice.deadline,
        paymentTerm: nextProps.invoice.paymentTerm,
        intersetInArrears: nextProps.invoice.intersetInArrears,
        status: nextProps.invoice.contact.status,
        description: nextProps.invoice.contact.description
      })
    }
  }

  showConfirmationModal(event) {
    event.preventDefault()

    // Show modal
    $('.small.modal.invoice').modal('show')
  }

  hideConfirmationModal(event) {
    event.preventDefault()

    // Show modal
    $('.small.modal.invoice').modal('hide')
  }

  handleDelete(id, event) {
    event.preventDefault()
    
    let name = this.state.name

    this.props.deleteInvoice(id).then(
      () => {
        this.props.addFlashMessage({
          type: 'success',
          text: T.translate("invoices.show.flash.success_delete", { name: name})
        })  
        this.context.router.history.push('/invoices')
      },
      ({ response }) => {
      }
    ) 
    
  }

  render() {
    const { _id, sale, project, deadline, paymentTerm, intersetInArrears, status, referenceNumber, description, createdAt } = this.state
    
    return (
      <div className="ui stackable grid">
        <div className="twelve wide column">
          <div className="ui segment">    
            <h1 className="ui header">{T.translate("invoices.show.header")}
              <div class="sub header">{sale || project}</div>
            </h1> 
            <dl className="dl-horizontal">
              <dt>{T.translate("invoices.show.customer")}</dt>
              <dd>{sale.customer.name || project.customer.name}</dd>
              {/*<dt>{T.translate("invoices.show.user")}</dt>
              <dd>{invoice.user.first_name}</dd>*/}            
              <dt>{T.translate("invoices.show.contact.date_of_an_invoice")}</dt>
              <dd>{createdAt}</dd>
              <dt>{T.translate("invoices.show.deadline")}</dt>
              <dd>{deadline}</dd>
              <dt>{T.translate("invoices.show.address.payment_term")}</dt>
              <dd>{paymentTerm}</dd>
              <dt>{T.translate("invoices.show.interset_in_arrears")}</dt>
              <dd>{intersetInArrears}</dd>
              <dt>{T.translate("invoices.show.reference_number")}</dt>
              <dd>{referenceNumber}</dd>
              <dt>{T.translate("invoices.show.description")}</dt>
              <dd>{description}</dd>
            </dl>  
            <br/>

            <h3 className="ui header">{T.translate("invoices.show.list")}</h3>

            { sale &&
              <div>
                <h3 className="ui header">{T.translate("sales.page.header")}</h3>
                <table className="ui very basic table sales">
                  <thead>
                    <tr>
                      <th>{T.translate("sales.show.name")}</th>
                      <th>{T.translate("sales.show.status")}</th>
                      <th>{T.translate("sales.show.invoice")}</th>
                      <th>{T.translate("sales.show.items")}</th>
                      <th>{T.translate("sales.show.total")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{}</td>
                      <td>{}</td>
                      <td>{}</td>
                      <td>{}</td>
                      <td>{}</td>
                    </tr>
                  </tbody>  
                </table>
              </div>
            }

            { project &&
              <div>
                <h4 className="ui header">{T.translate("projects.page.header")}</h4>
                <table className="ui very basic table projects">
                  <thead>
                    <tr>
                      <th>{T.translate("projects.show.name")}</th>
                      <th>{T.translate("projects.show.deadline")}</th>
                      <th>{T.translate("projects.show.status")}</th>
                      <th>{T.translate("projects.show.tasks")}</th>
                      <th>{T.translate("projects.show.total")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{}</td>
                      <td>{}</td>
                      <td>{}</td>
                      <td>{}</td>
                      <td>{}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            }

            <div className="ui divider"></div>

            <button className="ui negative button" onClick={this.showConfirmationModal.bind(this)}><i className="delete icon"></i>{T.translate("button.delete")}</button>
            <Link to={`/invoices/edit/${_id}`} className="ui primary button"><i className="edit icon"></i>{T.translate("button.edit")}</Link>
          </div>    
        </div>

        <div className="ui small modal invoice">
          <div className="header">Confirmation</div>
          <div className="content">
            <p>{T.translate("invoices.show.confirmation_msg")}</p>
          </div>
          <div className="actions">
            <button className="ui button" onClick={this.hideConfirmationModal.bind(this)}>{T.translate("button.cancel")}</button>
            <button className="ui negative button" onClick={this.handleDelete.bind(this, _id)}>{T.translate("button.delete")}</button>
          </div>
        </div>
      </div>
    )
  }
}

Show.propTypes = {
  fetchInvoice: PropTypes.func.isRequired,
  deleteInvoice: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired
}

Show.contextTypes = {
  router: PropTypes.object.isRequired
}

function mapStateToProps(state, props) {
  const { match } = props
  if (match.params.id) {
    return {
      invoice: state.invoices.find(item => item._id === match.params.id)
    }
  } 
}

export default connect(mapStateToProps, { fetchInvoice, deleteInvoice, addFlashMessage } )(Show)
