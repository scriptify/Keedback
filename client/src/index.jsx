import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import uiStore from './stores/UIStore';
import dataStore from './stores/DataStore';

import App from './components/App';

injectTapEventPlugin();

ReactDOM.render(
  <Provider uiStore={uiStore} dataStore={dataStore}>
    <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.querySelector(`#app`)
);
