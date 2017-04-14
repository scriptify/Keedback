import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

import './style.css';

const Keys = () => (
  <div className={`keys`}>
    <div className={`params`}>
      <div className={`param`}>
        <TextField />
        <RaisedButton label={`Generate keys`} primary />
      </div>
      <div className={`param`}>
        <TextField />
        <RaisedButton label={`Set return on register`} primary />
      </div>
      <div className={`param`}>
        <TextField />
        <RaisedButton label={`Set max keys`} primary />
      </div>
    </div>
    <div className={`info`}>
      <p>Total number of keys: 100</p>
      <p>Keys taken: 20</p>
    </div>
    <div className={`table`}>
      <Table selectable={false}>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn>Key</TableHeaderColumn>
            <TableHeaderColumn>Taken by</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableRowColumn>4567687686787643</TableRowColumn>
            <TableRowColumn>--</TableRowColumn>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
);

export default Keys;
