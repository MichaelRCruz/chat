import { useState, useEffect } from 'react';
import { validate } from './formValidation.js';
// import useAuthLink from '../hooks/useAuthLink.js';
import Validation from '../validation.js';


const useForm = (callback) => {
  // const { setAuthEmail, isAuthLinkSent } = useAuthLink();
  const [authFormValues, setAuthFormValues] = useState({});
  const [authFormErrors, setAuthFormErrors] = useState({});
  const [wasFormSubmitted, setWasFormSubmitted] = useState(false);

  const handleSubmit = event => {
    if (event) event.preventDefault();
    // console.log('from form: ', authFormValues.email);
    callback(authFormValues.email);
    setWasFormSubmitted(true);
    // setAuthEmail(authFormValues.email);
   };

  const handleChange = event => {
    event.persist();
    const { name, value } = event.target;
    const emailError = new Validation()[name](value);
    setAuthFormErrors(authFormErrors => ({ ...authFormErrors, ...emailError }));
    setAuthFormValues(authFormValues => ({ ...authFormValues, [name]: value }));
  };

  // useEffect(() => {
  //   if (Object.keys(authFormErrors).length === 0) {
  //     console.log('form submitted');
  //   }
  // }, [wasAuthLinkSent]);

  return { wasFormSubmitted, setWasFormSubmitted, handleChange, handleSubmit, authFormValues, authFormErrors };
};

export default useForm;
