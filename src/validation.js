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
    }
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
      })
  };

  displayname = fieldValue => {
    const claimedDisplaynames = ['relrod', 'mkb', 'danopia', 'ep', 'nb', 'mykey'];
    fieldValue = fieldValue.trim();
    let displaynameError = '';
    if (fieldValue.length === 0) {
      displaynameError = 'please provide a unique display name';
    } else {
      if (fieldValue.length < 2) {
        displaynameError = 'display name must be at least 2 characters long';
      } else if (claimedDisplaynames.includes(fieldValue)) {
        displaynameError = 'displayname already in use';
      }
    }
    return ['displaynameError', displaynameError];
  };

  email = fieldValue => {
    let emailError = /^\S+@\S+$/.test(fieldValue) ? false : 'Must be a valid email address';
    if (!fieldValue.length) {
      emailError = 'email is required';
    }
    return ['emailError', emailError];
  };

  password = fieldValue => {
    let passwordError = '';
    fieldValue = fieldValue.trim();
    if (fieldValue.length === 0) {
      passwordError = 'password is required';
    } else {
      if (fieldValue.length < 6 || fieldValue.length > 13) {
        passwordError = 'password must be 6 to 13 characters long';
      } else {
        if (!fieldValue.match(new RegExp(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/))) {
          passwordError = 'password must contain at least 1 number and 1 letter';
        } else {
          passwordError = '';
        }
      }
    }
    return ['passwordError', passwordError];
  };

  retypePassword = (fieldValuePassword, fieldValueRetypePassword) => {
    if (fieldValuePassword !== fieldValueRetypePassword) {
      return ['retypePasswordError', 'passwords do not match'];
    } else {
      return ['retypePasswordError', ''];
    }
  };

}
