import React, { Fragment } from 'react';
// import { useState, useEffect } from 'react';
import useForm from './useForm.js';
import useOAuthRequest from './useOAuth.js';
import './RegistrationForm.css';

export const RegistrationForm = () => {

  const { values, errors, handleChange, handleSubmit } = useForm(null);
  const [oAuthRequest, setOAuthRequest] = useOAuthRequest();

	// if (errors) {
	//
	// }

  return (
		<Fragment>
			<form className="signInFormComponent" onSubmit={handleSubmit}>
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
	            <input
	              className="input passwordInput"
	              type="password"
	              name="password"
	              placeholder="password"
								value={values.password || ''}
								onChange={handleChange}
	            />
							<p className="errorMessage">{errors.password}</p>
	          </div>
	          <button
	            className="signInWithEmailButton"
	            type="submit"
	            disabled={false}>
	            register
	          </button>
	          <span className="horizontalRule"> or </span>
	          <img
	            className="googleButton"
	            src={require('../assets/btn_google_signin_dark_normal_web@2x.png')}
	            alt=""
							onClick={() => setOAuthRequest('GOOGLE')}
	          />
	          <p className="toggleFormLink">
	            don't have an account? <span>sign up!</span>
	          </p>
	        </div>
	      </fieldset>
	    </form>
		</Fragment>
	);
};
