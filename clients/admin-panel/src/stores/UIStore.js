import { observable, action } from 'mobx';
import api from 'shared/api';
import dataStore from './DataStore';

class UIStore {
  @observable position = 0;
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

  @action(`logout`) logout() {
    api(`logout`)
      .then(() => {
        this.setMessage(`Logging out...`);
        window.location.reload();
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

dataStore.setup();

export default singleton;
