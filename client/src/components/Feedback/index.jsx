import React from 'react';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import errorIcon from '../../icons/error.svg';
import ideaIcon from '../../icons/idea.svg';
import experienceIcon from '../../icons/experience.svg';

import './style.css';

const TestCard = ({ icon }) => (
  <Card>
    <CardHeader
      title="Without Avatar"
      subtitle="Subtitle"
      avatar={icon}
      actAsExpander
      showExpandableButton
    />
    <CardActions>
      <RaisedButton primary label="Done" />
    </CardActions>
    <CardText expandable>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
      Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
      Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
    </CardText>
  </Card>
);

const Feedback = () => (
  <div className={`feedback`}>
    <TestCard icon={errorIcon} />
    <TestCard icon={ideaIcon} />
    <TestCard icon={experienceIcon} />
  </div>
);

export default Feedback;
