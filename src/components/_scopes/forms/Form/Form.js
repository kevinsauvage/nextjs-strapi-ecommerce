import { Children, cloneElement, isValidElement } from 'react';

import useForm from '@/hooks/useForm';

import styles from './Form.module.scss';

const Form = ({
  children,
  onSubmit,
  initialValues,
  title,
  extraClass = '',
  requiredFields = [],
  ...rest
}) => {
  const {
    formData,
    handleInputChange,
    handleSubmit,
    missing = [],
  } = useForm(onSubmit, initialValues, requiredFields);

  const iterateOverChildren = (childrenArray) =>
    Children.map(childrenArray, (child) => {
      if (!isValidElement(child)) return child;

      const value = formData?.[child.props.name];
      const childProperties = {
        ...child.props,
        onChange: handleInputChange,
        value,
        'aria-invalid': missing.includes(child.props.name) || false,
        invalid: missing.includes(child.props.name) ? true : '',
      };

      if (child.props.type === 'checkbox') {
        childProperties.checked = !!value;
      }
      if (requiredFields.includes(child.props.name)) {
        childProperties.required = true;
      }

      if (child.props.children) {
        childProperties.children = iterateOverChildren(child.props.children);
      }
      return cloneElement(child, childProperties);
    });

  return (
    <form className={`${styles.form} ${extraClass}`} onSubmit={handleSubmit} {...rest}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.children}>{iterateOverChildren(children)}</div>
    </form>
  );
};

export default Form;
