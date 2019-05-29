export default class Validation {
  constructor() {

  }

  realFetch = (uri, inputOptions) => {
    const { headers, ...extraOpts } = inputOptions || {};
    const options = {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        ...(headers || {})
      },
      mode: "cors",
      ...extraOpts
    };
    return fetch(uri, options)
      .then(response => {
        if (!response.ok) {
          const err = new Error(response.statusText);
          err.res = response;
          throw err;
        } else {
          return response.json();
        }
      })
      .catch(err => {
        console.log('from fetch', err);
      });
  }

  // displayName = fieldValue => {
  //   let hasError = false;
  //   let validationMessage = {};
  //   fieldValue = fieldValue.trim();
  //   if (fieldValue.length === 0) {
  //     validationMessage.name = 'displayname is required';
  //     hasError = true;
  //   } else {
  //     if (fieldValue.length < 3) {
  //       fieldErrors.name = 'displayname must be at least 3 characters long';
  //       hasError = true;
  //     } else {
  //       fieldErrors.name = '';
  //       hasError = false;
  //     }
  //   }
  //   return { hasError, validationMessage };
  // }

  email = fieldValue => {
    console.log(fieldValue);
    const emailError = /^\S+@\S+$/.test(fieldValue) ? false : 'Must be a valid email address';
    return ['emailError', emailError];
  }

  password = fieldValue => {
    let passwordError = '';
    fieldValue = fieldValue.trim();
    if(fieldValue.length === 0) {
      passwordError = 'Password is required';
    } else {
      if (fieldValue.length < 6 || fieldValue.length > 13) {
        passwordError = 'Password must be between 6 and 13 characters long';
      } else {
        if(!fieldValue.match(new RegExp(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/))) {
          passwordError = 'Password must contain at least one number and one letter';
        } else {
          passwordError = '';
        }
      }
    }
    return ['passwordError', passwordError];
  }

}
