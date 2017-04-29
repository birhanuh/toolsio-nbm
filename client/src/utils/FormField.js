import React from 'react' 
import classnames from 'classnames'

const FormField = ({ type, formType, options, name, field, value, label, error, placeholder, onChange, checkUserExists, labelHorizontal, inputHorizontal}) => {
  if (formType === 'textarea') {
    return (
      <div className={classnames("field", { 'ui error message': error })}>
        <label htmlFor={name} className={labelHorizontal}>{label}</label>
        <div className={inputHorizontal}>
          <textarea  
            type={type}
            name={name} 
            value={value} 
            onChange={onChange} 
            onBlur={checkUserExists}
            placeholder={placeholder}>
          </textarea>
        </div>
        { error && <span className="help-block">{error}</span>}
      </div>
    )
  } else if (formType === 'select') {
    return (
      <div className={classnames("field", { 'ui error message': error })}>
        <label htmlFor={name} className={labelHorizontal}>{label}</label>
        <div className={inputHorizontal}>
          <select  
            type={type}
            name={name} 
            value={value} 
            onChange={onChange}  
          >
            {options}
          </select>  
        </div>
        { error && <span className="help-block">{error}</span>}
      </div>
    )
  } else {
    return (
      <div className={classnames("field", { 'ui error message': error })}>
        <label htmlFor={name} className={labelHorizontal}>{label}</label>
        <div className={inputHorizontal}>
          <input 
            type={type}
            name={name} 
            value={value} 
            onChange={onChange} 
            onBlur={checkUserExists}
            placeholder={placeholder} 
          />
        </div>
        { error && <span className="help-block">{error}</span>}
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