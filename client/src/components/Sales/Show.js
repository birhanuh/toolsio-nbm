import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import classnames from 'classnames'
import Moment from 'moment'
import { addFlashMessage } from '../../actions/flashMessageActions'
// Semantic UI JS
import { Select, Form, Modal } from 'semantic-ui-react'
import { graphql, compose } from 'react-apollo'
import { GET_SALES_QUERY, GET_SALE_QUERY, UPDATE_SALE_MUTATION, DELETE_SALE_MUTATION } from '../../graphql/sales'

import ItemsForm from './Items/Form'

// Localization 
import T from 'i18n-react'

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
      items: this.props.data.getSale ? this.props.data.getSale.items : [],
      user: this.props.data.getSale ? this.props.data.getSale.user : null,
      total: this.props.data.getSale ? this.props.data.getSale.total : 0,
      openConfirmationModal: false 
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
        items: nextProps.data.getSale.items,
        user: nextProps.data.getSale.user,
        total: nextProps.data.getSale.total
      })
    }
  }

  componentDidMount = () => {
    // Fetch Sale when id is present in params
    const { match } = this.props
   
    // Check if param id is an int
    const saleId = parseInt(match.params.id, 10)
    
    if (!saleId) {
      return <Redirect to="/sales" />
    } else {
      //this.props.getSaleMutation({ variables: {id: saleId} })
    } 
  }

  toggleConfirmationModal = () => {    
    this.setState(state => ({ openConfirmationModal: !state.openConfirmationModal }))
  }

  handleStatusChange = (value) => {
    const { id } = this.state

    this.props.updateSaleMutation({ 
        variables: { id, status: value }
      })
      .then(res => {          
        const { success, sale, errors } = res.data.updateSale

        if (success) {
          this.props.addFlashMessage({
            type: 'success',
            text: T.translate("sales.form.flash.success_update", { name: sale.name})
          })  
        } else {
          let errorsList = {}
          errors.map(error => errorsList[error.path] = error.message)

          this.setState({ errors: errorsList, isLoading: false })
        }
      })
      .catch(err => this.setState({ errors: err, isLoading: false }))
  }

  handleDelete(id, event) {
    event.preventDefault()

    const { name } = this.state
    
    this.props.deleteSaleMutation({ 
      variables: { id },
      update: (proxy, { data: { deleteSale } }) => {
        const { success } = deleteSale

        if (!success) {
          return
        }
        // Read the data from our cache for this query.
        const data = proxy.readQuery({ query: GET_SALES_QUERY,
          variables: {
            order: 'DESC',
            offset: 0,
            limit: 10
          } 
        })
        // Add our comment from the mutation to the end.
        
        let updatedData = data.getSales.filter(sale => sale.id !== id) 
        data.getSales = updatedData

        // Write our data back to the cache.
        proxy.writeQuery({ query: GET_SALES_QUERY, data })
      }})
      .then(res => {          

        const { success, errors } = res.data.deleteSale

        if (success) {
          this.props.addFlashMessage({
            type: 'success',
            text: T.translate("sales.show.flash.success_delete", { name: name})
          })  

          this.context.router.history.push('/sales')
        } else {
          let errorsList = {}
          errors.map(error => errorsList[error.path] = error.message)

          this.setState({ errors: errorsList, isLoading: false })
        }
      })
      .catch(() => {
        this.props.addFlashMessage({
          type: 'error',
          text: T.translate("sales.show.flash.error_delete", { name: name})
        })  
      })
    
  }

  render() {
    const { id, name, deadline, customer, status, description, items, user, openConfirmationModal } = this.state
    
    let itemsTotal = 0
    items.map(item => (itemsTotal+=item.unitPrice))

    return [
      <div key="segment" className="column row">
        <div className="twelve wide column">
          <div className="ui segment">    
            <h1 className={classnames("ui dividing header", {blue: status === 'new', orange: status === 'in progress', green: status === 'ready', turquoise: status === 'delivered', red: status === 'delayed'})}>{name}</h1> 
            <table className="ui very basic collapsing celled fluid table">
              <tbody>
                <tr>
                  <td>
                    <i className="ui tiny header">{T.translate("sales.show.customer")}</i>
                  </td>
                  <td>
                    {customer ? <Link to={`/customers/show/${customer.id}`}>{customer.name}</Link> : '-'}
                  </td>
                </tr>
                <tr>
                  <td>
                    <i className="ui tiny header">{T.translate("sales.show.user")}</i>
                  </td>
                  <td>
                    {user && user.firstName}
                  </td>
                </tr>
                <tr>
                  <td>
                    <i className="ui tiny header">{T.translate("sales.show.deadline")}</i>
                  </td>
                  <td>
                    {Moment(deadline).format('ll') }
                  </td>
                </tr>
                <tr>
                  <td>
                    <i className="ui tiny header">{T.translate("sales.show.status")}</i>
                  </td>
                  <td>
                    <Form.Field 
                      placeholder={T.translate("sales.form.select_status")}
                      control={Select}
                      name="status"
                      value={status} 
                      onChange={(e, {value}) => this.handleStatusChange(value)} 
                      className={classnames("inline field show", {blue: status === 'new', orange: status === 'in progress', green: status === 'finished', turquoise: status === 'delivered', red: status === 'delayed'})}
                      options={[
                        { key: "default", value: "new", text: 'NEW' },
                        { key: "in progress", value: "in progress", text: 'IN PROGRESS' },
                        { key: "finished", value: "finished", text: 'FINISHED' },
                        { key: "delayed", value: "delayed", text: 'DELAYED' },
                        { key: "delivered", value: "delivered", text: 'DELIVERED' }
                      ]}
                      selection
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <i className="ui tiny header">{T.translate("sales.show.description")}</i>
                  </td>
                  <td>
                    {description ? description : '-'}
                  </td>
                </tr>
              </tbody>
            </table> 

            <h4 className="ui top attached block header">{T.translate("sales.items.header")}</h4>
            <div className="ui bottom attached segment p-3">
              { (items && id) && <ItemsForm saleId={id} itemsTotal={itemsTotal} items={items} /> }
            </div>
            
            <div className="pt-3">
              <button className="ui negative button" onClick={this.toggleConfirmationModal}><i className="trash icon"></i>{T.translate("sales.show.delete")}</button>
              <Link to={`/sales/edit/${id}`} className="ui primary button"><i className="edit icon"></i>{T.translate("sales.show.edit")}</Link>
            </div>
          </div>    
        </div>
      </div>,

      <Modal 
        key="modal" 
        className="ui small modal sale"
        open={openConfirmationModal}>
        <Modal.Header>{T.translate("sales.show.confirmation_header")}</Modal.Header>
        <Modal.Content>
         <p className="red">{T.translate("sales.show.confirmation_msg")}</p>
        </Modal.Content>
        <Modal.Actions>
          <button className="ui button" onClick={this.toggleConfirmationModal}>{T.translate("sales.show.cancel")}</button>
          <button className="ui negative button" onClick={this.handleDelete.bind(this, id)}>{T.translate("sales.show.delete")}</button>
        </Modal.Actions>
      </Modal>
    ]
  }
}

Show.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
}

Show.contextTypes = {
  router: PropTypes.object.isRequired
}

const MutationQuery =  compose(
  graphql(DELETE_SALE_MUTATION, {
    name : 'deleteSaleMutation'
  }),
  graphql(GET_SALES_QUERY, {
    options: () => ({
      variables: {
        order: 'DESC',
        offset: 0,
        limit: 10
      }
    })
  }),
  graphql(UPDATE_SALE_MUTATION, {
    name: 'updateSaleMutation'
  }),
  graphql(GET_SALE_QUERY, {
    options: (props) => ({
      variables: {
        id: parseInt(props.match.params.id)
      }
    })
  })
)(Show)

export default connect(null, { addFlashMessage } ) (MutationQuery)
