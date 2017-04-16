import React from 'react';
import { observer, inject } from 'mobx-react';

import AppBar from 'material-ui/AppBar';
import Snackbar from 'material-ui/Snackbar';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';

import FeedbackIcon from 'material-ui/svg-icons/action/feedback';

import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';

import Feedback from 'components/Feedback';

import './style.css';

const FeatureCard = ({ title, subtitle = ``, description, isDev = true, onUpvote = () => {}, expandable = true, disableUpvote = false }) => (
  <div className={`card`}>
    <Card>
      <CardHeader
        title={title}
        subtitle={subtitle}
        actAsExpander={expandable}
        showExpandableButton={expandable}
      />
      <CardActions>
        {
          !isDev &&
            <RaisedButton primary label="Upvote" onTouchTap={onUpvote} disabled={disableUpvote} />
        }
      </CardActions>
      <CardText expandable={expandable}>
        { description }
      </CardText>
    </Card>
  </div>
);

const App = ({ uiStore, dataStore }) => {
  const { showMessage, message, feedbackMode } = uiStore;

  const msgBox = (
    <Snackbar
      open={showMessage}
      message={message}
      autoHideDuration={4000}
      onRequestClose={() => uiStore.hideMessage()}
    />
  );

  if (feedbackMode) {
    return (
      <div>
        { msgBox }
        <Feedback
          onClose={() => uiStore.hideFeedbackForm()}
          onSubmit={obj => uiStore.createFeedback(obj)}
        />
      </div>
    );
  }

  return (
    <div className={`app`}>
      { msgBox }
      <div className={`title-bar`}>
        <AppBar
          title={`User area`}
          iconClassNameLeft={`none`}
          iconElementRight={<RaisedButton label={`Logout`} primary onTouchTap={() => uiStore.logout()} />}
        />
      </div>
      <div className={`welcome-text`}>
        Let us know what you think!
      </div>
      <div className={`features`}>
        <div className={`list`}>
          <div className={`title`}>
            <h1>Development features</h1>
            <p>
              Those features are currently in development and will be released in future versions.
            </p>
          </div>
          <div className={`cards`}>
            {
              dataStore.developmentFeatures.map(({ DFID, title, description }) => (
                <FeatureCard
                  key={DFID}
                  title={title}
                  subtitle={`${description.substring(0, 40)}...`}
                  description={description}
                />
              ))
            }
          </div>
        </div>
        <div className={`list`}>
          <div className={`title`}>
            <h1>New features</h1>
            <p>
              Those features could be developed in the future.
              But you decide which features find their way into our product. Vote now!
            </p>
          </div>
          <div className={`cards`}>
            {
              dataStore.newFeatures.map(({ NFID, title, description, votes, hasVoted }) => (
                <FeatureCard
                  key={NFID}
                  title={title}
                  subtitle={`${votes} votes`}
                  description={description}
                  onUpvote={() => dataStore.upvote(NFID)}
                  isDev={false}
                  disableUpvote={hasVoted}
                />
              ))
            }
          </div>
        </div>
      </div>

      <div>
        <Paper zDepth={1} className={`footer`}>
          <IconButton tooltip={`Let us know what you think!`} onTouchTap={() => uiStore.showFeedbackForm()}>
            <FeedbackIcon />
          </IconButton>
        </Paper>
      </div>

    </div>
  );
};

export default inject(`dataStore`, `uiStore`)(observer(App));
