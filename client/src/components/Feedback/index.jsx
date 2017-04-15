import React from 'react';
import { inject, observer } from 'mobx-react';

import { Card, CardActions, CardHeader, CardText, CardTitle } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import errorIcon from '../../icons/error.svg';
import ideaIcon from '../../icons/idea.svg';
import experienceIcon from '../../icons/experience.svg';

import './style.css';

const FeedbackCard = ({ type, title, text, onDone = () => {}, processed, email }) => {
  let icon;

  switch (type) {
    case 0:
      icon = errorIcon;
      break;
    case 1:
      icon = ideaIcon;
      break;
    case 2:
      icon = experienceIcon;
      break;
    default:
      icon = errorIcon;
  }

  return (
    <div className={`card`}>
      <Card>
        <CardHeader
          title={title}
          subtitle={`${text.substring(0, 30)}...`}
          avatar={icon}
          actAsExpander
          showExpandableButton
        />
        <CardActions>
          <RaisedButton disabled={processed === 1} primary label="Done" onTouchTap={onDone} />
        </CardActions>
        {
          email &&
            <CardTitle subtitle={`From: ${email}`} />
        }
        <CardText expandable>
          {text}
        </CardText>
      </Card>
    </div>
  );
};

const Feedback = ({ dataStore }) => (
  <div className={`feedback`}>
    {
      dataStore.feedback.map(({ FBID, title, userText, processed, type, email }) => (
        <FeedbackCard
          key={FBID}
          title={title}
          text={userText}
          processed={processed}
          type={type}
          onDone={() => dataStore.processFeedback(FBID)}
          email={email}
        />
      ))
    }
  </div>
);

export default inject(`uiStore`, `dataStore`)(observer(Feedback));
