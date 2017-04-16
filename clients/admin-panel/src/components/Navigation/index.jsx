import React from 'react';

import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import FeatureIcon from 'material-ui/svg-icons/action/build';
import KeyIcon from 'material-ui/svg-icons/communication/vpn-key';
import FeedbackIcon from 'material-ui/svg-icons/action/feedback';
import VersionIcon from 'material-ui/svg-icons/action/code';

import './style.css';

const featureIcon = <FeatureIcon />;
const keyIcon = <KeyIcon />;
const feedbackIcon = <FeedbackIcon />;
const versionIcon = <VersionIcon />;

const Navigation = ({ unprocessedFeedbackNum, position, onChange = () => {} }) => (

  <Paper zDepth={1}>
    <BottomNavigation selectedIndex={position}>
      <BottomNavigationItem
        label={`Features`}
        icon={featureIcon}
        onTouchTap={() => onChange(0)}
      />
      <BottomNavigationItem
        label={`Keys`}
        icon={keyIcon}
        onTouchTap={() => onChange(1)}
      />
      <BottomNavigationItem
        label={`Feedback (${unprocessedFeedbackNum})`}
        icon={feedbackIcon}
        onTouchTap={() => onChange(2)}
      />
      <BottomNavigationItem
        label={`Version`}
        icon={versionIcon}
        onTouchTap={() => onChange(3)}
      />
    </BottomNavigation>
  </Paper>
);

export default Navigation;
