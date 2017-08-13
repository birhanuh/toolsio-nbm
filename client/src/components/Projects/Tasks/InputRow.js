import React from 'react'
import classnames from 'classnames'
import { InputField, SelectField } from '../../../utils/FormFields'

// Localization 
import T from 'i18n-react'

export const NewForm = ({newTask, handleNewTaskChange, handleCreate}) => {

  return (
    <tr className="form-tr input">
      <td>
        <InputField
          name="name" 
          value={newTask.name} 
          onChange={handleNewTaskChange.bind(this)}  
          placeholder="Name"
          error={newTask.errors.message && newTask.errors.message.errors && newTask.errors.message.errors.name && newTask.errors.message.errors.name.message}
          formClass="ui small input"
        />
      </td>
      <td>
        <SelectField
          name="paymentType"
          type="select"
          value={newTask.paymentType} 
          onChange={handleNewTaskChange.bind(this)}  
          error={newTask.errors.message && newTask.errors.message.errors && newTask.errors.message.errors.paymentType && newTask.errors.message.errors.paymentType.message}
          formClass="ui small input"
          options={[
            <option key="default" value="" disabled>{T.translate("projects.tasks.new.select_payment_type")}</option>,
            <option key="per hour" value="per hour">Per task</option>,
            <option key="per task" value="per task">Per hour</option>
            ]
          }
        />
      </td>
      <td>
        <InputField
          name="hours" 
          value={newTask.hours} 
          onChange={handleNewTaskChange.bind(this)}  
          placeholder="0.00"
          error={newTask.errors.message && newTask.errors.message.errors && newTask.errors.message.errors.hours && newTask.errors.message.errors.hours.message}
          formClass="ui small input"
        />
      </td>
      <td>
        <InputField
          name="price" 
          value={newTask.price} 
          onChange={handleNewTaskChange.bind(this)} 
          placeholder="0.00"
          error={newTask.errors.message && newTask.errors.message.errors && newTask.errors.message.errors.price && newTask.errors.message.errors.price.message}
          formClass="ui small input"
        />
      </td>
      <td>
        <InputField
          name="vat" 
          value={newTask.vat} 
          onChange={handleNewTaskChange.bind(this)} 
          placeholder="0"
          error={newTask.errors.message && newTask.errors.message.errors && newTask.errors.message.errors.vat && newTask.errors.message.errors.vat.message}
          formClass="ui small input"
        />
      </td>
      <td width="120px">
        <button disabled={newTask.isLoading} className="ui fluid small icon basic turquoise button" onClick={handleCreate}><i className="add circle icon icon" aria-hidden="true"></i>&nbsp;{T.translate("projects.tasks.new.add_task")}</button>
      </td>
    </tr>
  )  
}

export const EditForm = ({task, editTask, handleEdit, handleCancelEdit, handleDelete, handleUpdate, handleEditTaskChange}) => {
  return(
    <tr key={task._id} id={task._id} className={classnames("form-tr", {input: task._id === editTask._id})}>
      <td>
        <div className="show-item">{task.name}</div>
        <div className="edit-item">
          <InputField
            name="name" 
            value={editTask.name} 
            onChange={handleEditTaskChange.bind(this)}  
            placeholder="Name"
            error={editTask.errors.message && editTask.errors.message.errors && editTask.errors.message.errors.name && editTask.errors.message.errors.name.message}
            formClass="ui small input"
          />
        </div>
      </td>
      <td>
        <div className="show-item">{task.paymentType}</div>
        <div className="edit-item">
          <SelectField
            name="paymentType"
            type="select"
            value={editTask.paymentType} 
            onChange={handleEditTaskChange.bind(this)}  
            error={editTask.errors.message && editTask.errors.message.errors && editTask.errors.message.errors.paymentType && editTask.errors.message.errors.paymentType.message}
            formClass="ui small input"
            options={[
              <option key="default" value="" disabled>{T.translate("projects.tasks.new.select_payment_type")}</option>,
              <option key="per hour" value="per hour">Per task</option>,
              <option key="per task" value="per task">Per hour</option>
              ]
            }
          />
        </div>
      </td>
      <td>
        <div className="show-item">{task.hours}</div>
        <div className="edit-item">
          <InputField
            name="hours" 
            value={editTask.hours.toString()} 
            onChange={handleEditTaskChange.bind(this)}  
            placeholder="0.00"
            error={editTask.errors.message && editTask.errors.message.errors && editTask.errors.message.errors.hours && editTask.errors.message.errors.hours.message}
            formClass="ui small input"
          />  
        </div>          
      </td>
      <td>
        <div className="show-item">{task.price}</div>
        <div className="edit-item">
          <InputField
            name="price" 
            value={editTask.price.toString()} 
            onChange={handleEditTaskChange.bind(this)} 
            placeholder="0.00"
            error={editTask.errors.message && editTask.errors.message.errors && editTask.errors.message.errors.price && editTask.errors.message.errors.price.message}
            formClass="ui small input"
          />
        </div>
      </td>
      <td>
        <div className="show-item">{task.vat}</div>
        <div className="edit-item">
          <InputField
            name="vat" 
            value={editTask.vat.toString()} 
            onChange={handleEditTaskChange.bind(this)} 
            placeholder="0"
            error={editTask.errors.message && editTask.errors.message.errors && editTask.errors.message.errors.vat && editTask.errors.message.errors.vat.message}
            formClass="ui small input"
          />
        </div>
      </td>
      <td width="120px">
        <div className="show-item ui fluid small buttons">
          <button className="ui negative icon basic button" onClick={handleDelete}><i className="delete icon"></i></button>
          <button className="ui positive icon basic button" onClick={handleEdit}><i className="edit icon"></i></button>
        </div>

        <div className="edit-item ui fluid small buttons">
          <button className="ui basic icon button" onClick={handleCancelEdit}><i className="remove circle outline icon"></i></button>
          <button className="ui positive icon basic button" onClick={handleUpdate}><i className="check circle outline icon"></i></button>
        </div>
      </td>
    </tr>
  )
}
