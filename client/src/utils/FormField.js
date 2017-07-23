import React from 'react' 
import classnames from 'classnames'

const FormField = ({ type, formType, options, name, field, value, label, error, placeholder, onChange, checkUserExists, labelHorizontal, formClass}) => {
  if (formType === 'textarea') {
    return (
      <div className={classnames(formClass, { error: !!error })}>
        <label htmlFor={name} className={labelHorizontal}>{label}</label>
        <textarea  
          type={type}
          name={name} 
          value={value} 
          onChange={onChange} 
          onBlur={checkUserExists}
          placeholder={placeholder}>
        </textarea>
        <span>{error}</span>
      </div>
    )
  } else if (formType === 'select') {
    return (
      <div className={classnames(formClass, { error: !!error })}>
        <label htmlFor={name} className={labelHorizontal}>{label}</label>
        <select  
          className="ui dropdown"
          type={type}
          name={name} 
          value={value} 
          onChange={onChange}  
        >
          {options}
        </select>  
        <span>{error}</span>
      </div>
    )
  } else {
    return (
      <div className={classnames(formClass, { error: !!error })}>
        <label htmlFor={name} className={labelHorizontal}>{label}</label>
        <input 
          type={type}
          name={name} 
          value={value} 
          onChange={onChange} 
          onBlur={checkUserExists}
          placeholder={placeholder} 
        />
        <span>{error}</span>
      </div>
    )
  }  
}

FormField.propTypes = {  
  formType: React.PropTypes.string, 
  type: React.PropTypes.string.isRequired, 
  name: React.PropTypes.string.isRequired, 
  value: React.PropTypes.string.isRequired, 
  label: React.PropTypes.string.isRequired, 
  error: React.PropTypes.string, 
  placeholder: React.PropTypes.string, 
  onChange: React.PropTypes.func.isRequired,
  checkUserExists: React.PropTypes.func
}

FormField.defaultProps = {
  type: 'text'
}

export default FormField