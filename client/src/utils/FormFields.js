import React from 'react' 
import classnames from 'classnames'

export const InputField = ({ type, options, name, field, value, label, 
  error, placeholder, onChange, checkUserExists, labelHorizontal, formClass}) => {
  return (
    <div className={classnames(formClass, { error: !!error })}>
      <label htmlFor={name} className={classnames(labelHorizontal, {red: !!error})}>{label}</label>
      <input 
        type={type}
        name={name} 
        value={value} 
        onChange={onChange} 
        onBlur={checkUserExists}
        placeholder={placeholder} 
      />
      <span className={classnames({red: !!error})}>{error}</span>
    </div>
  )
}  

export const TextAreaField = ({ options, name, field, value, label, error, 
  placeholder, onChange, checkUserExists, labelHorizontal, formClass}) => {  
  return (
    <div className={classnames(formClass, { error: !!error })}>
      <label htmlFor={name} className={classnames(labelHorizontal, {red: !!error})}>{label}</label>
      <textarea  
        name={name} 
        value={value} 
        onChange={onChange} 
        onBlur={checkUserExists}
        placeholder={placeholder}>
      </textarea>
      <span className={classnames({red: !!error})}>{error}</span>
    </div>
  )
} 

export const SelectField = ({ options, name, field, value, label, error, 
  placeholder, onChange, checkUserExists, labelHorizontal, formClass}) => {
  return (
    <div className={classnames(formClass, { error: !!error })}>
      <label htmlFor={name} className={classnames(labelHorizontal, {red: !!error})}>{label}</label>
      <select  
        className="ui dropdown"
        name={name} 
        value={value} 
        onChange={onChange}  
      >
        {options}
      </select>  
      <span className={classnames({red: !!error})}>{error}</span>
    </div>
  )
}  

InputField.propTypes = TextAreaField.propTypes = SelectField.propTypes = {  
  name: React.PropTypes.string.isRequired, 
  value: React.PropTypes.string.isRequired, 
  label: React.PropTypes.string, 
  error: React.PropTypes.string, 
  placeholder: React.PropTypes.string, 
  onChange: React.PropTypes.func.isRequired,
  checkUserExists: React.PropTypes.func
}

InputField.defaultProps = {
  type: 'text'
}

