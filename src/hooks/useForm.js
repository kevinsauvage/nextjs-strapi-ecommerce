import { useCallback, useEffect, useState } from 'react';

const useForm = (onSubmit, initialState) => {
  const [formData, setFormData] = useState(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(initialState);
  }, [initialState]);

  const handleInputChange = (e) => {
    const { type, name, value } = e.target;

    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: !formData[name] });

      return;
    }

    setFormData({ ...formData, [name]: value });
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
