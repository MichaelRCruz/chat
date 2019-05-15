import React, { Component } from 'react';
import ValidationError from '../ValidationError.js';
// import './App.css';

class UpdateDisplayNameForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      nameValid: false,
      formValid: false,
      validationMessages: {
        name: ''
      }
    }
  }

  updateName(name) {
    this.setState({name}, () => {this.validateName(name)});
  }

  handleSubmit(event) {
    event.preventDefault();
    const {name} = this.state;
    this.props.updateDisplayName(name);
  }

  validateName(fieldValue) {
    const fieldErrors = {...this.state.validationMessages};
    let hasError = false;

    fieldValue = fieldValue.trim();
    if(fieldValue.length === 0) {
      fieldErrors.name = 'Name is required';
      hasError = true;
    } else {
      if (fieldValue.length < 3) {
        fieldErrors.name = 'Name must be at least 3 characters long';
        hasError = true;
      } else {
        fieldErrors.name = '';
        hasError = false;
      }
    }

    this.setState({
      validationMessages: fieldErrors,
      nameValid: !hasError
    }, this.formValid );

  }

  formValid() {
    this.setState({
      formValid: this.state.nameValid
    });
  }

  render () {
    return (
     <form className="registration" onSubmit={e => this.handleSubmit(e)}>
       <h2>update display name</h2>
       <div className="form-group">
         <label htmlFor="name">Name *</label>
         <input type="text" className="registration__control"
           name="name" id="name" onChange={e => this.updateName(e.target.value)}/>
         <ValidationError hasError={!this.state.nameValid} message={this.state.validationMessages.name}/>
       </div>

       <div className="registration__button__group">
        <button type="reset" className="registration__button">
            Cancel
        </button>
        <button type="submit" className="registration__button" disabled={!this.state.formValid}>
            Save
        </button>
       </div>
     </form>
   )
 }
}

export default UpdateDisplayNameForm;
