import { Children, cloneElement, isValidElement } from 'react';
import useForm from '@/hooks/useForm';
import styles from './Form.module.scss';

export default function Form({
  children,
  onSubmit,
  initialValues,
  title,
  buttonText,
  requiredFields = [],
  ...rest
}) {
  const {
    formData,
    handleInputChange,
    handleSubmit,
    missing = [],
  } = useForm(onSubmit, initialValues, requiredFields);

  const renderChild = (child) => {
    if (!isValidElement(child)) {
      return child;
    }

    const { name, type } = child.props;
    const value = formData[name];
    const isRequired = requiredFields.includes(name);

    const inputProps = {
      ...child.props,
      onChange: handleInputChange,
      value: value ?? '',
      required: isRequired,
      'aria-invalid': missing.includes(child.props.name) || false,
      ariaInvalid: missing.includes(child.props.name) || false,
    };

    if (type === 'checkbox') {
      inputProps.checked = !!value;
    }

    return cloneElement(child, inputProps);
  };

  const renderChildren = (el) => Children.map(el, (child) => renderChild(child));

  return (
    <form className={styles.form} onSubmit={handleSubmit} {...rest}>
      {title && <h1 className={styles.title}>{title}</h1>}
      <div className={styles.children}>{renderChildren(children)}</div>
    </form>
  );
}
