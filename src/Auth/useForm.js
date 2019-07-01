import { useState, useEffect } from 'react';
import { validate } from './formValidation.js';
import useAuthLink from '../hooks/useAuthLink.js';
import Validation from '../validation.js';


const useForm = () => {
  const { setAuthEmail } = useAuthLink();
  const [authFormValues, setAuthFormValues] = useState({});
  const [authFormErrors, setAuthFormErrors] = useState({});
  const [wasAuthLinkSent, setWasAuthLinkSubmitted] = useState(false);

  const handleSubmit = event => {
    if (event) event.preventDefault();
    setAuthEmail(authFormValues.email);
    setWasAuthLinkSubmitted(true);
   };

  const handleChange = event => {
    event.persist();
    const { name, value } = event.target;
    const emailError = new Validation()[name](value);
    setAuthFormErrors(authFormErrors => ({ ...authFormErrors, ...emailError }));
    setAuthFormValues(authFormValues => ({ ...authFormValues, [name]: value }));
  };

  useEffect(() => {
    if (Object.keys(authFormErrors).length === 0) {
    }
  }, [wasAuthLinkSent]);

  return { wasAuthLinkSent, handleChange, handleSubmit, authFormValues, authFormErrors };
};

export default useForm;
