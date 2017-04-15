import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import './style.css';

@inject(`uiStore`, `dataStore`)
@observer
export default class Version extends Component {

  constructor(props) {
    super(props);
    this.state = {
      version: undefined,
      title: undefined,
      description: undefined
    };
  }

  handleVersionChange(e) {
    this.setState({
      ...this.state,
      version: e.target.value
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
      description: e.target.value
    });
  }

  render() {
    const { dataStore } = this.props;

    return (
      <div className={`version`}>
        <TextField hintText={`Version number`} onInput={e => this.handleVersionChange(e)} defaultValue={dataStore.version.version} />
        <TextField hintText={`Title`} onInput={e => this.handleTitleChange(e)} defaultValue={dataStore.version.title} />
        <TextField hintText={`Description`} multiLine rows={5} onInput={e => this.handleDescriptionChange(e)} defaultValue={dataStore.version.description} />
        <RaisedButton label={`Set version`} primary onTouchTap={() => dataStore.alterVersion(this.state)} />
      </div>
    );
  }
}
