import React from 'react'
// Semantic UI JS
import { Input, Select, Form, Button, Icon } from 'semantic-ui-react'

// Localization 
import T from 'i18n-react'

export default function ShowEditTaskTr({task, editTask, handleEdit, handleCancelEdit, handleUpdate, handleEditTaskChange, handleEditTaskBlur, toggleConfirmationModal}) {
  return (
    <tr key={task.id} id={task.id}>      
      <td className="show-task">{task.name}</td>
      <td className="show-task">{task.paymentType}</td>
      <td className="show-task">{task.hours}</td>
      <td className="show-task">{task.unitPrice}</td>
      <td className="show-task">{task.total}</td>
      <td className="show-task" width="125px">
        <Button.Group fluid size="small" className="show-task">
          <Button basic negative onClick={toggleConfirmationModal}><Icon name="delete" /></Button>
          <Button basic positive onClick={handleEdit}><Icon name="edit" /></Button>
        </Button.Group>
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
            placeholder={T.translate("projects.tasks.form.hours_placeholder")} 
            name="hours" 
            value={editTask.hours} 
            onChange={(e, {value}) => handleEditTaskChange('hours', value, task)} 
            onBlur={handleEditTaskBlur}  
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
            onBlur={handleEditTaskBlur}  
            error={!!editTask.errors.unitPrice}
            className="ui small d-block input"
          />
          <span className="red">{task.errors && task.errors.unitPrice}</span>
        </Form.Field>
      </td>
      <td className="edit-task">
        <div className="p-2">
          {editTask.total}
        </div>
      </td>
      <td className="edit-task" width="120px">  
        <Button.Group size="small" fluid className="edit-task">
          <Button basic onClick={handleCancelEdit}><Icon name="remove" /></Button>
          <Button basic positive onClick={handleUpdate}><Icon name="check circle outline" /></Button>
        </Button.Group>
      </td>
    </tr>
  )  
}