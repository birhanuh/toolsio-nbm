import React from 'react'
// Semantic UI JS
import { Input, Select, Form } from 'semantic-ui-react'

// Localization 
import T from 'i18n-react'

export default function AddItemTr({item, handleNewItemChange, handleCreate}) {
  return (
    <tr>
      <td className="add-item">
        <Form.Field inline error={item.errors && item.errors.name}>
          <Input 
            placeholder={T.translate("sales.items.form.name")}
            name="name" 
            value={item.name} 
            onChange={(e, {value}) => handleNewItemChange('name', value)} 
            error={!!item.errors.name}
            className="ui small d-block input"
          />
          <span className="red">{item.errors && item.errors.name}</span>
        </Form.Field>
      </td>
      <td className="add-item">
        <Form.Field inline error={item.errors && item.errors.unit}>
          <Select
            placeholder={T.translate("sales.items.form.select_unit")}
            name="unit"
            value={item.unit} 
            onChange={(e, {value}) => handleNewItemChange('unit', value)} 
            error={!!item.errors.unit}
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
      <td className="add-item">
        <Form.Field inline error={item.errors && item.errors.quantity}>
          <Input 
            placeholder="0"
            name="quantity" 
            value={item.quantity} 
            onChange={(e, {value}) => handleNewItemChange('quantity', value)} 
            error={!!item.errors.quantity}
            className="ui small d-block input"
          />
          <span className="red">{item.errors && item.errors.quantity}</span>
        </Form.Field>
      </td>
      <td className="add-item">
        <Form.Field inline error={item.errors && item.errors.unitPrice}>
          <Input 
            placeholder="0.00"
            name="unitPrice" 
            value={item.unitPrice} 
            onChange={(e, {value}) => handleNewItemChange('unitPrice', value)} 
            error={!!item.errors.unitPrice}
            className="ui small d-block input"
          />
          <span className="red">{item.errors && item.errors.unitPrice}</span>
        </Form.Field>
      </td>
      <td className="add-item">
        <div className="field">
          <div className="ui input ui small d-block input">
            {item.total}
          </div>
        </div>
      </td>
      <td className="add-item" width="120px">     
        <button disabled={item.isLoading} className="ui fluid small icon basic turquoise button" onClick={handleCreate}><i className="add circle icon icon" aria-hidden="true"></i>&nbsp;{T.translate("sales.items.form.add_item")}</button> 
      </td>
    </tr>
  )  
}


