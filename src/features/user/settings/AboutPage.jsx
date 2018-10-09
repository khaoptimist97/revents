import React from 'react';
import { Button, Divider, Form, Header, Segment } from 'semantic-ui-react';
import { Field, reduxForm } from 'redux-form';
import RadioInput from '../../../app/common/form/RadioInput';
import TextInput from '../../../app/common/form/TextInput';
import TextArea from '../../../app/common/form/TextArea';
import PlaceInput from '../../../app/common/form/PlaceInput';
import SelectInput from '../../../app/common/form/SelectInput';
import { t } from '@lingui/macro';
import { Trans } from '@lingui/macro';

const interests = [
  { key: 'drinks', text: 'Drinks', value: 'drinks' },
  { key: 'culture', text: 'Culture', value: 'culture' },
  { key: 'film', text: 'Film', value: 'film' },
  { key: 'food', text: 'Food', value: 'food' },
  { key: 'music', text: 'Music', value: 'music' },
  { key: 'travel', text: 'Travel', value: 'travel' }
];

const AboutPage = ({ pristine, submitting, handleSubmit, updateProfile, i18n }) => {
  return (
    <Segment>
      <Header dividing size="large" content={i18n._(t`About me`)} />
      <p>
        <Trans id="about.completePro">Complete your profile to get the most out of this site</Trans>
      </p>
      <Form onSubmit={handleSubmit(updateProfile)}>
        <Form.Group inline>
          <label>Tell us your status: </label>
          <Field name="status" component={RadioInput} type="radio" value="single" label={i18n._(t`Single`)} />
          <Field
            name="status"
            component={RadioInput}
            type="radio"
            value="relationship"
            label={i18n._(t`Relationship`)}
          />
          <Field name="status" component={RadioInput} type="radio" value="married" label={i18n._(t`Married`)} />
        </Form.Group>
        <Divider />
        <label>
          <Trans id="about.tellYours">Tell us about yourself</Trans>
        </label>
        <Field name="about" component={TextArea} placeholder={i18n._(t`About me`)} />
        <Field
          name="interests"
          component={SelectInput}
          options={interests}
          value="interests"
          multiple={true}
          placeholder={i18n._(t`Select your interests`)}
        />
        <Field width={8} name="occupation" type="text" component={TextInput} placeholder={i18n._(t`Occupation`)} />
        <Field
          width={8}
          name="origin"
          options={{ types: ['(regions)'] }}
          component={PlaceInput}
          placeholder={i18n._(t`Country of Origin`)}
        />
        <Divider />
        <Button disabled={pristine || submitting} size="large" positive content={i18n._(t`Update Profile`)} />
      </Form>
    </Segment>
  );
};

export default reduxForm({ form: 'userProfile', enableReinitialize: true, destroyOnUnmount: false })(AboutPage);
