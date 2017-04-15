import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import './style.css';

export default class Login extends Component {

  constructor(props) {
    super(props);
    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.state = {
      username: ``,
      password: ``
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
    return (
      <div className={`login`}>
        <h1>Keedback</h1>
        <h2>Please login.</h2>
        <TextField hintText={`username`} onInput={this.onUsernameChange} />
        <TextField hintText={`password`} type={`password`} onInput={this.onPasswordChange} />
        <RaisedButton label={`Login`} primary onTouchTap={() => this.props.onLogin(this.state.username, this.state.password)} />
      </div>
    );
  }

}
