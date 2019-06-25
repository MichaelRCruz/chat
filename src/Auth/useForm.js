import React, { useState, useEffect } from 'react';
import { validate } from './formValidation.js';

const useForm = callback => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      console.log('from useForm', values);
    }
  }, [errors]);

  const handleSubmit = (event) => {
    if (event) event.preventDefault();
    setErrors(validate(values));
    setIsSubmitting(true);
  };

  const handleChange = event => {
    event.persist();
    const { name, value } = event.target;
    const modifiedValues =
    setValues(values => ({ ...values, [name]: value }));
  };

  return { handleChange, handleSubmit, values, errors };
};

export default useForm;
