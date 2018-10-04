import React, { Component } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { Field, reduxForm } from 'redux-form';
import TextArea from '../../../app/common/form/TextArea';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';

class EventDetailedChatForm extends Component {
  handleChatSubmit = values => {
    const { addEventComment, reset, eventId, closeForm, parentId } = this.props;
    addEventComment(eventId, values, parentId);
    reset();
    if (parentId !== 0) {
      closeForm();
    }
  };
  render() {
    const { i18n } = this.props;
    return (
      <Form onSubmit={this.props.handleSubmit(this.handleChatSubmit)}>
        <Field name="comment" type="text" component={TextArea} rows={2} />
        <Button type="submit" content={i18n._(t`Add Reply`)} labelPosition="left" icon="edit" primary />
      </Form>
    );
  }
}
export default withI18n()(reduxForm({ Fields: 'comment' })(EventDetailedChatForm));
