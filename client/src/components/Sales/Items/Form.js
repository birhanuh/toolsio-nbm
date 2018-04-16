import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { Validation } from '../../../utils'
import { addFlashMessage } from '../../../actions/flashMessageActions'
import { AddElement, ShowEditElement } from './Tr'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

// Localization 
import T from 'i18n-react'

import $ from 'jquery'

// Modal
$.fn.modal = require('semantic-ui-modal')
$.fn.dimmer = require('semantic-ui-dimmer')

class Item extends Component {
   constructor(props) {
    super(props)
    this.state = {
      itemToBeDeleated: {},
      newItem: {
        saleId: this.props.saleId,
        name: "",
        unit: "",
        quantity: 0,
        price: "",
        vat: "",
        errors: {},
        isLoading: false
      },
      editItem: {
        id: null,
        saleId: null,
        name: "",
        unit: "",
        quantity: 0,
        price: "",
        vat: "",
        errors: {},
        isLoading: false
      }
    }
  }

  handleNewItemChange = (e) => {
    if (this.state.newItem.errors[e.target.name]) {
      let errors = Object.assign({}, this.state.newItem.errors)
      delete errors[e.target.name]

      let updatedItem = Object.assign({}, this.state.newItem)
      updatedItem.saleId = this.props.saleId
      updatedItem[e.target.name] = e.target.value

      this.setState({
        newItem: updatedItem,
        errors
      })
    } else {
      let updatedItem = Object.assign({}, this.state.newItem)
      updatedItem.saleId = this.props.saleId
      updatedItem[e.target.name] = e.target.value

      this.setState({
        newItem: updatedItem
      })
    }
  }

  isValidNewItem() {
    const { errors, isValid } = Validation.validateItemInput(this.state.newItem)
    
    if (!isValid) {
      let updatedItem = Object.assign({}, this.state.newItem)
      updatedItem.errors = errors
      this.setState({
        newItem: updatedItem
      })
    }

    return isValid
  }

  handleCreate(event) {
    event.preventDefault()

    // Validation
    if (this.isValidNewItem()) { 
      const { saleId, name, unit, quantity, price, vat } = this.state.newItem

      this.props.createItemMutation({
        variables: { saleId, name, unit, quantity, price, vat },
        update: (proxy, { data: { createItem } }) => {
          const { success, task } = createItem

          if (!success) {
            return
          }
          /*
          // Read the data from our cache for this query.
          const data = proxy.readQuery({ query: getSaleQuery })
          // Add our comment from the mutation to the end.
          data.getSale.tasks.push(task)
          // Write our data back to the cache.
          proxy.writeQuery({ query: getSaleQuery, data }) */
        }})
      .then(res => {
          let updatedItem = Object.assign({}, this.state.newItem)
          updatedItem.saleId = null
          updatedItem.name = ""
          updatedItem.unit = ""
          updatedItem.quantity = ""
          updatedItem.price = ""
          updatedItem.vat = ""
          updatedItem.isLoading = false
           this.setState({
            newItem: updatedItem
          })

          // this.props.addFlashMessage({
          //   type: 'success',
          //   text: T.translate("sales.items.form.flash.success_add", { name: name})
          // })

          const { success, task, errors } = res.data.createItem

          if (!success) {
            let errorsList = {}
            errors.map(error => errorsList[error.path] = error.message)

            let updatedItem = Object.assign({}, this.state.newItem)
            updatedItem.errors = errorsList
            updatedItem.isLoading = false
            
            this.setState({ newItem: updatedItem })
          }
        })
        .catch(err => {
          let updatedItem = Object.assign({}, this.state.newItem)
          updatedItem.errors = err 
          updatedItem.isLoading = false

          this.setState({ newItem: updatedItem })
        })
    }
  }

  handleEditItemChange = (item, e) => {
    if (this.state.editItem.errors[e.target.name]) {
      let errors = Object.assign({}, this.state.editItem.errors)
      delete errors[e.target.name]

      let updatedItem = Object.assign({}, this.state.editItem)
      updatedItem.id = item.id
      updatedItem.saleId = item.saleId
      updatedItem[e.target.name] = e.target.value

      this.setState({
        editItem: updatedItem,
        errors
      })
    } else {
      let updatedItem = Object.assign({}, this.state.editItem)
      updatedItem.id = item.id
      updatedItem.saleId = item.saleId
      updatedItem[e.target.name] = e.target.value

      this.setState({
        editItem: updatedItem
      })
    }
  }

  handleEdit(item, event) {
    event.preventDefault()

    //Hide show tr and show edit tr
    $('#'+item.id+' td.show-item').hide()
    $('#'+item.id+' td.edit-item').show()
    
    let updatedItem = Object.assign({}, this.state.editItem)
    updatedItem.id = item.id
    updatedItem.saleId = item.saleId
    updatedItem.name = item.name
    updatedItem.unit = item.unit
    updatedItem.quantity = item.quantity
    updatedItem.price = item.price
    updatedItem.vat = item.vat
    this.setState({
      editItem: updatedItem
    })
  }

  handleCancelEdit(item, event) {
    event.preventDefault()

    // Hide edit tr and show show tr
    $('#'+item.id+' td.edit-item').hide()
    $('#'+item.id+' td.show-item').show()    
  }

  isValidEditItem() {
    const { errors, isValid } = Validation.validateItemInput(this.state.editItem)
    
    if (!isValid) {
      let updatedItem = Object.assign({}, this.state.editItem)
      updatedItem.errors = errors
      this.setState({
        editItem: updatedItem
      })
    }

    return isValid
  }

