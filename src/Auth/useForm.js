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
    callback(authFormValues, clearForm);
   };

  const handleChange = event => {
    event.persist();
    const { name, value } = event.target;
    const error = new Validation()[name](value);
    setAuthFormErrors(authFormErrors => ({ ...authFormErrors, ...error }));
    setAuthFormValues(authFormValues => ({ ...authFormValues, [name]: value }));
  };

  // const debounceDisplayname = debounce(async fieldValue => {
  //   try {
  //     this.handleFieldValue(await new Validation().displayname(fieldValue));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, 250);

  return { handleChange, handleSubmit, authFormValues, authFormErrors };
};

export default useForm;
