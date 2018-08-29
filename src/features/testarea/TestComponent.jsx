import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import PlacesAutocomplete from 'react-places-autocomplete';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { incrementAsync, decrementAsync } from './testActions';
import { openModal } from '../modals/modalActions';

const mapState = state => ({
  data: state.test.data,
  loading: state.test.loading
});
const actions = {
  incrementAsync,
  decrementAsync,
  openModal
};

class TestComponent extends Component {
  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };
  state = {
    address: '',
    scriptLoaded: false
  };
  handleScriptLoad = () => {
    this.setState({
      scriptLoaded: true
    });
  };
  handleFormSubmit = event => {
    event.preventDefault();

    geocodeByAddress(this.state.address)
      .then(results => getLatLng(results[0]))
      .then(latLng => console.log('Success', latLng))
      .catch(error => console.error('Error', error));
  };
  onChange = address => this.setState({ address });
  render() {
    const inputProps = {
      value: this.state.address,
      onChange: this.onChange
    };
    const { incrementAsync, decrementAsync, data, openModal, loading } = this.props;
    return (
      <div>
        {/* <Script
          url="https://maps.googleapis.com/maps/api/js?key=AIzaSyCY5dFbUdf5tYDX7sNRqRA2-wVIeSiKymg&libraries=places"
          onLoad={this.handleScriptLoad}
        /> */}
        <h1>Test Area</h1>
        <h3>The answer is: {data}</h3>
        <Button loading={loading} onClick={incrementAsync} content="Increase" color="green" />
        <Button loading={loading} onClick={decrementAsync} content="Decrease" color="red" />
        <Button onClick={() => openModal('TestModal', { data: 43 })} content="Open Modal" color="teal" />
        <br />
        <br />
        <form onSubmit={this.handleFormSubmit}>
          {this.state.scriptLoaded && <PlacesAutocomplete inputProps={inputProps} />}
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}
export default connect(
  mapState,
  actions
)(TestComponent);
