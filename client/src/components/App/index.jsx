import React from 'react';
import { observer, inject } from 'mobx-react';

import AppBar from 'material-ui/AppBar';
import Snackbar from 'material-ui/Snackbar';

import Version from '../Version';
import Features from '../Features';
import Keys from '../Keys';
import Feedback from '../Feedback';
import Navigation from '../Navigation';

import Login from '../Login';

import './style.css';

const App = ({ uiStore, dataStore }) => {
  const { position, loggedIn, showMessage, message, addFeatureMode } = uiStore;
  const MsgBar = (
    <Snackbar
      open={showMessage}
      message={message}
      autoHideDuration={4000}
      onRequestClose={() => uiStore.hideMessage()}
    />
  );

  if (!loggedIn) {
    return (
      <div>
        { MsgBar }
        <Login
          onLogin={(username, password) => {
            uiStore.login(username, password);
          }}
        />
      </div>
    );
  }

  return (
    <div className={`app`}>
      { MsgBar }
      <div className={`title-bar`}>
        <AppBar
          title={`Features`}
          iconClassNameLeft={`none`}
        />
      </div>
      {
        position === 0 &&
          <Features
            addFeatureMode={addFeatureMode}
            onAdd={f => uiStore.toggleAddFeatureMode(f)}
            onFeatureAdded={f => dataStore.addFeature(f)}
          />
      }
      {
        position === 1 &&
          <Keys />
      }
      {
        position === 2 &&
          <Feedback />
      }
      {
        position === 3 &&
          <Version />
      }
      <Navigation position={position} onChange={p => uiStore.setPosition(p)} />
    </div>
  );
};

export default inject(`uiStore`, `dataStore`)(observer(App));
