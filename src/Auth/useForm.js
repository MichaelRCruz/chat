import { useState, useEffect } from 'react';
import { validate } from './formValidation.js';
import useAuthLink from '../hooks/useAuthLink.js';
import Validation from '../validation.js';


const useForm = () => {
  const { sendAuthLink, setAuthEmail } = useAuthLink();
  const [authFormValues, setAuthFormValues] = useState({});
  const [authFormErrors, setAuthFormErrors] = useState({});
  const [isAuthLinkSent, setIsAuthLinkSent] = useState(false);

  const handleSubmit = event => {
    if (event) event.preventDefault();
    setAuthEmail(authFormValues.email);
    sendAuthLink('submitted', authFormValues.email);
    setIsAuthLinkSent(true);
   };

  const handleChange = event => {
    event.persist();
    const { name, value } = event.target;
    const emailError = new Validation()[name](value);
    // foo === ["emailError", "Must be a valid email address"]
    setAuthFormErrors(authFormErrors => ({ ...authFormErrors, ...emailError }));
    setAuthFormValues(authFormValues => ({ ...authFormValues, [name]: value }));
    console.log(authFormErrors);
  };

  useEffect(() => {
    if (Object.keys(authFormErrors).length === 0) {
    }
  }, [isAuthLinkSent]);

  return { isAuthLinkSent, handleChange, handleSubmit, authFormValues, authFormErrors };
};

export default useForm;
