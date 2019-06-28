import React, { Fragment, useEffect } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import * as firebase from 'firebase';
import useForm from './useForm.js';
import useOAuth from './useOAuth.js';
import useAuthLink from '../hooks/useAuthLink.js';
import './RegistrationForm.css';

const RegistrationForm = () => {
  let redirect = false;
  const { values, errors, handleChange, handleSubmit } = useForm(null);
  const [selection, setSelection] = useOAuth();
  const { email, setEmail, setLinkError, wasSubmitted } = useAuthLink();
  useEffect(() => {
    if (wasSubmitted) {
      console.log('submitted auth request by form');
    }
  }, [wasSubmitted]);
  if (wasSubmitted) {
    return <Redirect to="verification"/>;
  } else {
    return (
  		<Fragment>
  			<form className="signInFormComponent">
  	      <fieldset className="signInFieldset">
  	        <legend className="signInWithEmailLegend">
  						<p className="appNameAtAuth">Potato</p>
  					</legend>
  	        <div className="parentFlex">
  	          <div className="formGroup passwordFormGroup">
  							<input
  								className="input emailInput"
  								type="text"
  								name="email"
  								placeholder="email"
  								value={values.email || ''}
  								onChange={handleChange}
  							/>
  						<p className="errorMessage">{errors.email}</p>
  	          </div>
  	          <button
  	            className="signInWithEmailButton"
  	            type="submit"
  	            disabled={false}
                onClick={(e) => {
                  e.preventDefault();
                  setEmail(values.email);
                }}>
  	            send dynamic link
  	          </button>
  	          <span className="horizontalRule"> or </span>
  	          <img
  	            className="googleButton"
  	            src={require('../assets/btn_google_signin_dark_normal_web@2x.png')}
  	            alt=""
  							onClick={() => setSelection('GOOGLE_SIGN_IN_METHOD')}
  	          />
  	          <p className="toggleFormLink">
  	            don't have an account? <span>sign up!</span>
  	          </p>
  	        </div>
  	      </fieldset>
  	    </form>
  		</Fragment>
  	);
  }
};

export default withRouter(RegistrationForm);
