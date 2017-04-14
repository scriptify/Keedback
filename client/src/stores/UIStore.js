import { observable, action } from 'mobx';
import api from './api';

class UIStore {
  @observable position = 0;
  @observable loggedIn = false;
  @observable message = ``;
  @observable showMessage = false;
  @observable addFeatureMode = false;
  @observable addFeatureType = `dev`;

  errorCheck(obj) {
    if (obj.error) {
      this.setMessage(obj.error);
      return true;
    }
    return false;
  }

  @action(`Toggle addFeatureMode`) toggleAddFeatureMode(type = `dev`) {
    this.addFeatureMode = !this.addFeatureMode;
    this.addFeatureType = type;
  }

  @action(`Change position`) setPosition(pos) {
    this.position = pos;
  }

  @action(`Set logged in`) setLoggedIn() {
    this.loggedIn = true;
    this.setMessage(`Logged in!`);
  }

  @action(`login`) login(username, password) {
    api(`login`, {
      username,
      password
    })
      .then((obj) => {
        if (!this.errorCheck(obj))
          this.setLoggedIn();
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
      if (obj.isLoggedIn)
        singleton.setLoggedIn();
    }
  });

export default singleton;
