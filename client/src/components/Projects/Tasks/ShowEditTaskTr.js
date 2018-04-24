import React from 'react'
import { InputField, SelectField } from '../../../utils/FormFields'

// Localization 
import T from 'i18n-react'

export default function ShowEditTaskTr({task, editTask, handleCreate, handleEdit, handleCancelEdit, handleUpdate, handleEditTaskChange, showConfirmationModal}) {
  return (
    <tr key={task.id} id={task.id}>      
      <td className="show-task">{task.name}</td>
      <td className="show-task">{task.paymentType}</td>
      <td className="show-task">{task.hours}</td>
      <td className="show-task">{task.price}</td>
      <td className="show-task">{task.vat}</td>
      <td className="show-task" width="120px">
        <div className="show-task ui fluid small buttons">
          <button className="ui negative icon basic button" onClick={showConfirmationModal}><i className="delete icon"></i></button>
          <button className="ui positive icon basic button" onClick={handleEdit}><i className="edit icon"></i></button>
        </div>
      </td>
      <td className="edit-task">
        <InputField
          name="name" 
          value={editTask.name} 
          onChange={handleEditTaskChange}  
          placeholder="Name"
          error={editTask.errors.message && editTask.errors.name}
          formClass="ui small d-block input"
        />
      </td>
      <td className="edit-task">
        <SelectField
          name="paymentType"
          type="select"
          value={editTask.paymentType} 
          onChange={handleEditTaskChange}  
          error={editTask.errors && editTask.errors.paymentType}
          formClass="ui small d-block input"
          options={[
            <option key="default" value="" disabled>{T.translate("projects.tasks.form.select_payment_type")}</option>,
            <option key="per hour" value="per hour">Per task</option>,
            <option key="per task" value="per task">Per hour</option>
            ]
          }
        />
      </td>
      <td className="edit-task">
        <InputField
          name="hours" 
          value={editTask.hours.toString()} 
          onChange={handleEditTaskChange}  
          placeholder="0.00"
          error={editTask.errors && editTask.errors.hours}
          formClass="ui small d-block input"
        />
      </td>
      <td className="edit-task">
        <InputField
          name="price" 
          value={editTask.price.toString()} 
          onChange={handleEditTaskChange} 
          placeholder="0.00"
          error={editTask.errors && editTask.errors.price}
          formClass="ui small d-block input"
        />
      </td>
      <td className="edit-task">
        <InputField
          name="vat" 
          value={editTask.vat.toString()} 
          onChange={handleEditTaskChange} 
          placeholder="0"
          error={editTask.errors && editTask.errors.vat}
          formClass="ui small d-block input"
        />
      </td>
      <td className="edit-task" width="120px">  
        <div className="edit-item ui fluid small buttons">
          <button className="ui basic icon button" onClick={handleCancelEdit}><i className="remove icon"></i></button>
          <button className="ui positive icon basic button" onClick={handleUpdate}><i className="check circle outline icon"></i></button>
        </div>
      </td>
    </tr>
  )  
}