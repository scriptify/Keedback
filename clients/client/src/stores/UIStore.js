import { observable, action } from 'mobx';
import api from 'shared/api';

class UIStore {
  @observable message = ``;
  @observable showMessage = false;
  @observable feedbackMode = false;

  @action(`logout`) logout() {
    this.setMessage(`Logging out.`);
    api(`logout`)
      .then(() => { window.location.href = `/login/?client`; });
  }

  @action(`show feedback formular`) showFeedbackForm() {
    this.feedbackMode = true;
  }

  @action(`hide feedback formular`) hideFeedbackForm() {
    this.feedbackMode = false;
  }

  @action(`set message`) setMessage(msg) {
    this.message = msg;
    this.showMessage = true;
  }

  @action(`hide message`) hideMessage() {
    this.showMessage = false;
  }

  @action(`create feedback`) createFeedback({ title, text, email, type }) {
    api(`createFeedback`, { title, text, type, email })
      .then((obj) => {
        if (!this.errorCheck(obj)) {
          this.setMessage(`Feedback created. Thank you!`);
          this.hideFeedbackForm();
        }
      });
  }

  errorCheck(obj) {
    if (obj.error) {
      this.setMessage(obj.error);
      return true;
    }
    return false;
  }
}

const singleton = new UIStore();

export default singleton;
