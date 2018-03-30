import React from 'react'
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
          error={item.errors && item.errors.name}
          formClass="ui small input"
        />
      </td>
      <td className="add-item">
        <SelectField
          name="unit"
          type="select"
          value={item.unit} 
          onChange={handleNewItemChange}  
          error={item.errors && item.errors.unit}
          formClass="ui small input"
          options={[
            <option key="default" value="" disabled>{T.translate("sales.items.form.select_unit")}</option>,
            <option key="piece" value="piece">Piece</option>,
            <option key="meter" value="meter">Meter</option>,
            <option key="kilo gram" value="kilo gram">Kilo gram</option>,
            <option key="liter" value="liter">Liter</option>
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
          error={item.errors && item.errors.quantity}
          formClass="ui small input"
        />
      </td>
      <td className="add-item">
        <InputField
          name="price" 
          value={item.price} 
          onChange={handleNewItemChange} 
          placeholder="0.00"
          error={item.errors && item.errors.price}
          formClass="ui small input"
        />
      </td>
      <td className="add-item">
        <InputField
          name="vat" 
          value={item.vat} 
          onChange={handleNewItemChange} 
          placeholder="0"
          error={item.errors && item.errors.vat}
          formClass="ui small input"
        />
      </td>
      <td className="add-item" width="120px">     
        <button disabled={item.isLoading} className="ui fluid small icon basic turquoise button" onClick={handleCreate}><i className="add circle icon icon" aria-hidden="true"></i>&nbsp;{T.translate("sales.items.form.add_item")}</button> 
      </td>
    </tr>
  )  
}


export const ShowEditElement = ({item, editItem, handleCreate, handleEdit, handleCancelEdit, handleUpdate, handleEditItemChange, showConfirmationModal}) => {
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
          onChange={handleEditItemChange}  
          placeholder="Name"
          error={editItem.errors && editItem.errors.name}
          formClass="ui small input"
        />
      </td>
      <td className="edit-item">
        <SelectField
          name="unit"
          type="select"
          value={editItem.unit} 
          onChange={handleEditItemChange}  
          error={editItem.errors && editItem.errors.unit}
          formClass="ui small input"
          options={[
            <option key="default" value="" disabled>{T.translate("sales.items.form.select_unit")}</option>,
            <option key="piece" value="piece">Piece</option>,
            <option key="meter" value="meter">Meter</option>,
            <option key="kilo gram" value="kilo gram">Kilo gram</option>,
            <option key="liter" value="liter">Liter</option>
            ]
          }
        />
      </td>
      <td className="edit-item">
        <InputField
          name="quantity" 
          value={editItem.quantity.toString()} 
          onChange={handleEditItemChange}  
          placeholder="0.00"
          error={editItem.errors && editItem.errors.quantity}
          formClass="ui small input"
        />
      </td>
      <td className="edit-item">
        <InputField
          name="price" 
          value={editItem.price.toString()} 
          onChange={handleEditItemChange} 
          placeholder="0.00"
          error={editItem.errors && editItem.errors.price}
          formClass="ui small input"
        />
      </td>
      <td className="edit-item">
        <InputField
          name="vat" 
          value={editItem.vat.toString()} 
          onChange={handleEditItemChange} 
          placeholder="0"
          error={editItem.errors && editItem.errors.vat}
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