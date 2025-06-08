import { blogCategory, profileTitle } from '../../utils/constant/selectValues';

const InputComponent = ({
  label,
  type = 'text',
  name,
  id,
  value,
  onChange,
  error,
  required,
  ...rest
}) => {
  const renderLabel = () =>
    label && (
      <label htmlFor={name}>
        {label}
        {required && <span className='label-required'>*</span>}
      </label>
    );

  if (type === 'textarea') {
    return (
      <div className='form-group'>
        {renderLabel()}
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          aria-invalid={!!error}
          {...rest}
        />
        {error && <span className='error-message'>{error}</span>}
      </div>
    );
  }

  if (type === 'select') {
    let options = [];
    if (id === 'title') options = profileTitle;
    if (id === 'category') options = blogCategory;

    return (
      <div className='form-group'>
        {renderLabel()}
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          aria-invalid={!!error}
          {...rest}
        >
          <option value=''>Select {label}</option>
          {options.map((opt, idx) => (
            <option value={opt} key={idx}>
              {opt}
            </option>
          ))}
        </select>
        {error && <span className='error-message'>{error}</span>}
      </div>
    );
  }

  if (type === 'file') {
    return (
      <div className='form-group'>
        {renderLabel()}
        <input
          type='file'
          id={id}
          name={name}
          onChange={onChange}
          aria-invalid={!!error}
          {...rest}
        />
        {error && <span className='error-message'>{error}</span>}
      </div>
    );
  }

  return (
    <div className='form-group'>
      {renderLabel()}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        {...rest}
      />
      {error && <span className='error-message'>{error}</span>}
    </div>
  );
};

export default InputComponent;
