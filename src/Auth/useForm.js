import { useState, useEffect } from 'react';
import { validate } from './formValidation.js';

const useForm = callback => {

  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (Object.keys(errors).length === 0) {
      console.log('from useForm', values);
    }
  }, [errors]);

  const handleSubmit = event => {
    if (event) event.preventDefault();
    console.log('from useForm');
    callback(values);
  };

  const handleChange = event => {
    event.persist();
    const { name, value } = event.target;
    setValues(values => ({ ...values, [name]: value }));
  };

  return { handleChange, handleSubmit, values, errors };

};

export default useForm;
