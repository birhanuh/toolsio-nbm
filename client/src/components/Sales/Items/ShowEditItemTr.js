import React from 'react'
import { InputField, SelectField } from '../../../utils/FormFields'

// Localization 
import T from 'i18n-react'

export default function ShowEditItemTr({item, editItem, handleCreate, handleEdit, handleCancelEdit, handleUpdate, handleEditItemChange, showConfirmationModal}) {
  return (
    <tr key={item.id} id={item.id}>      
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
          formClass="ui small d-block input"
        />
      </td>
      <td className="edit-item">
        <SelectField
          name="unit"
          type="select"
          value={editItem.unit} 
          onChange={handleEditItemChange}  
          error={editItem.errors && editItem.errors.unit}
          formClass="ui small d-block input"
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
          formClass="ui small d-block input"
        />
      </td>
      <td className="edit-item">
        <InputField
          name="price" 
          value={editItem.price.toString()} 
          onChange={handleEditItemChange} 
          placeholder="0.00"
          error={editItem.errors && editItem.errors.price}
          formClass="ui small d-block input"
        />
      </td>
      <td className="edit-item">
        <InputField
          name="vat" 
          value={editItem.vat.toString()} 
          onChange={handleEditItemChange} 
          placeholder="0"
          error={editItem.errors && editItem.errors.vat}
          formClass="ui small d-block input"
        />
      </td>
      <td className="edit-item" width="120px">  
        <div className="edit-item ui fluid small buttons">
          <button className="ui basic icon button" onClick={handleCancelEdit}><i className="remove icon"></i></button>
          <button className="ui positive icon basic button" onClick={handleUpdate}><i className="check circle outline icon"></i></button>
        </div>
      </td>
    </tr>
  )  
}