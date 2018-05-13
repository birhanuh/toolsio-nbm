import React from 'react'
// Semantic UI JS
import { Input, Select, Form } from 'semantic-ui-react'

// Localization 
import T from 'i18n-react'

export default function ShowEditTaskTr({task, editTask, handleEdit, handleCancelEdit, handleUpdate, handleEditTaskChange, showConfirmationModal}) {
  return (
    <tr key={task.id} id={task.id}>      
      <td className="show-task">{task.name}</td>
      <td className="show-task">{task.paymentType}</td>
      <td className="show-task">{task.hours}</td>
      <td className="show-task">{task.unitPrice}</td>
      <td className="show-task">{task.total}</td>
      <td className="show-task" width="120px">
        <div className="show-task ui fluid small buttons">
          <button className="ui negative icon basic button" onClick={showConfirmationModal}><i className="delete icon"></i></button>
          <button className="ui positive icon basic button" onClick={handleEdit}><i className="edit icon"></i></button>
        </div>
      </td>
      <td className="edit-task">
        <Form.Field>
          <Input 
            placeholder={T.translate("projects.form.name")}
            name="name" 
            value={editTask.name} 
            onChange={(e, {value}) => handleEditTaskChange('name', value, task)} 
            error={!!editTask.errors.name}
            className="ui small d-block input"
          />
          <span className="red">{task.errors && task.errors.name}</span>
        </Form.Field>
      </td>
      <td className="edit-task">
        <Form.Field>
          <Select 
            placeholder={T.translate("projects.tasks.form.select_payment_type")}
            name="paymentType"
            value={editTask.paymentType} 
            onChange={(e, {value}) => handleEditTaskChange('paymentType', value, task)} 
            error={!!editTask.errors.paymentType}
            options={[
              { key: "per hour", value: "per hour", text: 'Per hour' },
              { key: "per task", value: "per task", text: 'Per task' }
            ]}
            selection
            className="ui small d-block input"
          />
          <span className="red">{task.errors && task.errors.paymentType}</span>
        </Form.Field>
      </td>
      <td className="edit-task">
        <Form.Field>
          <Input 
            placeholder="0.00"
            name="hours" 
            value={editTask.hours} 
            onChange={(e, {value}) => handleEditTaskChange('hours', value, task)} 
            error={!!editTask.errors.hours}
            className="ui small d-block input"
          />
          <span className="red">{task.errors && task.errors.hours}</span>
        </Form.Field>
      </td>
      <td className="edit-task">
        <Form.Field>
          <Input 
            placeholder="0.00"
            name="unitPrice" 
            value={editTask.unitPrice} 
            onChange={(e, {value}) => handleEditTaskChange('unitPrice', value, task)} 
            error={!!editTask.errors.unitPrice}
            className="ui small d-block input"
          />
          <span className="red">{task.errors && task.errors.unitPrice}</span>
        </Form.Field>
      </td>
      <td className="edit-task">
        <div className="p-2">
          {task.total}
        </div>
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