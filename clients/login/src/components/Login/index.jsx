import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import api from 'shared/api';

import './style.css';

function getType() {
  let type = ``;

  if (window.location.href.indexOf(`client`) !== -1)
    type = `client`;

  if (window.location.href.indexOf(`admin`) !== -1)
    type = `admin`;

  return type;
}

export default class Login extends Component {

  constructor(props) {
    super(props);
    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onKeyChange = this.onKeyChange.bind(this);
    this.state = {
      username: ``,
      password: ``,
      key: ``,
      error: ``,
      type: getType(),
      project: {},
      showLogin: false,
      showRegister: false
    };

    if (this.state.type === ``) {
      api(`getProjectInformation`)
        .then(({ projectTitle, projectDescription, image, video }) => {
          this.setState({
            ...this.state,
            project: {
              projectTitle,
              projectDescription,
              image,
              video
            }
          });
        });
    }
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

  onKeyChange(e) {
    this.setState({
      ...this.state,
      key: e.target.value
    });
  }

  render() {
    const RegisterElem =
      (
        <div className={`login`}>
          <TextField hintText={`username`} onInput={this.onUsernameChange} />
          <TextField hintText={`password`} type={`password`} onInput={this.onPasswordChange} />
          <TextField hintText={`Your access key`} onInput={this.onKeyChange} />
          <RaisedButton
            label={`Register`}
            primary
            onTouchTap={() => {
              api(`register`, {
                username: this.state.username,
                password: this.state.password,
                accessKey: this.state.key
              })
                .then((obj) => {
                  if (!obj.error)
                    window.location.href = `/${this.state.type}`;
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

    const LoginElem =
      (
        <div className={`login`}>
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
                    window.location.href = `/${this.state.type}`;
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

    let greet;

    switch (this.state.type) {
      case `client`:
        greet = (
          <h1>User area</h1>
        );
        break;

      case ``:
        greet = (
          <div className={`app-welcome`}>
            {
              this.state.project.image &&
                <div className={`img`}>
                  <img src={`/${this.state.project.image}`} alt={``} />
                </div>
            }
            {
              this.state.project.projectTitle &&
                <h1>{this.state.project.projectTitle}</h1>
            }
            {
              this.state.project.video &&
              <div className={`video`}>
                <iframe src={this.state.project.video} />
              </div>
            }
            {
              this.state.project.projectDescription &&
                <h2>{this.state.project.projectDescription}</h2>
            }
          </div>
        );
        break;

      default:
        greet = (
          <h1>Keedback</h1>
        );
    }

    if (this.state.showLogin) {
      return (
        <div className={`login`}>
          <h1>Login</h1>
          {
            this.state.error !== `` &&
              <h3>{this.state.error}</h3>
          }
          {LoginElem}
        </div>
      );
    }

    if (this.state.showRegister) {
      return (
        <div className={`login`}>
          <h1>Register</h1>
          {
            this.state.error !== `` &&
              <h3>{this.state.error}</h3>
          }
          {RegisterElem}
        </div>
      );
    }

    return (
      <div className={`login`}>
        { greet }
        {
          (this.state.type !== ``) &&
            <h2>Please login to gain access.</h2>
        }
        {
          (this.state.type === ``) &&
            <h2>Register with a key or login</h2>
        }
        {
          this.state.error !== `` &&
            <h3>{this.state.error}</h3>
        }
        {
          (this.state.type !== ``) &&
            LoginElem
        }
        {
          (this.state.type === ``) &&
          <div className={`key-btns`}>
            <RaisedButton
              label={`Login`}
              primary
              style={{
                marginRight: `10px`
              }}
              onTouchTap={() => {
                this.setState({
                  ...this.state,
                  showLogin: true
                });
              }}
            />
            <RaisedButton
              label={`I have a key`}
              primary
              onTouchTap={() => {
                this.setState({
                  ...this.state,
                  showRegister: true
                });
              }}
            />
          </div>
        }
      </div>
    );
  }

}
