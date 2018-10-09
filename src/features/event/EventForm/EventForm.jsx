/*global google*/

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { withFirestore } from 'react-redux-firebase';
import Script from 'react-load-script';
import { createEvent, updateEvent, cancelToggle } from '../eventActions';
import { composeValidators, combineValidators, isRequired, hasLengthGreaterThan } from 'revalidate';
import { Segment, Form, Button, Grid, Header } from 'semantic-ui-react';
import TextInput from '../../../app/common/form/TextInput';
import TextArea from '../../../app/common/form/TextArea';
import SelectInput from '../../../app/common/form/SelectInput';
import DateInput from '../../../app/common/form/DateInput';
import PlaceInput from '../../../app/common/form/PlaceInput';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';

const mapState = state => {
  let event = {};

  if (state.firestore.ordered.events && state.firestore.ordered.events[0]) {
    event = state.firestore.ordered.events[0];
  }
  return {
    initialValues: event,
    event,
    hostedBy: state.firebase.auth.displayName,
    loading: state.async.loading
  };
};
const actions = {
  createEvent,
  updateEvent,
  cancelToggle
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
  state = {
    cityLatLng: {},
    venueLatLng: {},
    scriptLoaded: false
  };
  handleCitySelect = selectedCity => {
    geocodeByAddress(selectedCity)
      .then(results => getLatLng(results[0]))
      .then(latlng => {
        this.setState({
          cityLatLng: latlng
        });
      })
      .then(() => {
        // This is method of redux form to change particular field
        this.props.change('city', selectedCity);
      });
  };
  handleVenueSelect = selectedVenue => {
    geocodeByAddress(selectedVenue)
      .then(results => getLatLng(results[0]))
      .then(latlng => {
        this.setState({
          venueLatLng: latlng
        });
      })
      .then(() => {
        // This is method of redux form to change particular field
        this.props.change('venue', selectedVenue);
      });
  };
  handleScriptLoad = () => {
    this.setState({
      scriptLoaded: true
    });
  };
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
  async componentDidMount() {
    const { firestore, match } = this.props;
    await firestore.setListener(`events/${match.params.id}`);
  }
  async componentWillUnmount() {
    const { firestore, match } = this.props;
    await firestore.unsetListener(`events/${match.params.id}`);
  }
  onFormSubmit = async values => {
    values.venueLatLng = this.state.venueLatLng;
    values.hostedBy = this.props.hostedBy;
    if (Object.keys(values.venueLatLng).length === 0) {
      values.venueLatLng = this.props.event.venueLatLng;
    }
    if (this.props.initialValues && this.props.initialValues.id) {
      await this.props.updateEvent(values);
      this.props.history.goBack();
    } else {
      this.props.createEvent(values);
      this.props.history.push('/events');
    }
  };

  render() {
    const { loading, invalid, submitting, pristine, event, cancelToggle, i18n } = this.props;
    return (
      <Grid>
        <Script
          url="https://maps.googleapis.com/maps/api/js?key=AIzaSyCY5dFbUdf5tYDX7sNRqRA2-wVIeSiKymg&libraries=places"
          onLoad={this.handleScriptLoad}
        />
        <Grid.Column width={10}>
          <Segment>
            <Header sub color="teal" content={i18n._(t`Event Details`)} />
            <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
              <Field name="title" type="text" component={TextInput} placeholder={i18n._(t`Give your event a name`)} />
              <Field
                name="category"
                type="text"
                options={category}
                component={SelectInput}
                placeholder={i18n._(t`What is your event about`)}
              />
              <Field
                name="description"
                type="text"
                rows={3}
                component={TextArea}
                placeholder={i18n._(t`Tell us about your event`)}
              />
              <Header sub color="teal" content={i18n._(t`Event Location Details`)} />
              {this.state.scriptLoaded && (
                <Field
                  name="city"
                  type="text"
                  component={PlaceInput}
                  placeholder={i18n._(t`Event City`)}
                  options={{ types: ['(cities)'] }}
                  onSelect={this.handleCitySelect}
                />
              )}
              {this.state.scriptLoaded && (
                <Field
                  name="venue"
                  type="text"
                  options={{
                    location: new google.maps.LatLng(this.state.cityLatLng),
                    radius: 1000,
                    types: ['establishment']
                  }}
                  component={PlaceInput}
                  placeholder={i18n._(t`Event Venue`)}
                  onSelect={this.handleVenueSelect}
                />
              )}
              <Field
                name="date"
                type="text"
                component={DateInput}
                placeholder={i18n._(t`Event Date`)}
                dateFormat="YYYY-MM-DD HH:mm"
                time="HH:mm"
                showTimeSelect
              />
              <Button loading={loading} disabled={invalid || submitting || pristine} positive type="submit">
                {i18n._(t`Submit`)}
              </Button>
              <Button disabled={loading} onClick={this.props.history.goBack} type="button">
                {i18n._(t`Cancel`)}
              </Button>
              {event.id && (
                <Button
                  onClick={() => cancelToggle(!event.cancelled, event.id)}
                  type="button"
                  color={event.cancelled ? 'green' : 'red'}
                  floated="right"
                  content={event.cancelled ? i18n._(t`Reactivate Event`) : i18n._(t`Cancel Event`)}
                />
              )}
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}
export default withI18n()(
  withFirestore(
    connect(
      mapState,
      actions
    )(reduxForm({ form: 'eventForm', enableReinitialize: true, validate })(EventForm))
  )
);
