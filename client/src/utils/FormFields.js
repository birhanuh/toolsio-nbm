import React from 'react' 
import PropTypes from 'prop-types'
import classnames from 'classnames'

export const InputField = ({ type, name, value, id, label, 
  error, placeholder, onChange, onBlur, labelHorizontal, formClass, disabled}) => {
  return (
    <div className={classnames(formClass, { error: !!error })}>
      { label && <label htmlFor={name} className={classnames(labelHorizontal, {red: !!error})}>{label}</label> }
      <input 
        type={type}
        name={name} 
        value={value} 
        id={id}
        onChange={onChange} 
        onBlur={onBlur}
        placeholder={placeholder} 
        disabled={disabled}
      />
      <span className={classnames({red: !!error})}>{error}</span>
    </div>
  )
}  

export const TextAreaField = ({ name, value, id, label, error, 
  placeholder, onChange, onKeyDown, labelHorizontal, formClass, rows}) => {  
  return (
    <div className={classnames(formClass, { error: !!error })}>
      { label && <label htmlFor={name} className={classnames(labelHorizontal, {red: !!error})}>{label}</label> }
      <textarea 
        name={name} 
        value={value} 
        id={id}
        onChange={onChange} 
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        tabIndex="0"
        rows={rows}
      />
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
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]), 
  label: PropTypes.string, 
  error: PropTypes.string, 
  placeholder: PropTypes.string, 
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func
}

InputField.defaultProps = {
  type: 'text'
}

