import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import classnames from 'classnames'
import Moment from 'moment'
import { addFlashMessage } from '../../actions/flashMessageActions'
import { fetchSale, deleteSale } from '../../actions/saleActions'
import { SelectField } from '../../utils/FormFields'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'


import Breadcrumb from '../Layouts/Breadcrumb'

import ItemForm from './Items/Form'

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
      id: this.props.data.getSale ? this.props.data.getSale.id : null,
      name: this.props.data.getSale ? this.props.data.getSale.name : '',
      deadline: this.props.data.getSale ? this.props.data.getSale.deadline : '',
      customer: this.props.data.getSale ? this.props.data.getSale.customer : '',
      status: this.props.data.getSale ? this.props.data.getSale.status : '',
      description: this.props.data.getSale ? this.props.data.getSale.description : '',
      items: this.props.data.getSale ? this.props.data.getSale.items : []
    }
  }

  componentDidMount = () => {
    // Fetch Sale when id is present in params
    const { match } = this.props
   
    // Check if param id is an int
    const projectId = parseInt(match.params.id, 10)
    
    if (!projectId) {
      return <Redirect to="/projects" />
    } else {
      //this.props.getSaleMutation({ variables: {id: projectId} })
    } 
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.data.getSale) {
      this.setState({
        id: nextProps.data.getSale.id,
        name: nextProps.data.getSale.name,
        deadline: nextProps.data.getSale.deadline,
        customer: nextProps.data.getSale.customer,
        status: nextProps.data.getSale.status,
        description: nextProps.data.getSale.description,
        items: nextProps.data.getSale.items
      })
    }
  }

  showConfirmationModal(event) {
    event.preventDefault()

    // Show modal
    $('.small.modal.sale').modal('show')
  }

  hideConfirmationModal(event) {
    event.preventDefault()

    // Show modal
    $('.small.modal.sale').modal('hide')
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleDelete(id, event) {
    event.preventDefault()

    this.props.deleteSaleMutation({ 
      variables: { id },
      update: (proxy, { data: { deleteSale } }) => {
        const { success } = deleteSale

        if (!success) {
          return
        }
        // Read the data from our cache for this query.
        const data = proxy.readQuery({ query: getSalesQuery })
        // Add our comment from the mutation to the end.
        
        let updatedData = data.getSales.filter(sale => sale.id !== id) 
        data.getSales = updatedData

        // Write our data back to the cache.
        proxy.writeQuery({ query: getSalesQuery, data })
      }})
      .then(res => {          

        const { success, project, errors } = res.data.deleteSale

        if (success) {
          this.props.addFlashMessage({
            type: 'success',
            text: T.translate("sales.show.flash.success_delete")
          })  

          this.context.router.history.push('/sales')
        } else {
          let errorsList = {}
          errors.map(error => errorsList[error.path] = error.message)

          this.setState({ errors: errorsList, isLoading: false })
        }
      })
      .catch(err => {
        this.props.addFlashMessage({
          type: 'error',
          text: T.translate("sales.show.flash.error_delete")
        })  
      })
    
  }

  render() {
    const { id, name, deadline, customer, status, description, items } = this.state
    
    return (
      <div className="ui stackable grid">

        <Breadcrumb />

        <div className="twelve wide column">
          <div className="ui segment">    
            <h1 className={classnames("ui header", {blue: status === 'new', orange: status === 'in progress', green: status === 'ready', turquoise: status === 'delivered', red: status === 'delayed'})}>{name}</h1> 
            <dl className="dl-horizontal">
              <dt>{T.translate("sales.show.customer")}</dt>
              <dd>{customer ? <Link to={`/customers/show/${customer.id}`}>{customer.name}</Link> : '-'}</dd>
              {/*<dt>{T.translate("sales.show.user")}</dt>
              <dd>{sale.user.first_name}</dd>*/}
              <dt>{T.translate("sales.show.deadline")}</dt>
              <dd>{Moment(deadline).format('DD/MM/YYYY')}</dd>
              <dt>{T.translate("sales.show.status")}</dt>
              <dd>
                <SelectField
                  label=""
                  name="status"
                  type="select"
                  value={status} 
                  formClass={classnames("inline field show", {blue: status === 'new', orange: status === 'in progress', green: status === 'ready', turquoise: status === 'delivered', red: status === 'delayed'})}
                  onChange={this.handleChange.bind(this)} 
                  error=""

                  options={[
                    <option key="default" value="new" disabled>NEW</option>,
                    <option key="in progress" value="in progress">IN PROGRESS</option>,
                    <option key="ready" value="ready">READY</option>,
                    <option key="delayed" value="delayed">DELAYED</option>,
                    <option key="delivered" value="delivered">DELIVERED</option>
                    ]
                  }
                />
              </dd>
             
              <dt>{T.translate("sales.show.description")}</dt>
              <dd>
                {description ? description : '-'}
              </dd>    
            </dl>  

            <h3 className="ui header">{T.translate("sales.items.header")}</h3>

            { items && this.state.id && <ItemForm saleId={this.state.id} items={this.state.items} /> }
            
            <div className="ui divider"></div>

            <button className="ui negative button" onClick={this.showConfirmationModal.bind(this)}><i className="trash icon"></i>{T.translate("sales.show.delete")}</button>
            <Link to={`/sales/edit/${id}`} className="ui primary button"><i className="edit icon"></i>{T.translate("sales.show.edit")}</Link>
          </div>    
        </div>

        <div className="ui small modal sale">
          <div className="header">Confirmation</div>
          <div className="content">
            <p className="red">{T.translate("sales.show.confirmation_msg")}</p>
          </div>
          <div className="actions">
            <button className="ui button" onClick={this.hideConfirmationModal.bind(this)}>{T.translate("sales.show.cancel")}</button>
            <button className="ui negative button" onClick={this.handleDelete.bind(this, id)}>{T.translate("sales.show.delete")}</button>
          </div>
        </div>
      </div>
    )
  }
}

Show.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
}

Show.contextTypes = {
  router: PropTypes.object.isRequired
}

const deleteSaleMutation = gql`
  mutation deleteSale($id: Int!) {
    deleteSale(id: $id) {
      success
      errors {
        path
        message
      }
    }
  }
`

const getSaleQuery = gql`
  query getSale($id: Int!) {
    getSale(id: $id) {
      id
      name 
      deadline
      status
      description
      customer {
        id
        name
      }
      items {
        id
        name
        unit
        quantity
        price
        vat
      }
    }
  }
`

const getSalesQuery = gql`
  query {
    getSales {
      id
      name 
      deadline
      status
      description
      customer {
        name
      }
    }
  }
`
const MutationQuery =  compose(
  graphql(deleteSaleMutation, {
    name : 'deleteSaleMutation'
  }),
  graphql(getSalesQuery),
  graphql(getSaleQuery, {
    options: (props) => ({
      variables: {
        id: parseInt(props.match.params.id)
      },
    })
  })
)(Show)

export default connect(null, { addFlashMessage } ) (MutationQuery)
