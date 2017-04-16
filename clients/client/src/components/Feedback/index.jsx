import React, { Component } from 'react';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

import './style.css';

export default class Feedback extends Component {

  constructor(props) {
    super(props);
    this.state = {
      type: 0,
      title: ``,
      text: ``,
      email: ``
    };
  }

  handleEmailChange(e) {
    this.setState({
      ...this.state,
      email: e.target.value
    });
  }

  handleTitleChange(e) {
    this.setState({
      ...this.state,
      title: e.target.value
    });
  }

  handleDescriptionChange(e) {
    this.setState({
      ...this.state,
      text: e.target.value
    });
  }

  handleTypeChange(type) {
    this.setState({
      ...this.state,
      type
    });
  }

  render() {
    return (
      <div className={`feedback`}>
        <div className={`title`}>
          <h1>Let us know what you think!</h1>
          <IconButton tooltip={`Go back`} onTouchTap={() => this.props.onClose()}>
            <CloseIcon />
          </IconButton>
        </div>
        <SelectField
          floatingLabelText={`Feedback type`}
          value={this.state.type}
          onChange={(e, i, type) => this.handleTypeChange(type)}
        >
          <MenuItem value={0} primaryText={`Error`} />
          <MenuItem value={1} primaryText={`Idea`} />
          <MenuItem value={2} primaryText={`Experience`} />
        </SelectField>
        <TextField
          floatingLabelText={`Your mail (optional)`}
          value={this.state.email}
          type={`email`}
          onInput={e => this.handleEmailChange(e)}
        />
        <TextField
          floatingLabelText={`Short and descriptive title`}
          value={this.state.title}
          onInput={e => this.handleTitleChange(e)}
        />
        <TextField
          multiLine
          rows={7}
          value={this.state.text}
          floatingLabelText={`What you want us to know...`}
          onInput={e => this.handleDescriptionChange(e)}
        />
        <RaisedButton
          label={`Go!`}
          primary
          onTouchTap={() => this.props.onSubmit(this.state)}
        />
      </div>
    );
  }

}
