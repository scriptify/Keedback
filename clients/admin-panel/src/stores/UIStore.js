import { observable, action } from 'mobx';
import api from 'shared/api';
import dataStore from './DataStore';

class UIStore {
  @observable position = 0;
  @observable loggedIn = false;
  @observable message = ``;
  @observable showMessage = false;
  @observable addFeatureMode = false;
  @observable addFeatureType = `dev`;
  @observable keysOrder = `free`;

  errorCheck(obj) {
    if (obj.error) {
      this.setMessage(obj.error);
      return true;
    }
    return false;
  }

  @action setKeysOrder(order = `free`) {
    this.keysOrder = order;
    dataStore.sortKeys(order);
  }

  @action(`Toggle addFeatureMode`) toggleAddFeatureMode(type = `dev`) {
    this.addFeatureMode = !this.addFeatureMode;
    this.addFeatureType = type;
  }

  @action(`Change position`) setPosition(pos) {
    this.position = pos;
  }

  @action(`Set logged in`) setLoggedIn(l = true) {
    this.loggedIn = l;
    if (l)
      this.setMessage(`Logged in!`);
    else
      this.setMessage(`Logged out.`);
  }

  @action(`logout`) logout() {
    api(`logout`)
      .then(() => {
        this.setLoggedIn(false);
      });
  }

  @action(`login`) login(username, password) {
    api(`login`, {
      username,
      password
    })
      .then((obj) => {
        if (!this.errorCheck(obj)) {
          this.setLoggedIn();
          dataStore.setup();
        }
      });
  }

  @action(`Set message and show`) setMessage(msg) {
    this.message = msg;
    this.showMessage = true;
  }

  @action(`Hide message`) hideMessage() {
    this.showMessage = false;
  }
}

const singleton = new UIStore();

// Look if user is already logged in
api(`isLoggedIn`)
  .then((obj) => {
    if (!singleton.errorCheck(obj)) {
      if (obj.isLoggedIn && obj.isAdmin) {
        singleton.setLoggedIn();
        dataStore.setup();
      }
    }
  });

export default singleton;
