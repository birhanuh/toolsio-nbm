import React from 'react'
// Semantic UI JS
import { Input, Select, Form } from 'semantic-ui-react'

// Localization 
import T from 'i18n-react'

export default function AddTaskTr({task, handleNewTaskChange, handleCreate}) {
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
      <td className="add-task" width="120px">     
        <button disabled={task.isLoading} className="ui fluid small icon basic turquoise button" onClick={handleCreate}><i className="add circle icon icon" aria-hidden="true"></i>&nbsp;{T.translate("projects.tasks.form.add_task")}</button> 
      </td>
    </tr>
  )  
}

