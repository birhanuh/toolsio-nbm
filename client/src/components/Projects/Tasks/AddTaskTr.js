import React from 'react'
import { InputField, SelectField } from '../../../utils/FormFields'

// Localization 
import T from 'i18n-react'

export default function AddTaskTr({task, handleNewTaskChange, handleCreate}) {
  return (
    <tr>
      <td className="add-task">
        <InputField
          name="name" 
          value={task.name} 
          onChange={handleNewTaskChange}  
          placeholder="Name"
          error={task.errors && task.errors.name}
          formClass="ui small d-block input"
        />
      </td>
      <td className="add-task">
        <SelectField
          name="paymentType"
          type="select"
          value={task.paymentType} 
          onChange={handleNewTaskChange}  
          error={task.errors && task.errors.paymentType}
          formClass="ui small d-block input"
          options={[
            <option key="default" value="" disabled>{T.translate("projects.tasks.form.select_payment_type")}</option>,
            <option key="per hour" value="per hour">Per task</option>,
            <option key="per task" value="per task">Per hour</option>
            ]
          }
        />
      </td>
      <td className="add-task">
        <InputField
          name="hours" 
          value={task.hours} 
          onChange={handleNewTaskChange}  
          placeholder="0.00"
          error={task.errors && task.errors.hours}
          formClass="ui small d-block input"
        />
      </td>
      <td className="add-task">
        <InputField
          name="price" 
          value={task.price} 
          onChange={handleNewTaskChange} 
          placeholder="0.00"
          error={task.errors && task.errors.price}
          formClass="ui small d-block input"
        />
      </td>
      <td className="add-task">
        <InputField
          name="vat" 
          value={task.vat} 
          onChange={handleNewTaskChange} 
          placeholder="0"
          error={task.errors && task.errors.vat}
          formClass="ui small d-block input"
        />
      </td>
      <td className="add-task" width="120px">     
        <button disabled={task.isLoading} className="ui fluid small icon basic turquoise button" onClick={handleCreate}><i className="add circle icon icon" aria-hidden="true"></i>&nbsp;{T.translate("projects.tasks.form.add_task")}</button> 
      </td>
    </tr>
  )  
}

