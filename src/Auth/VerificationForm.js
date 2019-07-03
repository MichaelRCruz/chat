import React, { Fragment, useEffect, useState } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import useForm from './useForm.js';
import useOAuth from './useOAuth.js';
import useAuthLink from '../hooks/useAuthLink.js';
import useRedirect from '../hooks/useRedirect.js';
import './VerificationForm.css';

const VerificationForm = props => {

  // this.debounceDisplayname = debounce(async fieldValue => {
  //   try {
  //     this.handleFieldValue(await new Validation().displayname(fieldValue));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, 250);

  // return (
  //   <form className="verificationFormComponent" onSubmit={handleSubmit}>
  //     <fieldset className="verificationFieldset">
  //       <legend className="verificationLegend"><p className="appNameAtAuth">Potato</p></legend>
  //       <div className="parentFlex">
  //         <div className="formGroup verificationFormGroup">
  //           <p className="errorMessage">{authFormErrors.displayName}</p>
  //           <input
  //             className="input displaynameInput"
  //             type="text"
  //             name="email"
  //             placeholder="e.g., mykey_42"
  //             onChange={handleChange}
  //           />
  //         </div>
  //         <div className="formGroup emailFormGroup">
  //           <p className="errorMessage">{authFormErrors.email}</p>
  //           <input
  //             className="input emailInput"
  //             type="email"
  //             name="email"
  //             placeholder="email"
  //             onChange={handleChange}
  //           />
  //         </div>
  //         <div className="formGroup passwordFormGroup">
  //           <p className="errorMessage">{authFormErrors.password}</p>
  //           <input
  //             className="input passwordInput"
  //             type="password"
  //             name="password"
  //             placeholder="password"
  //             onChange={handleChange}
  //           />
  //         </div>
  //         <button
  //           className="verificationButton"
  //           type="submit"
  //           disabled={false}>
  //           complete registration
  //         </button>
  //       </div>
  //     </fieldset>
  //   </form>
  // );
  return (
    <div>hello</div>
  );
}

export default VerificationForm;
