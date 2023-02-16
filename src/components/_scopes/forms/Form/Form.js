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

  const iterateOverChildren = (childrenArray) =>
    Children.map(childrenArray, (child) => {
      if (!isValidElement(child)) return child;

      const value = formData?.[child.props.name];
      const childProps = {
        ...child.props,
        onChange: handleInputChange,
        value,
        'aria-invalid': missing.includes(child.props.name) || false,
        ariaInvalid: missing.includes(child.props.name) || false,
      };
      if (requiredFields.includes(child.props.name)) {
        childProps.required = true;
      }

      if (child.props.children) {
        childProps.children = iterateOverChildren(child.props.children);
      }
      return cloneElement(child, childProps);
    });

  return (
    <form className={styles.form} onSubmit={handleSubmit} {...rest}>
      {title && <h1 className={styles.title}>{title}</h1>}
      <div className={styles.children}>{iterateOverChildren(children)}</div>
    </form>
  );
}
