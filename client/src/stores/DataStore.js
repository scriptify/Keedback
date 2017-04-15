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
  @observable maxKeys = 0;
  @observable returnOnRegisterKeys = 0;

  @computed get numUsedKeys() {
    return this.keys.filter(key => key.takenBy).length;
  }

  @action(`Set keys`) setKeys(k) {
    this.keys = k;
    this.sortKeys(uiStore.keysOrder);
  }

  @action(`Set key metadata`) setKeyMetadata({ maxKeys, returnOnRegister }) {
    this.maxKeys = maxKeys;
    this.returnOnRegisterKeys = returnOnRegister;
  }

  @action(`Set return on register key num`) setReturnOnRegisterKeyNum(num) {
    api(`setReturnOnRegisterKeyNum`, { num })
      .then((obj) => {
        if (!uiStore.errorCheck(obj)) {
          uiStore.setMessage(`Newly registered users will now get ${num} keys.`);
          this.returnOnRegisterKeys = num;
        }
      });
  }

  @action(`set max key num`) setMaxKeys(num) {
    api(`setMaxKeys`, { num })
      .then((obj) => {
        if (!uiStore.errorCheck(obj)) {
          uiStore.setMessage(`Up to ${num} keys can be generated now.`);
          this.maxKeys = num;
        }
      });
  }

  @action sortKeys(order = `free`) {
    this.keys = this.keys.sort((key1, key2) => {
      if (key1.takenBy === null && key2.takenBy !== null) {
        if (order === `free`)
          return -1;
        return 1;
      }

      if (key1.takenBy !== null && key2.takenBy === null) {
        if (order === `free`)
          return 1;
        return -1;
      }

      return 0;
    });
  }

  @action(`generate keys`) generateKeys(num) {
    api(`generateKeys`, { num })
      .then((obj) => {
        if (!uiStore.errorCheck(obj)) {
          uiStore.setMessage(`${num} keys were generated.`);
          this.keys = this.keys.concat(obj);
          this.sortKeys(uiStore.keysOrder);
        }
      });
  }

  @action(`Set development features`) setDevelopmentFeatures(f) {
    this.developmentFeatures = f;
  }

  @action(`Set new features`) setNewFeatures(f) {
    this.newFeatures = f;
  }

  @action(`Add feature. Dependent on uiStore.addFeatureType`) addFeature(f) {
    if (uiStore.addFeatureType === `dev`) {
      api(`addDevelopmentFeature`, f)
        .then((obj) => {
          if (!uiStore.errorCheck(obj)) {
            uiStore.setMessage(`Development feature was added.`);
            this.developmentFeatures.push(obj);
          }
        });
    } else {
      // New
      api(`addNewFeature`, f)
        .then((obj) => {
          if (!uiStore.errorCheck(obj)) {
            uiStore.setMessage(`New feature was added.`);
            this.newFeatures.push(obj);
          }
        });
    }

    uiStore.toggleAddFeatureMode();
  }

  @action(`Delete development feature`) deleteDevelopmentFeature(DFID) {
    api(`deleteDevelopmentFeature`, { DFID })
      .then((obj) => {
        if (!uiStore.errorCheck(obj)) {
          uiStore.setMessage(`Development feature was deleted.`);
          this.developmentFeatures = this.developmentFeatures.filter(f => f.DFID !== DFID);
        }
      });
  }

  @action(`Delete new feature`) deleteNewFeature(NFID) {
    api(`deleteNewFeature`, { NFID })
      .then((obj) => {
        if (!uiStore.errorCheck(obj)) {
          uiStore.setMessage(`New feature was deleted.`);
          this.newFeatures = this.newFeatures.filter(f => f.NFID !== NFID);
        }
      });
  }

  @action(`Move a new feature to the development stage`) moveNewFeatureToDevelopmentStage(NFID) {
    api(`moveNewFeatureToDevelopmentStage`, { NFID })
      .then((obj) => {
        if (!uiStore.errorCheck(obj)) {
          uiStore.setMessage(`Feature was moved!`);
          const { title, description } = this.newFeatures.filter(f => f.NFID === NFID)[0];
          const { DFID } = obj;
          this.developmentFeatures.push({
            DFID,
            title,
            description,
            votes: 0,
            hasVoted: false
          });
          this.newFeatures = this.newFeatures.filter(f => f.NFID !== NFID);
        }
      });
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

// Set keys
api(`getKeys`)
  .then((obj) => {
    if (!uiStore.errorCheck(obj))
      singleton.setKeys(obj);
  });

// Set key metadata
api(`getKeyMetadata`)
  .then((obj) => {
    if (!uiStore.errorCheck(obj))
      singleton.setKeyMetadata(obj);
  });

export default singleton;
