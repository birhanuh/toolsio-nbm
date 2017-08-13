import React from 'react'

import { InputField, SelectField } from '../../../utils/FormFields'

// Localization 
import T from 'i18n-react'

export const NewForm = ({task, handleChange}) => {

  return (
    <tr className="form-tr input">
      <td>
        <InputField
          name="name" 
          value={task.name} 
          onChange={handleChange.bind(this)}  
          placeholder="Name"
          error={task.errors.message && task.errors.message.errors && task.errors.message.errors.name && task.errors.message.errors.name.message}
          formClass="ui small input"
        />
      </td>
      <td>
        <SelectField
          name="paymentType"
          type="select"
          value={task.paymentType} 
          onChange={handleChange.bind(this)}  
          error={task.errors.message && task.errors.message.errors && task.errors.message.errors.paymentType && task.errors.message.errors.paymentType.message}
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
          value={task.hours} 
          onChange={handleChange.bind(this)}  
          placeholder="0.00"
          error={task.errors.message && task.errors.message.errors && task.errors.message.errors.hours && task.errors.message.errors.hours.message}
          formClass="ui small input"
        />
      </td>
      <td>
        <InputField
          name="price" 
          value={task.price} 
          onChange={handleChange.bind(this)} 
          placeholder="0.00"
          error={task.errors.message && task.errors.message.errors && task.errors.message.errors.price && task.errors.message.errors.price.message}
          formClass="ui small input"
        />
      </td>
      <td>
        <InputField
          name="vat" 
          value={task.vat} 
          onChange={handleChange.bind(this)} 
          placeholder="0"
          error={task.errors.message && task.errors.message.errors && task.errors.message.errors.vat && task.errors.message.errors.vat.message}
          formClass="ui small input"
        />
      </td>
      <td width="120px">
        <button disabled={task.isLoading} className="ui fluid small icon basic turquoise button"><i className="add circle icon icon" aria-hidden="true"></i>&nbsp;{T.translate("projects.tasks.new.add_task")}</button>
      </td>
    </tr>
  )  
}

export const EditForm = ({task, editTask, handleEdit, handleCancelEdit, handleDelete, handleUpdate, handleChange}) => {
  return(
    <tr key={task._id} id={task._id} className="form-tr">
      <td>
        <div className="show-item">{task.name}</div>
        <div className="edit-item">
          <InputField
            name="name" 
            value={editTask.name} 
            onChange={handleChange.bind(this)}  
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
            onChange={handleChange.bind(this)}  
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
            onChange={handleChange.bind(this)}  
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
            onChange={handleChange.bind(this)} 
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
            onChange={handleChange.bind(this)} 
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
