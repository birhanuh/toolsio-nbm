import React from 'react'
// Semantic UI JS
import { Input, Select, Form } from 'semantic-ui-react'

// Localization 
import T from 'i18n-react'

export default function ShowEditItemTr({item, editItem, handleEdit, handleCancelEdit, handleUpdate, handleEditItemChange, showConfirmationModal}) {
  return (
    <tr key={item.id} id={item.id}>      
      <td className="show-item">{item.name}</td>
      <td className="show-item">{item.unit}</td>
      <td className="show-item">{item.quantity}</td>
      <td className="show-item">{item.unitPrice}</td>
      <td className="show-item">{item.total}</td>
      <td className="show-item" width="120px">
        <div className="show-item ui fluid small buttons">
          <button className="ui negative icon basic button" onClick={showConfirmationModal}><i className="delete icon"></i></button>
          <button className="ui positive icon basic button" onClick={handleEdit}><i className="edit icon"></i></button>
        </div>
      </td>
      <td className="edit-item">
        <Form.Field>
          <Input 
            placeholder={T.translate("sales.items.form.name")}
            name="name" 
            value={editItem.name} 
            onChange={(e, {value}) => handleEditItemChange('name', value, item)} 
            error={!!editItem.errors.name}
            className="ui small d-block input"
          />
          <span className="red">{item.errors && item.errors.name}</span>
        </Form.Field>
      </td>
      <td className="edit-item">
        <Form.Field>
          <Select
            placeholder={T.translate("sales.items.form.select_unit")}
            name="unit"
            value={editItem.unit} 
            onChange={(e, {value}) => handleEditItemChange('unit', value, item)} 
            error={!!editItem.errors.unit}
            options={[
              { key: "piece", value: "piece", text: 'Piece' },
              { key: "meter", value: "meter", text: 'Meter' },
              { key: "kilo", value: "kilo", text: 'Kilo gram' },
              { key: "liter", value: "liter", text: 'Liter' }
            ]}
            selection
            className="ui small d-block input"
          />
          <span className="red">{item.errors && item.errors.unit}</span>
        </Form.Field>
      </td>
      <td className="edit-item">
        <Form.Field>
          <Input 
            placeholder="0"
            name="quantity" 
            value={editItem.quantity} 
            onChange={(e, {value}) => handleEditItemChange('quantity', value, item)} 
            error={!!editItem.errors.quantity}
            className="ui small d-block input"
          />
          <span className="red">{item.errors && item.errors.quantity}</span>
        </Form.Field>
      </td>
      <td className="edit-item">
        <Form.Field>
          <Input 
            placeholder="0.00"
            name="unitPrice" 
            value={editItem.unitPrice} 
            onChange={(e, {value}) => handleEditItemChange('unitPrice', value, item)} 
            error={!!editItem.errors.unitPrice}
            className="ui small d-block input"
          />
          <span className="red">{item.errors && item.errors.unitPrice}</span>
        </Form.Field>
      </td>
      <td className="edit-item">
        <div className="p-2">
          {item.total}
        </div>
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