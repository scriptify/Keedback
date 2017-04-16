import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import api from 'shared/api';

import './style.css';

export default class Login extends Component {

  constructor(props) {
    super(props);
    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.state = {
      username: ``,
      password: ``,
      error: ``
    };
  }

  onUsernameChange(e) {
    this.setState({
      ...this.state,
      username: e.target.value
    });
  }

  onPasswordChange(e) {
    this.setState({
      ...this.state,
      password: e.target.value
    });
  }

  render() {
    let type = ``;
    let greet;

    if (window.location.href.indexOf(`client`) !== -1)
      type = `client`;

    if (window.location.href.indexOf(`admin`) !== -1)
      type = `admin`;

    switch (type) {
      case `client`:
        greet = (
          <h1>User area</h1>
        );
        break;

      case ``:
        greet = (
          <h1>Welcome!</h1>
        );
        break;

      default:
        greet = (
          <h1>Keedback</h1>
        );
    }

    return (
      <div className={`login`}>
        { greet }
        <h2>Please login to gain access.</h2>
        {
          this.state.error !== `` &&
            <h3>{this.state.error}</h3>
        }
        <TextField hintText={`username`} onInput={this.onUsernameChange} />
        <TextField hintText={`password`} type={`password`} onInput={this.onPasswordChange} />
        <RaisedButton
          label={`Login`}
          primary
          onTouchTap={() => {
            api(`login`, {
              username: this.state.username,
              password: this.state.password
            })
              .then((obj) => {
                if (!obj.error)
                  window.location.href = `/${type}`;
                else {
                  this.setState({
                    ...this.state,
                    error: obj.error
                  });
                }
              });
          }}
        />
      </div>
    );
  }

}
