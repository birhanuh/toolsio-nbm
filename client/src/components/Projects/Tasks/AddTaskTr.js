import React from 'react'
// Semantic UI JS
import { Input, Select, Form, Button, Icon } from 'semantic-ui-react'

// Localization 
import T from 'i18n-react'

export default function AddTaskTr({task, handleNewTaskChange, handleNewTaskBlur, handleCreate}) {
  return (
    <tr>
      <td className="add-task">
       <Form.Field>
          <Input 
            placeholder={T.translate("projects.tasks.form.name")}
            name="name" 
            value={task.name} 
            onChange={(e, {value}) => handleNewTaskChange('name', value)} 
            error={!!task.errors.name}
            className="ui small d-block input"
          />
          <span className="red">{task.errors && task.errors.name}</span>
        </Form.Field>
      </td>
      <td className="add-task">
        <Form.Field>
          <Select 
            placeholder={T.translate("projects.tasks.form.select_payment_type")}
            name="paymentType"
            value={task.paymentType} 
            onChange={(e, {value}) => handleNewTaskChange('paymentType', value)} 
            error={!!task.errors.paymentType}
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
      <td className="add-task">
        <Form.Field>
          <Input 
            placeholder={T.translate("projects.tasks.form.hours_placeholder")} 
            name="hours" 
            value={task.hours} 
            onChange={(e, {value}) => handleNewTaskChange('hours', value)}
            onBlur={handleNewTaskBlur}  
            error={!!task.errors.hours}
            className="ui small d-block input"
          />
          <span className="red">{task.errors && task.errors.hours}</span>
        </Form.Field>
      </td>
      <td className="add-task">
        <Form.Field>
          <Input 
            placeholder="0.00"
            name="unitPrice" 
            value={task.unitPrice} 
            onChange={(e, {value}) => handleNewTaskChange('unitPrice', value)}
            onBlur={handleNewTaskBlur}  
            error={!!task.errors.unitPrice}
            className="ui small d-block input"
          />
          <span className="red">{task.errors && task.errors.unitPrice}</span>
        </Form.Field>
      </td>
      <td className="add-task">
        <div className="p-2">
          {task.total}
        </div>
      </td>
      <td className="add-task" width="125px">     
        <Button basic size="small" fluid disabled={task.isLoading} className="turquoise" onClick={handleCreate}><Icon name="add circle" />&nbsp;{T.translate("projects.tasks.form.add_task")}</Button> 
      </td>
    </tr>
  )  
}

