import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import './style.css';

export default class Feature extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: ``,
      description: ``
    };
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.onFeatureAdded = this.onFeatureAdded.bind(this);
  }

  onTitleChange(e) {
    this.setState({
      title: e.target.value,
      ...this.state
    });
  }

  onDescriptionChange(e) {
    this.setState({
      description: e.target.value,
      ...this.state
    });
  }

  onFeatureAdded() {
    this.props.onFeatureAdded({
      title: this.state.title,
      description: this.state.description
    });
  }

  render() {
    return (
      <div className={`features`}>
        <div className={`add`}>
          <p>Add a feature</p>
          <TextField hintText={`Feature name`} onInput={this.onTitleChange} />
          <TextField hintText={`Feature description`} multiLine rows={5} onInput={this.onDescriptionChange} />
          <RaisedButton label={`Submit`} primary onTouchTap={this.onFeatureAdded} />
        </div>
      </div>
    );
  }

}
