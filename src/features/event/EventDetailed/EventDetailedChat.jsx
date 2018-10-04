import React, { Component } from 'react';
import { Segment, Header, Comment } from 'semantic-ui-react';
import EventDetailedChatForm from './EventDetailedChatForm';
import { Link } from 'react-router-dom';
import distanceInWords from 'date-fns/distance_in_words';
import { Trans } from '@lingui/macro';

class EventDetailedChat extends Component {
  state = {
    showReplyButton: false,
    selectedCommentId: null
  };
  handleOpenReplyButton = id => () => {
    this.setState({
      showReplyButton: true,
      selectedCommentId: id
    });
  };
  handleCloseReplyForm = () => {
    this.setState({
      showReplyButton: false,
      selectedCommentId: null
    });
  };
  render() {
    const { addEventComment, eventId, eventChat } = this.props;
    const { showReplyButton, selectedCommentId } = this.state;
    return (
      <div>
        <Segment textAlign="center" attached="top" inverted color="teal" style={{ border: 'none' }}>
          <Header>
            <Trans id="eventDetail.chat">Chat about this event</Trans>
          </Header>
        </Segment>

        <Segment attached>
          <Comment.Group>
            {eventChat &&
              eventChat.map(comment => (
                <Comment key={comment.id}>
                  <Comment.Avatar src={comment.photoURL} />
                  <Comment.Content>
                    <Comment.Author as={Link} to={`profile/${comment.uid}`}>
                      {comment.displayName}
                    </Comment.Author>
                    <Comment.Metadata>
                      <div>{distanceInWords(comment.date, Date.now())} ago</div>
                    </Comment.Metadata>
                    <Comment.Text>{comment.text}</Comment.Text>
                    <Comment.Actions>
                      <Comment.Action onClick={this.handleOpenReplyButton(comment.id)}>
                        <Trans id="reply">Reply</Trans>
                      </Comment.Action>
                      {showReplyButton &&
                        selectedCommentId === comment.id && (
                          <EventDetailedChatForm
                            addEventComment={addEventComment}
                            eventId={eventId}
                            form={`reply_${comment.id}`}
                            closeForm={this.handleCloseReplyForm}
                            parentId={comment.id}
                          />
                        )}
                    </Comment.Actions>
                  </Comment.Content>
                  {comment.childNodes &&
                    comment.childNodes.map(child => (
                      <Comment.Group>
                        <Comment key={child.id}>
                          <Comment.Avatar src={child.photoURL} />
                          <Comment.Content>
                            <Comment.Author as={Link} to={`profile/${child.uid}`}>
                              {child.displayName}
                            </Comment.Author>
                            <Comment.Metadata>
                              <div>{distanceInWords(child.date, Date.now())} ago</div>
                            </Comment.Metadata>
                            <Comment.Text>{child.text}</Comment.Text>
                            <Comment.Actions>
                              <Comment.Action onClick={this.handleOpenReplyButton(child.id)}>Reply</Comment.Action>
                              {showReplyButton &&
                                selectedCommentId === child.id && (
                                  <EventDetailedChatForm
                                    addEventComment={addEventComment}
                                    eventId={eventId}
                                    form={`reply_${child.id}`}
                                    closeForm={this.handleCloseReplyForm}
                                    parentId={child.parentId}
                                  />
                                )}
                            </Comment.Actions>
                          </Comment.Content>
                        </Comment>
                      </Comment.Group>
                    ))}
                </Comment>
              ))}
          </Comment.Group>
          <EventDetailedChatForm parentId={0} addEventComment={addEventComment} eventId={eventId} form="newComment" />
        </Segment>
      </div>
    );
  }
}

export default EventDetailedChat;
