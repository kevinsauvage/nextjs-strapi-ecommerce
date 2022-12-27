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
      const value = formData[child.props.name];
      const isInput = child.type.name === 'Input' || child.type === 'input';

      console.log('🚀 ~ file: Form.js:24 ~ Children.map ~ isInput', isInput);

      const isCheckbox = child.props.type === 'checkbox';

      const result = cloneElement(child, {
        ...child.props,
        onChange: isInput ? handleInputChange : null,
        value: isInput && initialValues ? value : null,
        children: iterateOverChildren(child.props.children),
        checked: isCheckbox ? formData[child.props.name] : null,
      });

      console.log('🚀 ~ file: Form.js:36 ~ Children.map ~ result', result);

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
