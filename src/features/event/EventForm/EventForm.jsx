import React, { Component } from 'react';
import { connect } from 'react-redux';
import cuid from 'cuid';
import { reduxForm, Field } from 'redux-form';
import moment from 'moment';
import { createEvent, updateEvent } from '../eventActions';
import { composeValidators, combineValidators, isRequired, hasLengthGreaterThan } from 'revalidate';
import { Segment, Form, Button, Grid, Header } from 'semantic-ui-react';
import TextInput from '../../../app/common/form/TextInput';
import TextArea from '../../../app/common/form/TextArea';
import SelectInput from '../../../app/common/form/SelectInput';
import DateInput from '../../../app/common/form/DateInput';

const mapState = (state, ownProps) => {
  const eventId = ownProps.match.params.id;

  let event = {};

  if (event && state.events.length > 0) {
    event = state.events.find(event => event.id === eventId);
  }
  return {
    initialValues: event
  };
};
const actions = {
  createEvent,
  updateEvent
};
const category = [
  { key: 'drinks', text: 'Drinks', value: 'drinks' },
  { key: 'culture', text: 'Culture', value: 'culture' },
  { key: 'film', text: 'Film', value: 'film' },
  { key: 'food', text: 'Food', value: 'food' },
  { key: 'music', text: 'Music', value: 'music' },
  { key: 'travel', text: 'Travel', value: 'travel' }
];

const validate = combineValidators({
  title: isRequired({ message: 'The event title is required' }),
  category: isRequired({ message: 'Please provide a category' }),
  description: composeValidators(
    isRequired({ message: 'Please enter a description' }),
    hasLengthGreaterThan(4)({ message: 'Description needs to be at least 5 characters' })
  )(),
  city: isRequired('city'), //Throw default error when specify attribute's name
  venue: isRequired('venue'),
  date: isRequired('date')
});

class EventForm extends Component {
  // state = {
  //   event: Object.assign({}, this.props.event)
  // };
  // Thuc hien sau khi render
  // componentDidMount() {
  //   if (this.props.selectedEvent !== null) {
  //     this.setState({
  //       event: this.props.selectedEvent
  //     });
  //   }
  // }
  // Thuc hien khi props co su thay doi
  // componentWillReceiveProps(nextProps) {
  //   // console.log('current ', this.props.selectedEvent);
  //   // console.log('next ', nextProps.selectedEvent);
  //   if (nextProps.selectedEvent !== this.props.selectedEvent) {
  //     this.setState({
  //       event: nextProps.selectedEvent || emptyEvent // Neu ko co selectedEvent thi gan empty
  //     });
  //   }
  // }
  onFormSubmit = values => {
    values.date = moment(values.date).format();
    if (this.props.initialValues && this.props.initialValues.id) {
      this.props.updateEvent(values);
      this.props.history.goBack();
    } else {
      const newEvent = {
        ...values,
        id: cuid(),
        hostPhotoURL: '/assets/user.png',
        hostedBy: 'Bob'
      };
      this.props.createEvent(newEvent);
      this.props.history.push('/events');
    }
  };

  render() {
    const { invalid, submitting, pristine } = this.props;
    return (
      <Grid>
        <Grid.Column width={10}>
          <Segment>
            <Header sub color="teal" content="Event Details" />
            <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
              <Field name="title" type="text" component={TextInput} placeholder="Give your event a name" />
              <Field
                name="category"
                type="text"
                options={category}
                component={SelectInput}
                placeholder="What is your event about"
              />
              <Field
                name="description"
                type="text"
                rows={3}
                component={TextArea}
                placeholder="Tell us about your event"
              />
              <Header sub color="teal" content="Event Location Details" />
              <Field name="city" type="text" component={TextInput} placeholder="Event City" />
              <Field name="venue" type="text" component={TextInput} placeholder="Event Venue" />
              <Field
                name="date"
                type="text"
                component={DateInput}
                placeholder="Event Date"
                dateFormat="YYYY-MM-DD HH:mm"
                time="HH:mm"
                showTimeSelect
              />
              <Button disabled={invalid || submitting || pristine} positive type="submit">
                Submit
              </Button>
              <Button onClick={this.props.history.goBack} type="button">
                Cancel
              </Button>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}
export default connect(
  mapState,
  actions
)(reduxForm({ form: 'eventForm', enableReinitialize: true, validate })(EventForm));
