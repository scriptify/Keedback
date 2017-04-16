import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import Toggle from 'material-ui/Toggle';

import './style.css';

@inject(`uiStore`, `dataStore`)
@observer
export default class Keys extends Component {

  constructor(props) {
    super(props);
    this.state = {
      keysToGenerate: 0,
      maxKeys: undefined,
      returnOnRegisterKeys: undefined,
    };
  }

  handleKeysToGenerateChange(e) {
    this.setState({
      ...this.state,
      keysToGenerate: e.target.value
    });
  }

  handleMaxKeysChange(e) {
    this.setState({
      ...this.state,
      maxKeys: e.target.value
    });
  }

  handleReturnOnRegisterKeysChange(e) {
    this.setState({
      ...this.state,
      returnOnRegisterKeys: e.target.value
    });
  }

  render() {
    const { dataStore, uiStore } = this.props;

    return (
      <div className={`keys`}>
        <div className={`params`}>
          <div className={`param`}>
            <TextField
              floatingLabelText={`Number of keys to generate`}
              type={`number`}
              onInput={e => this.handleKeysToGenerateChange(e)}
              value={this.state.keysToGenerate}
            />
            <RaisedButton
              label={`Generate keys`}
              primary
              onTouchTap={() => {
                dataStore.generateKeys(this.state.keysToGenerate);
              }}
            />
          </div>
          <div className={`param`}>
            <TextField
              floatingLabelText={`Keys to return on register`}
              type={`number`}
              onInput={e => this.handleReturnOnRegisterKeysChange(e)}
              defaultValue={dataStore.returnOnRegisterKeys}
            />
            <RaisedButton
              label={`Set return on register`}
              primary
              onTouchTap={() => dataStore.setReturnOnRegisterKeyNum(this.state.returnOnRegisterKeys)}
            />
          </div>
          <div className={`param`}>
            <TextField
              floatingLabelText={`Number of maximal keys`}
              type={`number`}
              onInput={e => this.handleMaxKeysChange(e)}
              defaultValue={dataStore.maxKeys}
            />
            <RaisedButton
              label={`Set max keys`}
              primary
              onTouchTap={() => dataStore.setMaxKeys(this.state.maxKeys)}
            />
          </div>
        </div>
        <div className={`info`}>
          <p>Total number of keys: { dataStore.keys.length }</p>
          <p>Keys taken: { dataStore.numUsedKeys }</p>
        </div>
        <div className={`table`}>
          <div className={`toggle`}>
            <Toggle
              label={`Sort by taken`}
              labelStyle={{
                color: `#FFF`
              }}
              onTouchTap={() => {
                if (uiStore.keysOrder === `free`)
                  uiStore.setKeysOrder(`takenBy`);
                else
                  uiStore.setKeysOrder(`free`);
              }}
            />
          </div>
          <Table selectable={false}>
            <TableHeader>
              <TableRow>
                <TableHeaderColumn>Key</TableHeaderColumn>
                <TableHeaderColumn>Taken by</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                dataStore.keys.map(({ value, takenBy }) => (
                  <TableRow key={value}>
                    <TableRowColumn>{ value }</TableRowColumn>
                    <TableRowColumn>{ takenBy === null ? `--` : takenBy }</TableRowColumn>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

}
