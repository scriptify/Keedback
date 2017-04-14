import React, { Component } from 'react';

import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import './style.css';

import FeatureAdder from '../FeatureAdder';

const TestCard = () => (
  <Card>
    <CardHeader
      title="Without Avatar"
      subtitle="Subtitle"
      actAsExpander
      showExpandableButton
    />
    <CardActions>
      <RaisedButton primary label="Delete" />
    </CardActions>
    <CardText expandable>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
      Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
      Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
    </CardText>
  </Card>
);

export default class Feature extends Component {
  render() {
    const { addFeatureMode, onFeatureAdded, onAdd } = this.props;

    if (addFeatureMode) {
      return (
        <FeatureAdder
          onFeatureAdded={onFeatureAdded}
        />
      );
    }

    return (
      <div className={`features`}>
        <div className={`development`}>
          <div className={`title`}>
            Development features
            <FloatingActionButton mini secondary onTouchTap={() => onAdd(`dev`)}>
              <ContentAdd />
            </FloatingActionButton>
          </div>
          <div className={`cards`}>
            <div className={`card`}>
              <TestCard />
            </div>
          </div>
        </div>
        <div className={`new`}>
          <div className={`title`}>
            New features
            <FloatingActionButton mini secondary onTouchTap={() => onAdd(`new`)}>
              <ContentAdd />
            </FloatingActionButton>
          </div>
          <div className={`cards`}>
            <div className={`card`}>
              <TestCard />
            </div>
          </div>
        </div>
      </div>
    );
  }

}
