import { useCallback, useState } from 'react';

/**
 * It returns an object with a bunch of functions that help you manage form state
 * @param onSubmit - The function that will be called when the form is submitted.
 * @param [initialState] - The initial state of the form.
 * @returns An object with the following properties:
 * formData: The current state of the form.
 * handleInputChange: A function that updates the formData state.
 * handleSubmit: A function that calls the onSubmit callback with the formData state.
 * handleReset: A function that resets the formData state to the initialState.
 * setFormData: A function that sets the form
 */
const useForm = (onSubmit, initialState = {}) => {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { type, name, value } = e.target;

    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: !formData[name] });

      return;
    }

    setFormData({ ...formData, [name]: value });
    console.log(
      '🚀 ~ file: useForm.js:29 ~ handleInputChange ~ formData',
      formData
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit?.(formData);
    setLoading(false);
  };

  const handleReset = useCallback(
    () => setFormData(initialState),
    [initialState]
  );

  return {
    formData,
    handleInputChange,
    handleSubmit,
    handleReset,
    setFormData,
    loading,
  };
};

export default useForm;
