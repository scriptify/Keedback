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

export default singleton;
