import { useCallback, useState } from 'react';

const useForm = (onSubmit, initialValues = {}, requiredFields = []) => {
  const [loading, setLoading] = useState(false);
  const [missing, setMissing] = useState([]);

  const [formData, setFormData] = useState(() => {
    const initialFormData = {};
    Object.keys(initialValues).forEach((key) => {
      initialFormData[key] = initialValues[key] || '';
    });
    return initialFormData;
  });

  const handleInputChange = useCallback((event) => {
    setMissing([]);
    const { type, name, value, checked } = event.target;
    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setLoading(true);
      const missingItems = requiredFields.filter((field) => !formData[field]);
      setMissing(missingItems);
      if (missingItems.length === 0) await onSubmit?.(formData);
      setLoading(false);
    },
    [formData, onSubmit, requiredFields]
  );

  const handleReset = useCallback(() => setFormData(initialValues || {}), [initialValues]);

  return {
    formData,
    handleInputChange,
    handleReset,
    handleSubmit,
    loading,
    missing,
    setFormData,
  };
};

export default useForm;
