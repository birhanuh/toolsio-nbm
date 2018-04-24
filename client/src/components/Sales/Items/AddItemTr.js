import React from 'react'
import { InputField, SelectField } from '../../../utils/FormFields'

// Localization 
import T from 'i18n-react'

export default function AddItemTr({item, handleNewItemChange, handleCreate}) {
  return (
    <tr>
      <td className="add-item">
        <InputField
          name="name" 
          value={item.name} 
          onChange={handleNewItemChange}  
          placeholder="Name"
          error={item.errors && item.errors.name}
          formClass="ui small d-block input"
        />
      </td>
      <td className="add-item">
        <SelectField
          name="unit"
          type="select"
          value={item.unit} 
          onChange={handleNewItemChange}  
          error={item.errors && item.errors.unit}
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
      <td className="add-item">
        <InputField
          name="quantity" 
          value={item.quantity} 
          onChange={handleNewItemChange}  
          placeholder="0"
          error={item.errors && item.errors.quantity}
          formClass="ui small d-block input"
        />
      </td>
      <td className="add-item">
        <InputField
          name="price" 
          value={item.price} 
          onChange={handleNewItemChange} 
          placeholder="0.00"
          error={item.errors && item.errors.price}
          formClass="ui small d-block input"
        />
      </td>
      <td className="add-item">
        <InputField
          name="vat" 
          value={item.vat} 
          onChange={handleNewItemChange} 
          placeholder="0"
          error={item.errors && item.errors.vat}
          formClass="ui small d-block input"
        />
      </td>
      <td className="add-item" width="120px">     
        <button disabled={item.isLoading} className="ui fluid small icon basic turquoise button" onClick={handleCreate}><i className="add circle icon icon" aria-hidden="true"></i>&nbsp;{T.translate("sales.items.form.add_item")}</button> 
      </td>
    </tr>
  )  
}


