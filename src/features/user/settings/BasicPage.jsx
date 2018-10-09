import React, { Component } from 'react';
import { Segment, Form, Header, Divider, Button } from 'semantic-ui-react';
import { Field, reduxForm } from 'redux-form';
import DateInput from '../../../app/common/form/DateInput';
import PlaceInput from '../../../app/common/form/PlaceInput';
import TextInput from '../../../app/common/form/TextInput';
import RadioInput from '../../../app/common/form/RadioInput';
import moment from 'moment';
import { t } from '@lingui/macro';

class BasicPage extends Component {
  render() {
    const { pristine, submitting, handleSubmit, updateProfile, i18n } = this.props;
    return (
      <Segment>
        <Header dividing size="large" content="Basics" />
        <Form onSubmit={handleSubmit(updateProfile)}>
          <Field width={8} name="displayName" type="text" component={TextInput} placeholder="Known As" />
          <Form.Group inline>
            <label>Gender: </label>
            <Field name="gender" type="radio" value="male" label={i18n._(t`Male`)} component={RadioInput} />
            <Field name="gender" type="radio" value="female" label={i18n._(t`FeMale`)} component={RadioInput} />
          </Form.Group>
          <Field
            width={8}
            name="dateOfBirth"
            component={DateInput}
            placeholder={i18n._(t`Date of Birth`)}
            dateFormat="YYYY-MM-DD"
            showYearDropdown={true}
            showMonthDropdown={true}
            dropdownMode="select"
            maxDate={moment().subtract(18, 'years')}
          />
          <Field
            name="city"
            placeholder={i18n._(t`Home Town`)}
            options={{ types: ['(cities)'] }}
            label="Female"
            component={PlaceInput}
            width={8}
          />
          <Divider />
          <Button disabled={pristine || submitting} size="large" positive content={i18n._(t`Update Profile`)} />
        </Form>
      </Segment>
    );
  }
}

export default reduxForm({ form: 'userProfile', enableReinitialize: true, destroyOnUnmount: false })(BasicPage);
