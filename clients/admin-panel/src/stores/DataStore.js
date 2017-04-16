import { observable, action, computed } from 'mobx';

import api from 'shared/api';
import uiStore from './UIStore';

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
  @observable version = {};
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

  @action(`set feedback`) setFeedback(f) {
    this.feedback = f.sort((f1, f2) => {
      if (!f1.processed && f2.processed)
        return -1;

      if (!f2.processed && f1.processed)
        return 1;

      return 0;
    });
  }

  @action(`process feedback`) processFeedback(FBID) {
    api(`processFeedback`, { FBID })
      .then((obj) => {
        if (!uiStore.errorCheck(obj)) {
          this.feedback = this.feedback.map((f) => {
            if (f.FBID === FBID) {
              return {
                ...f,
                processed: 1
              };
            }
            return f;
          });

          uiStore.setMessage(`Feedback was processed.`);
        }
      });
  }

  @computed get unprocessedFeedbackNum() {
    return this.feedback.filter(f => !f.processed).length;
  }

  @action(`set version info`) setVersion(obj) {
    this.version = obj;
  }

  @action(`alter version`) alterVersion({ version, title, description }) {
    api(`setVersion`, { version, title, description })
      .then((obj) => {
        if (!uiStore.errorCheck(obj)) {
          uiStore.setMessage(`New version ${version} was set.`);
          this.version = {
            version,
            title,
            description
          };
        }
      });
  }

  setup() {
    // Set developmentFeatures
    api(`getDevelopmentFeatures`)
      .then((obj) => {
        if (!uiStore.errorCheck(obj))
          this.setDevelopmentFeatures(obj);
      });

    // Set newFeatures
    api(`getNewFeatures`)
      .then((obj) => {
        if (!uiStore.errorCheck(obj))
          this.setNewFeatures(obj);
      });

    // Set keys
    api(`getKeys`)
      .then((obj) => {
        if (!uiStore.errorCheck(obj))
          this.setKeys(obj);
      });

    // Set key metadata
    api(`getKeyMetadata`)
      .then((obj) => {
        if (!uiStore.errorCheck(obj))
          this.setKeyMetadata(obj);
      });

    // Get feedback
    api(`getFeedback`)
      .then((obj) => {
        if (!uiStore.errorCheck(obj))
          this.setFeedback(obj);
      });

    // Get version
    api(`getVersionInfo`)
    .then((obj) => {
      if (!uiStore.errorCheck(obj))
        this.setVersion(obj);
    });
  }
}

const singleton = new DataStore();

export default singleton;
