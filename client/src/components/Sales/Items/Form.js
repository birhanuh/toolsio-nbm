import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { Validation } from '../../../utils'
import { createItem, updateItem, deleteItem } from '../../../actions/saleActions'
import { addFlashMessage } from '../../../actions/flashMessageActions'
import { AddElement, ShowEditElement } from './Tr'

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
        _creator: this.props.creator,
        name: "",
        unit: "",
        quantity: "",
        price: "",
        vat: "",
        errors: {},
        isLoading: false
      },
      editItem: {
        _id: null,
        _creator: null,
        name: "",
        unit: "",
        quantity: "",
        price: "",
        vat: "",
        errors: {},
        isLoading: false
      }
    }
  }

  handleNewItemChange = (e) => {
    if (!!this.state.newItem.errors.message.errors[e.target.name]) {
      let errors = Object.assign({}, this.state.newItem.errors)
      delete errors.message.errors[e.target.name]

      let updatedItem = Object.assign({}, this.state.newItem)
      updatedItem._creator = this.props.creator
      updatedItem[e.target.name] = e.target.value

      this.setState({
        newItem: updatedItem,
        errors
      })
    } else {
      let updatedItem = Object.assign({}, this.state.newItem)
      updatedItem._creator = this.props.creator
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
      updatedItem.errors.message.errors = errors
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
      const { _creator, name, unit, quantity, price, vat } = this.state.newItem

      let updatedItem = Object.assign({}, this.state.newItem)
      updatedItem.isLoading = true
       this.setState({
        newItem: updatedItem
      })
      this.props.createItem({ _creator, name, unit, quantity, price, vat }).then(
        () => {
          let updatedItem = Object.assign({}, this.state.newItem)
          updatedItem._creator = null
          updatedItem.name = ""
          updatedItem.unit = ""
          updatedItem.quantity = ""
          updatedItem.price = ""
          updatedItem.vat = ""
          updatedItem.isLoading = false
           this.setState({
            newItem: updatedItem
          })

          this.props.addFlashMessage({
            type: 'success',
            text: T.translate("sales.items.form.flash.success_add", { name: name})
          })
        },
        ({ response }) => {
          let updatedItem = Object.assign({}, this.state.newItem)
          updatedItem.errors.message.errors = response.data.errors.message.errors
          updatedItem.isLoading = false
          this.setState({ newItem: updatedItem })
        }
      )  
    }
  }

  handleEditItemChange = (item, e) => {
    if (!!this.state.editItem.errors.message.errors[e.target.name]) {
      let errors = Object.assign({}, this.state.editItem.errors)
      delete errors.message.errors[e.target.name]

      let updatedItem = Object.assign({}, this.state.editItem)
      updatedItem._id = item._id
      updatedItem._creator = item._creator
      updatedItem[e.target.name] = e.target.value

      this.setState({
        editItem: updatedItem,
        errors
      })
    } else {
      let updatedItem = Object.assign({}, this.state.editItem)
      updatedItem._id = item._id
      updatedItem._creator = item._creator
      updatedItem[e.target.name] = e.target.value

      this.setState({
        editItem: updatedItem
      })
    }
  }

  handleEdit(item, event) {
    event.preventDefault()

    //Hide show tr and show edit tr
    $('#'+item._id+' td.show-item').hide()
    $('#'+item._id+' td.edit-item').show()
    
    let updatedItem = Object.assign({}, this.state.editItem)
    updatedItem._id = item._id
    updatedItem._creator = item._creator
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
    $('#'+item._id+' td.edit-item').hide()
    $('#'+item._id+' td.show-item').show()    
  }

  isValidEditItem() {
    const { errors, isValid } = Validation.validateItemInput(this.state.editItem)
    
    if (!isValid) {
      let updatedItem = Object.assign({}, this.state.editItem)
      updatedItem.errors.message.errors = errors
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
      const { _id, _creator, name, unit, quantity, price, vat } = this.state.editItem
      
      let updatedItem = Object.assign({}, this.state.editItem)
      updatedItem.isLoading = true
       this.setState({
        editItem: updatedItem
      })
      this.props.updateItem({ _id, _creator, name, unit, quantity, price, vat }).then(
        (response) => {
          let updatedItem = Object.assign({}, this.state.editItem)
          updatedItem.isLoading = false
          this.setState({
            editItem: updatedItem
          })

          this.props.addFlashMessage({
            type: 'success',
            text: T.translate("sales.items.form.flash.success_update", { name: name})
          })

          // Hide edit tr and show show tr
          $('#'+_id+' td.edit-item').hide()
          $('#'+_id+' td.show-item').show()   
        },
        ({ response }) => {
          let updatedItem = Object.assign({}, this.state.editItem)
          updatedItem.errors.message.errors = response.data.errors.message.errors
          updatedItem.isLoading = false
          this.setState({ editItem: updatedItem })
        }
      )  
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
          key={item._id}
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
  creator: PropTypes.string.isRequired,
  createItem: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired
}

export default connect(null, { createItem, updateItem, deleteItem, addFlashMessage } )(Item)
