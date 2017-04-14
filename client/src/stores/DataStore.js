import { observable, action, computed } from 'mobx';

import uiStore from './UIStore';
import api from './api';

class DataStore {
  @observable version = {
    version: ``,
    title: ``,
    description: ``
  };

  @observable developmentFeatures = [];
  @observable newFeatures = [];
  @observable feedback = [];
  @observable keys = [];

  @computed get usedKeys() {
    return this.keys.filter(key => !key.takenBy).length;
  }

  @action setDevelopmentFeatures(f) {
    this.developmentFeatures = f;
  }

  @action setNewFeatures(f) {
    this.newFeatures = f;
  }

  @action addFeature(f) {
    console.log(f);
    uiStore.toggleAddFeatureMode();
  }
}

const singleton = new DataStore();

// Set developmentFeatures
api(`getDevelopmentFeatures`)
  .then((obj) => {
    if (!uiStore.errorCheck(obj))
      singleton.setDevelopmentFeatures(obj);
  });

// Set newFeatures
api(`getNewFeatures`)
  .then((obj) => {
    if (!uiStore.errorCheck(obj))
      singleton.setNewFeatures(obj);
  });

export default singleton;
