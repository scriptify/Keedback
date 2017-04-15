import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import './style.css';

import FeatureAdder from '../FeatureAdder';

const FeatureCard = ({ title, description, isDev = true, onDelete = () => {}, onMoveToDevelopmentStage = () => {} }) => (
  <div className={`card`}>
    <Card>
      <CardHeader
        title={title}
        actAsExpander
        showExpandableButton
      />
      <CardActions>
        <RaisedButton primary label="Delete" onTouchTap={onDelete} />
        {
          !isDev &&
            <RaisedButton primary label="Move to development stage" onTouchTap={onMoveToDevelopmentStage} />
        }
      </CardActions>
      <CardText expandable>
        { description }
      </CardText>
    </Card>
  </div>
);

@inject(`uiStore`, `dataStore`)
@observer
export default class Feature extends Component {
  render() {
    const { addFeatureMode, onFeatureAdded, onAdd, dataStore } = this.props;

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
            {
              dataStore.developmentFeatures.map(({ DFID, title, description }) =>
                <FeatureCard
                  title={title}
                  description={description}
                  key={DFID}
                  onDelete={() => dataStore.deleteDevelopmentFeature(DFID)}
                />
              )
            }
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
            {
              dataStore.newFeatures.map(({ NFID, title, description }) =>
                <FeatureCard
                  title={title}
                  description={description}
                  key={NFID}
                  isDev={false}
                  onDelete={() => dataStore.deleteNewFeature(NFID)}
                  onMoveToDevelopmentStage={() => dataStore.moveNewFeatureToDevelopmentStage(NFID)}
                />
              )
            }
          </div>
        </div>
      </div>
    );
  }

}
