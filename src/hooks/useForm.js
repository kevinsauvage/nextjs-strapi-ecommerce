import { useCallback, useState } from 'react';

const useForm = (onSubmit, initialValues = {}, requiredFields) => {
  const [loading, setLoading] = useState(false);
  const [missing, setMissing] = useState([]);

  const [formData, setFormData] = useState(() => {
    const initialFormData = {};
    Object.keys(initialValues).forEach((key) => {
      initialFormData[key] = initialValues[key] || '';
    });
    return initialFormData;
  });

  const handleInputChange = useCallback((e) => {
    setMissing([]);
    const { type, name, value, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      const missingItems = requiredFields.filter((field) => !formData[field]);
      setMissing(missingItems);

      if (missingItems.length === 0) {
        await onSubmit?.(formData);
      }

      setLoading(false);
    },
    [formData, onSubmit, requiredFields]
  );

  const handleReset = useCallback(() => setFormData(initialValues || {}), [initialValues]);

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
