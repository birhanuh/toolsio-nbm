import React from 'react' 
import PropTypes from 'prop-types'
import classnames from 'classnames'

export const InputField = ({ type, name, value, id, label, 
  error, placeholder, onChange, checkUserExists, labelHorizontal, formClass}) => {
  return (
    <div className={classnames(formClass, { error: !!error })}>
      { label && <label htmlFor={name} className={classnames(labelHorizontal, {red: !!error})}>{label}</label> }
      <input 
        type={type}
        name={name} 
        value={value} 
        id={id}
        onChange={onChange} 
        onBlur={checkUserExists}
        placeholder={placeholder} 
      />
      <span className={classnames({red: !!error})}>{error}</span>
    </div>
  )
}  

export const TextAreaField = ({ name, value, id, label, error, 
  placeholder, onChange, checkUserExists, labelHorizontal, formClass}) => {  
  return (
    <div className={classnames(formClass, { error: !!error })}>
      { label && <label htmlFor={name} className={classnames(labelHorizontal, {red: !!error})}>{label}</label> }
      <textarea 
        name={name} 
        value={value} 
        id={id}
        onChange={onChange} 
        onBlur={checkUserExists}
        placeholder={placeholder}>
      </textarea>
      <span className={classnames({red: !!error})}>{error}</span>
    </div>
  )
} 

export const SelectField = ({ options, name, value, label, error, 
  onChange, labelHorizontal, formClass}) => {
  return (
    <div className={classnames(formClass, { error: !!error })}>
      { label && <label htmlFor={name} className={classnames(labelHorizontal, {red: !!error})}>{label}</label> }
      <select  
        className="ui selection dropdown"
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
  name: PropTypes.string.isRequired, 
  value: PropTypes.string.isRequired, 
  label: PropTypes.string, 
  error: PropTypes.string, 
  placeholder: PropTypes.string, 
  onChange: PropTypes.func.isRequired,
  checkUserExists: PropTypes.func
}

InputField.defaultProps = {
  type: 'text'
}

