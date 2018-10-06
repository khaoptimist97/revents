import React, { Component } from 'react';
import { Modal } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { closeModal } from '../modals/modalActions';
import RegisterForm from '../auth/Register/RegisterForm';
import { t } from '@lingui/macro';

const actions = { closeModal };

class RegisterModal extends Component {
  render() {
    const { i18n } = this.props;
    return (
      <Modal size="mini" open={true} onClose={this.props.closeModal}>
        <Modal.Header>{i18n._(t`Sign Up to Re-vents!`)}</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <RegisterForm i18n={i18n} />
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

export default connect(
  null,
  actions
)(RegisterModal);
