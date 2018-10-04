import React, { Component } from 'react';
import { Feed } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';

class EventActivityItem extends Component {
  renderSummary = activity => {
    switch (activity.type) {
      case 'newEvent':
        return (
          <div>
            <Trans id="eventActivity.new">
              New Event!{' '}
              <Feed.User as={Link} to={{ pathname: '/profile/' + activity.hostUid }}>
                {activity.hostedBy}
              </Feed.User>{' '}
              is hosting <Link to={{ pathname: '/event/' + activity.eventId }}>{activity.title}</Link>
            </Trans>
          </div>
        );
      case 'cancelledEvent':
        return (
          <div>
            <Trans id="eventActivity.cancel">
              Event Cancelled!{' '}
              <Feed.User as={Link} to={{ pathname: '/profile/' + activity.hostUid }}>
                {activity.hostedBy}
              </Feed.User>{' '}
              has cancelled <Link to={{ pathname: '/event/' + activity.eventId }}>{activity.title}</Link>
            </Trans>
          </div>
        );
      default:
        return;
    }
  };

  render() {
    const { activity } = this.props;

    return (
      <Feed.Event>
        <Feed.Label>
          <img src={activity.photoURL || '/assets/user.png'} alt="" />
        </Feed.Label>
        <Feed.Content>
          <Feed.Summary>{this.renderSummary(activity)}</Feed.Summary>
          <Feed.Meta>
            <Feed.Date>{distanceInWordsToNow(activity.timestamp.toDate())} ago</Feed.Date>
          </Feed.Meta>
        </Feed.Content>
      </Feed.Event>
    );
  }
}

export default EventActivityItem;
