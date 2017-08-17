import React from 'react'
import classnames from 'classnames'
import { InputField, SelectField } from '../../../utils/FormFields'

// Localization 
import T from 'i18n-react'

export const AddElement = ({item, handleNewItemChange, handleCreate}) => {
  return (
    <tr>
      <td className="add-item">
        <InputField
          name="name" 
          value={item.name} 
          onChange={handleNewItemChange}  
          placeholder="Name"
          error={item.errors.message && item.errors.message.errors && item.errors.message.errors.name && item.errors.message.errors.name.message}
          formClass="ui small input"
        />
      </td>
      <td className="add-item">
        <SelectField
          name="unit"
          type="select"
          value={item.unit} 
          onChange={handleNewItemChange}  
          error={item.errors.message && item.errors.message.errors && item.errors.message.errors.unit && item.errors.message.errors.unit.message}
          formClass="ui small input"
          options={[
            <option key="default" value="" disabled>{T.translate("sales.items.form.select_unit")}</option>,
            <option key="per hour" value="per hour">Per item</option>,
            <option key="per item" value="per item">Per hour</option>
            ]
          }
        />
      </td>
      <td className="add-item">
        <InputField
          name="quantity" 
          value={item.quantity} 
          onChange={handleNewItemChange}  
          placeholder="0.00"
          error={item.errors.message && item.errors.message.errors && item.errors.message.errors.quantity && item.errors.message.errors.quantity.message}
          formClass="ui small input"
        />
      </td>
      <td className="add-item">
        <InputField
          name="price" 
          value={item.price} 
          onChange={handleNewItemChange} 
          placeholder="0.00"
          error={item.errors.message && item.errors.message.errors && item.errors.message.errors.price && item.errors.message.errors.price.message}
          formClass="ui small input"
        />
      </td>
      <td className="add-item">
        <InputField
          name="vat" 
          value={item.vat} 
          onChange={handleNewItemChange} 
          placeholder="0"
          error={item.errors.message && item.errors.message.errors && item.errors.message.errors.vat && item.errors.message.errors.vat.message}
          formClass="ui small input"
        />
      </td>
      <td className="add-item" width="120px">     
        <button disabled={item.isLoading} className="ui fluid small icon basic turquoise button" onClick={handleCreate}><i className="add circle icon icon" aria-hidden="true"></i>&nbsp;{T.translate("sales.items.form.add_item")}</button> 
      </td>
    </tr>
  )  
}


export const ShowEditElement = ({item, editItem, handleNewItemChange, handleCreate, handleEdit, handleCancelEdit, handleUpdate, handleEditItemChange, showConfirmationModal}) => {
  return (
    <tr key={item._id} id={item._id}>      
      <td className="show-item">{item.name}</td>
      <td className="show-item">{item.unit}</td>
      <td className="show-item">{item.quantity}</td>
      <td className="show-item">{item.price}</td>
      <td className="show-item">{item.vat}</td>
      <td className="show-item" width="120px">
        <div className="show-item ui fluid small buttons">
          <button className="ui negative icon basic button" onClick={showConfirmationModal}><i className="delete icon"></i></button>
          <button className="ui positive icon basic button" onClick={handleEdit}><i className="edit icon"></i></button>
        </div>
      </td>
      <td className="edit-item">
        <InputField
          name="name" 
          value={editItem.name} 
          onChange={handleNewItemChange}  
          placeholder="Name"
          error={editItem.errors.message && editItem.errors.message.errors && editItem.errors.message.errors.name && editItem.errors.message.errors.name.message}
          formClass="ui small input"
        />
      </td>
      <td className="edit-item">
        <SelectField
          name="unit"
          type="select"
          value={editItem.unit} 
          onChange={handleNewItemChange}  
          error={editItem.errors.message && editItem.errors.message.errors && editItem.errors.message.errors.unit && editItem.errors.message.errors.unit.message}
          formClass="ui small input"
          options={[
            <option key="default" value="" disabled>{T.translate("sales.items.form.select_unit")}</option>,
            <option key="per hour" value="per hour">Per item</option>,
            <option key="per item" value="per item">Per hour</option>
            ]
          }
        />
      </td>
      <td className="edit-item">
        <InputField
          name="quantity" 
          value={editItem.quantity.toString()} 
          onChange={handleNewItemChange}  
          placeholder="0.00"
          error={editItem.errors.message && editItem.errors.message.errors && editItem.errors.message.errors.quantity && editItem.errors.message.errors.quantity.message}
          formClass="ui small input"
        />
      </td>
      <td className="edit-item">
        <InputField
          name="price" 
          value={editItem.price.toString()} 
          onChange={handleNewItemChange} 
          placeholder="0.00"
          error={editItem.errors.message && editItem.errors.message.errors && editItem.errors.message.errors.price && editItem.errors.message.errors.price.message}
          formClass="ui small input"
        />
      </td>
      <td className="edit-item">
        <InputField
          name="vat" 
          value={editItem.vat.toString()} 
          onChange={handleNewItemChange} 
          placeholder="0"
          error={editItem.errors.message && editItem.errors.message.errors && editItem.errors.message.errors.vat && editItem.errors.message.errors.vat.message}
          formClass="ui small input"
        />
      </td>
      <td className="edit-item" width="120px">  
        <div className="edit-item ui fluid small buttons">
          <button className="ui basic icon button" onClick={handleCancelEdit}><i className="remove circle outline icon"></i></button>
          <button className="ui positive icon basic button" onClick={handleUpdate}><i className="check circle outline icon"></i></button>
        </div>
      </td>
    </tr>
  )  
}