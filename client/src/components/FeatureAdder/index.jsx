import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import './style.css';

export default class FeatureAdder extends Component {

  constructor(props) {
    super(props);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.state = {
      title: ``,
      description: ``
    };
  }

  onTitleChange(e) {
    this.setState({
      ...this.state,
      title: e.target.value
    });
  }

  onDescriptionChange(e) {
    this.setState({
      ...this.state,
      description: e.target.value
    });
  }

  render() {
    return (
      <div className={`features`}>
        <div className={`add`}>
          <TextField hintText={`Title`} onInput={this.onTitleChange} />
          <TextField hintText={`Description`} multiLine rows={7} onInput={this.onDescriptionChange} />
          <RaisedButton label={`Submit`} primary onTouchTap={() => this.props.onFeatureAdded(this.state)} />
        </div>
      </div>
    );
  }

}