  handleUpdate(event) {
    event.preventDefault()

    // Validation
    if (this.isValidEditItem()) { 
      const { id, saleId, name, unit, quantity, price, vat } = this.state.editItem
      
      this.props.updateItemMutation({
        variables: { id, saleId, name, unit, quantity, price, vat },
        update: (proxy, { data: { updateItem } }) => {
          const { success, task } = updateItem

          if (!success) {
            return
          }
          /*
          // Read the data from our cache for this query.
          const data = proxy.readQuery({ query: getSaleQuery })
          // Add our comment from the mutation to the end.
          data.getSale.tasks.push(task)
          // Write our data back to the cache.
          proxy.writeQuery({ query: getSaleQuery, data }) */
        }})
      .then(res => {
          let updatedItem = Object.assign({}, this.state.editItem)
          updatedItem.saleId = null
          updatedItem.name = ""
          updatedItem.unit = ""
          updatedItem.quantity = ""
          updatedItem.price = ""
          updatedItem.vat = ""
          updatedItem.isLoading = false
           this.setState({
            editItem: updatedItem
          })

          // this.props.addFlashMessage({
          //   type: 'success',
          //   text: T.translate("sales.items.form.flash.success_update", { name: name})
          // })

          const { success, task, errors } = res.data.updateItem

          if (!success) {
            let errorsList = {}
            errors.map(error => errorsList[error.path] = error.message)

            let updatedItem = Object.assign({}, this.state.editItem)
            updatedItem.errors = errorsList
            updatedItem.isLoading = false
            
            this.setState({ editItem: updatedItem })
          }
        })
        .catch(err => {
          let updatedItem = Object.assign({}, this.state.editItem)
          updatedItem.errors = err 
          updatedItem.isLoading = false

          this.setState({ editItem: updatedItem })
        }) 
    }
  }

  showConfirmationModal(item, event) {
    event.preventDefault()
    
    this.setState({
      itemToBeDeleated: item
    })

    // Show modal
    $('.small.modal.item').modal('show')
  }
    
  hideConfirmationModal(event) {
    event.preventDefault()

    // Show modal
    $('.small.modal.item').modal('hide')
  }

  handleDelete(item, event) {
    event.preventDefault()
    
    let name = item.name

    this.props.deleteItem(item).then(
      () => {
        this.setState({
          itemToBeDeleated: {}
        })

        this.props.addFlashMessage({
          type: 'success',
          text: T.translate("sales.items.form.flash.success_delete", { name: name})
        })  
      },
      ({ response }) => {
      }
    ) 
  }

  render() {
    const { newItem, editItem } = this.state
  
    let items = this.props.items   
    
    const itemsList = (
      items.map(item => 
        <ShowEditElement 
          key={item.id}
          item={item} 
          editItem={editItem}
          handleCancelEdit={this.handleCancelEdit.bind(this, item)}
          handleEditItemChange={this.handleEditItemChange.bind(this, item)} 
          handleUpdate={this.handleUpdate.bind(this)}
          handleEdit={this.handleEdit.bind(this, item)}
          showConfirmationModal={this.showConfirmationModal.bind(this, item)}/> 
        )
    )

    return(
      <form className={classnames("ui small form", { loading: newItem.isLoading || editItem.isRequired })}>
        <table className="ui very basic table items">
          <thead>
            <tr>
              <th>{T.translate("sales.items.form.name")}</th>
              <th>{T.translate("sales.items.form.unit")}</th>
              <th>{T.translate("sales.items.form.quantity")}</th>
              <th>{T.translate("sales.items.form.price")}</th>
              <th>{T.translate("sales.items.form.vat")}</th>
              <th width="110px">{T.translate("sales.items.form.actions")}</th>
            </tr>
          </thead>
          <tbody>

            { items.length !== 0 && itemsList }
            
            <AddElement 
              item={newItem} 
              handleNewItemChange={this.handleNewItemChange.bind(this)} 
              handleCreate={this.handleCreate.bind(this)} /> 
            
          </tbody>
        </table>
        <div className="ui small modal item">
          <div className="header">Confirmation</div>
          <div className="content">
            <p className="red">{T.translate("sales.items.form.confirmation_msg")}</p>
          </div>
          <div className="actions">
            <button className="ui button" onClick={this.hideConfirmationModal.bind(this)}>{T.translate("sales.items.cancel")}</button>
            <button className="ui negative button" onClick={this.handleDelete.bind(this, this.state.itemToBeDeleated)}>{T.translate("sale.items.delete")}</button>
          </div>
        </div>
      </form>
    )
  }
  
}

Item.propTypes = {
  items: PropTypes.array.isRequired,
  saleId: PropTypes.number.isRequired,
  addFlashMessage: PropTypes.func.isRequired
}

const createItemMutation = gql`
  mutation createItem($name: String!, $unit: String!, $quantity: Int!, $price: Float!, $vat: Int!, $saleId: Int!) {
    createItem(name: $name, unit: $unit, quantity: $quantity, price: $price, vat: $vat, saleId: $saleId) {
      success
      item {
        id
        name
        unit
        quantity
        price
        vat
      }
      errors {
        path
        message
      }
    }
  }
`
const updateItemMutation = gql`
  mutation updateItem($id: id, $name: String!, $unit: String!, $quantity: Int!, $price: Float!, $vat: Int!, $saleId: Int!) {
    updateItem(id: $id, name: $name, unit: $unit, quantity: $quantity, price: $price, vat: $vat, saleId: $saleId) {
      success
      item {
        id
        name
        unit
        quantity
        price
        vat
      }
      errors {
        path
        message
      }
    }
  }
`

const Mutations =  compose(
  graphql(createItemMutation, {
    name : 'createItemMutation'
  }),
   graphql(updateItemMutation, {
    name : 'updateItemMutation'
  })
)(Item)

export default connect(null, { addFlashMessage } ) (Mutations)

