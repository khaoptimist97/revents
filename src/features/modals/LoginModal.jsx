import React, { Component } from 'react';
import { Modal } from 'semantic-ui-react';
import { connect } from 'react-redux';

import LoginForm from '../auth/Login/LoginForm';
import { closeModal } from '../modals/modalActions';
import { t } from '@lingui/macro';

const actions = { closeModal };

class LoginModal extends Component {
  render() {
    const { i18n } = this.props;
    return (
      <Modal size="mini" open={true} onClose={this.props.closeModal}>
        <Modal.Header>{i18n._(t`Login to Re-vents`)}</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <LoginForm i18n={i18n} />
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

export default connect(
  null,
  actions
)(LoginModal);
