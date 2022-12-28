import { Children, cloneElement, isValidElement } from 'react';
import useForm from '@/hooks/useForm';
import styles from './Form.module.scss';

export default function Form({
  children,
  onSubmit,
  initialValues,
  title,
  buttonText,
  ...rest
}) {
  const { formData, handleInputChange, handleSubmit } = useForm(
    onSubmit,
    initialValues
  );

  const iterateOverChildren = (childrenArray) =>
    Children.map(childrenArray, (child) => {
      if (!isValidElement(child)) return child;
      const value = formData?.[child.props.name];

      let objectProps = {
        ...child.props,
        children: iterateOverChildren(child.props.children),
      };

      if (child.props.input) {
        objectProps = {
          ...child.props,
          onChange: handleInputChange,
          value: initialValues ? value : null,
          children: iterateOverChildren(child.props.children),
        };
      }

      if (child.props.checkbox) {
        objectProps = {
          ...child.props,
          onChange: handleInputChange,
          checked: value || null,
          children: iterateOverChildren(child.props.children),
        };
      }

      const result = cloneElement(child, objectProps);

      return result;
    });

  return (
    <form className={styles.form} onSubmit={handleSubmit || null} {...rest}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.border}>
        <div className={styles.children}>{iterateOverChildren(children)}</div>
      </div>
    </form>
  );
}
