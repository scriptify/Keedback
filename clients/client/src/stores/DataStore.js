import { observable, action } from 'mobx';
import api from 'shared/api';

import uiStore from './UIStore';

class DataStore {
  @observable developmentFeatures = [];
  @observable newFeatures = [];

  @action(`set development features`) setDevelopmentFeatures(f) {
    this.developmentFeatures = f;
  }

  @action(`set new features`) setNewFeatures(f) {
    this.newFeatures = f;
  }

  @action(`upvote a new feature`) upvote(NFID) {
    api(`upvoteFeature`, { NFID })
      .then((obj) => {
        if (!uiStore.errorCheck(obj)) {
          this.newFeatures = this.newFeatures.map((f) => {
            if (f.NFID === NFID) {
              return {
                ...f,
                votes: f.votes + 1
              };
            }
            return f;
          });
        }
      });
  }

  setup() {
    api(`getDevelopmentFeatures`)
      .then((obj) => {
        if (!uiStore.errorCheck(obj))
          this.setDevelopmentFeatures(obj);
      });

    api(`getNewFeatures`)
      .then((obj) => {
        if (!uiStore.errorCheck(obj))
          this.setNewFeatures(obj);
      });
  }
}

const singleton = new DataStore();
singleton.setup();

export default singleton;
