import React from 'react'
// Semantic UI JS
import { Input, Select, Form, Button, Icon } from 'semantic-ui-react'

import GetCurrencySymbol from '../../../utils/currency'

// Localization 
import T from 'i18n-react'

export default function ShowEditItemTr({item, editItem, handleEdit, handleCancelEdit, handleUpdate, handleEditItemChange, handleEditItemBlur, toggleConfirmationModal}) {
  return (
    <tr key={item.id} id={item.id}>      
      <td className="show-item">{item.name}</td>
      <td className="show-item">{item.unit}</td>
      <td className="show-item">{item.quantity}</td>
      <td className="show-item">{item.unitPrice}</td>
      <td className="show-item"><GetCurrencySymbol />{item.total}</td>
      <td className="show-item" width="125px">
        <Button.Group fluid size="small" className="show-item">
          <Button basic negative onClick={toggleConfirmationModal}><Icon name="delete" /></Button>
          <Button basic positive onClick={handleEdit}><Icon name="edit" /></Button>
        </Button.Group>
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
            onBlur={handleEditItemBlur}   
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
            onBlur={handleEditItemBlur}   
            error={!!editItem.errors.unitPrice}
            className="ui small d-block input"
          />
          <span className="red">{item.errors && item.errors.unitPrice}</span>
        </Form.Field>
      </td>
      <td className="edit-item">
        <div className="p-2">
          <GetCurrencySymbol />{editItem.total}
        </div>
      </td>
      <td className="edit-item" width="125px">  
        <Button.Group size="small" fluid className="edit-item">
          <Button basic onClick={handleCancelEdit}><Icon name="remove" /></Button>
          <Button basic positive onClick={handleUpdate}><Icon name="check circle outline" /></Button>
        </Button.Group>
      </td>
    </tr>
  )  
}