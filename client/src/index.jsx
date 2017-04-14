import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import uiStore from './stores/UIStore';
import dataStore from './stores/DataStore';

import App from './components/App';

injectTapEventPlugin();

ReactDOM.render(
  <Provider uiStore={uiStore} dataStore={dataStore}>
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.querySelector(`#app`)
);
