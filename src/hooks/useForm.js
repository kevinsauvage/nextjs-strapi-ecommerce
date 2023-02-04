import { useCallback, useEffect, useState } from 'react';

const useForm = (onSubmit, initialState, requiredFields) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [missing, setMissing] = useState([]);

  useEffect(() => {
    if (initialState) setFormData(initialState);
  }, [initialState]);

  const handleInputChange = (e) => {
    setMissing([]);
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

    const missingItems = [];

    requiredFields.forEach((requiredField) => {
      if (!formData[requiredField]) missingItems.push(requiredField);
    });

    setMissing(missingItems);
    if (missingItems.length) return;

    await onSubmit?.(formData);
    setLoading(false);
  };

  const handleReset = useCallback(() => setFormData(initialState), [initialState]);

  return {
    formData,
    handleInputChange,
    handleSubmit,
    handleReset,
    setFormData,
    loading,
    missing,
  };
};

export default useForm;
