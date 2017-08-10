import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { Validation } from '../../utils'
import { createItem, updateItem, deleteItem } from '../../actions/saleActions'
import { InputField, SelectField } from '../../utils/FormFields'
import { addFlashMessage } from '../../actions/flashMessages'

// Localization 
import T from 'i18n-react'

class Item extends Component {
   constructor(props) {
    super(props)
    this.state = {
      _id: this.props.sale._id,
      item: {
        _creator: null,
        name: "",
        unit: "",
        quantity: "",
        price: "",
        vat: "",
        errors: {
          message: {
            errors: {}
          }
        },
        isLoading: false
      }
    }
  }

  handleChange = (e) => {
    if (!!this.state.item.errors.message.errors[e.target.name]) {
      let errors = Object.assign({}, this.state.item.errors)
      delete errors.message.errors[e.target.name]

      let updatedItem = Object.assign({}, this.state.item)
      updatedItem._creator = this.state._id
      updatedItem[e.target.name] = e.target.value

      this.setState({
        item: updatedItem,
        errors
      })
    } else {
      let updatedItem = Object.assign({}, this.state.item)
      updatedItem._creator = this.state._id
      updatedItem[e.target.name] = e.target.value

      this.setState({
        item: updatedItem
      })
    }
  }

  isValid() {
    const { errors, isValid } = Validation.validateItemInput(this.state.item)
    
    if (!isValid) {
      let updatedItem = Object.assign({}, this.state.item)
      updatedItem.errors.message.errors = errors
      this.setState({
        item: updatedItem
      })
    }

    return isValid
  }

  handleSubmit(event) {
     event.preventDefault()
     
    // Validation
    if (this.isValid()) { 
      const { _id, item } = this.state
      let updatedItem = Object.assign({}, this.state.item)
      updatedItem.isLoading = true
       this.setState({
        item: updatedItem
      })
      this.props.createItem({ _id, item }).then(
        () => {
          let updatedItem = Object.assign({}, this.state.item)
          updatedItem._creator = null
          updatedItem.name = ""
          updatedItem.unit = ""
          updatedItem.quantity = ""
          updatedItem.price = ""
          updatedItem.vat = ""
          updatedItem.isLoading = false
           this.setState({
            item: updatedItem
          })

          this.props.addFlashMessage({
            type: 'success',
            text: 'Item added'
          })
        },
        ({ response }) => {
          let updatedItem = Object.assign({}, this.state.item)
          updatedItem.errors.message.errors = response.data.errors.message.errors
          updatedItem.isLoading = false
          this.setState({ item: updatedItem })
        }
      )  
    }
  }

  render() {
    const { item } = this.state
    let items = this.props.sale.items

    const itemsList = (
      items.map(item => 
        <tr key={item._id}>
          <td>{item.name}</td>
          <td>{item.unit}</td>
          <td>{item.quantity}</td>
          <td>{item.price}</td>
          <td>{item.vat}</td>
          <td>
            <button className="ui small icon basic button red" onClick={deleteItem(item._id)}><i className="delete icon"></i></button>
            <button className="ui small icon basic button green" onClick={updateItem(item._id)}><i className="edit icon"></i></button>
          </td>
        </tr>
      )
    )

    return(
      <form className={classnames("ui form", { loading: item.isLoading })} onSubmit={this.handleSubmit.bind(this)}>
        <table className="ui small very basic table item">
          <thead>
            <tr>
              <th>{T.translate("sales.items.new.name")}</th>
              <th>{T.translate("sales.items.new.unit")}</th>
              <th>{T.translate("sales.items.new.quantity")}</th>
              <th>{T.translate("sales.items.new.price")}</th>
              <th>{T.translate("sales.items.new.vat")}</th>
              <th>{T.translate("sales.items.new.actions")}</th>
            </tr>
          </thead>
          <tbody>

            { items.length !== 0 && itemsList }
            
            <tr>
              <td>
                <InputField
                  name="name" 
                  value={item.name} 
                  onChange={this.handleChange.bind(this)}  
                  placeholder="Name"
                  error={item.errors.message && item.errors.message.errors && item.errors.message.errors.name && item.errors.message.errors.name.message}
                  formClass="ui small input"
                />
              </td>
              <td>
                <SelectField
                  name="unit"
                  type="select"
                  value={item.unit} 
                  onChange={this.handleChange.bind(this)}  
                  error={item.errors.message && item.errors.message.errors && item.errors.message.errors.unit && item.errors.message.errors.unit.message}
                  formClass="ui small input"
                  options={[
                    <option key="default" value="" disabled>{T.translate("sales.items.new.select_unit")}</option>,
                    <option key="piece" value="piece">Piece</option>,
                    <option key="meter" value="meter">Meter</option>,
                    <option key="kilo gram" value="kilo gram">Kilo gram</option>,
                    <option key="liter" value="liter">Liter</option>
                    ]
                  }
                />
              </td>
              <td>
                <InputField
                  name="quantity" 
                  value={item.quantity} 
                  onChange={this.handleChange.bind(this)}  
                  placeholder="0.00"
                  error={item.errors.message && item.errors.message.errors && item.errors.message.errors.quantity && item.errors.message.errors.quantity.message}
                  formClass="ui small input"
                />
              </td>
              <td>
                <InputField
                  name="price" 
                  value={item.price} 
                  onChange={this.handleChange.bind(this)} 
                  placeholder="0.00"
                  error={item.errors.message && item.errors.message.errors && item.errors.message.errors.price && item.errors.message.errors.price.message}
                  formClass="ui small input"
                />
              </td>
              <td>
                <InputField
                  name="vat" 
                  value={item.vat} 
                  onChange={this.handleChange.bind(this)} 
                  placeholder="0"
                  error={item.errors.message && item.errors.message.errors && item.errors.message.errors.vat && item.errors.message.errors.vat.message}
                  formClass="ui small input"
                />
              </td>
              <td width="110px" className="actions">
                <button disabled={item.isLoading} className="ui small icon basic turquoise button"><i className="add circle icon icon" aria-hidden="true"></i>&nbsp;{T.translate("sales.items.new.add_item")}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    )
  }
  
}

Item.propTypes = {
  createItem: React.PropTypes.func.isRequired,
  updateItem: React.PropTypes.func.isRequired,
  deleteItem: React.PropTypes.func.isRequired,
  addFlashMessage: React.PropTypes.func.isRequired
}

export default connect(null, { createItem, updateItem, deleteItem, addFlashMessage } )(Item)
