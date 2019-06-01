export default class Validation {

  goFetch = (uri, inputOptions) => {
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
    });
  };

  checkAvailability = async fieldValue => {
    const uri = `https://us-central1-chat-asdf.cloudfunctions.net/verifyDisplayname?displayname=${fieldValue}`;
    const inputOptions = {
      method: "GET"
    };
    const response = await this.goFetch(uri, inputOptions);
    console.log(response);
    return response;
  };

  displayname = async fieldValue => {
    fieldValue = fieldValue.trim();
    let displaynameError = '';
    if (fieldValue.length === 0) {
      displaynameError = 'please choose a unique display name';
      return ['displaynameError', displaynameError];
    } else {
      if (fieldValue.length < 2) {
        displaynameError = 'display name must be at least 2 characters long';
      } else {
        const isAvailable = await this.checkAvailability(fieldValue);
        displaynameError = isAvailable ? '' : 'displayname unavailable';
      }
      return ['displaynameError', displaynameError];
    }
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

  message = message => {
    return ['messageError', ''];
  }

}
