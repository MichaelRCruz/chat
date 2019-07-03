import { useState, useEffect } from 'react';
// import { validate } from './formValidation.js';
import Validation from '../validation.js';


const useForm = (callback) => {
  const [authFormValues, setAuthFormValues] = useState({});
  const [authFormErrors, setAuthFormErrors] = useState({});
  const [wasFormSubmitted, setWasFormSubmitted] = useState(false);

  const clearForm = () => {
    setAuthFormValues({});
    setAuthFormErrors({});
  };

  const handleSubmit = event => {
    if (event) event.preventDefault();
    setWasFormSubmitted(true);
    callback(authFormValues.email, clearForm);
   };

  const handleChange = event => {
    event.persist();
    const { name, value } = event.target;
    const emailError = new Validation()[name](value);
    setAuthFormErrors(authFormErrors => ({ ...authFormErrors, ...emailError }));
    setAuthFormValues(authFormValues => ({ ...authFormValues, [name]: value }));
  };

  return { handleChange, handleSubmit, authFormValues, authFormErrors };
};

export default useForm;
