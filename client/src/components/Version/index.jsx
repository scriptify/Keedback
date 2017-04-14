import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import './style.css';

const Keys = () => (
  <div className={`version`}>
    <TextField hintText={`Version number`} />
    <TextField hintText={`Title`} />
    <TextField hintText={`Description`} multiLine rows={5} />
    <RaisedButton label={`Set version`} primary />
  </div>
);

export default Keys;
